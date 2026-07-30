import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import Inventory from "../models/inventory.model.js";
import Product from "../models/products.model.js";
import Sale from "../models/sales.model.js";
import SaleItem from "../models/sale_items.model.js";
import User from "../models/users.model.js";

const saleIncludes = [
  {
    model: User,
    as: "seller",
    attributes: ["id", "name", "email"],
  },
  {
    model: SaleItem,
    as: "items",
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "sku", "name", "selling_price"],
      },
    ],
  },
];

const assertOwnership = (record, companyId) => {
  if (companyId && record.company_id !== companyId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
};

export const createSaleService = async (data) => {
  const t = await sequelize.transaction();

  try {
    if (!data.items?.length) {
      const error = new Error("At least one sale item is required");
      error.statusCode = 400;
      throw error;
    }

    let totalAmount = 0;
    const saleItemsData = [];

    for (const item of data.items) {
      const product = await Product.findOne({
        where: { id: item.product_id, company_id: data.company_id },
        transaction: t,
      });

      if (!product) {
        const error = new Error(`Product ${item.product_id} not found`);
        error.statusCode = 404;
        throw error;
      }

      if (product.status !== "active") {
        const error = new Error(`Product ${product.name} is not active`);
        error.statusCode = 400;
        throw error;
      }

      const inventory = await Inventory.findOne({
        where: { product_id: product.id, company_id: data.company_id },
        transaction: t,
      });

      if (!inventory) {
        const error = new Error(`Inventory not found for ${product.name}`);
        error.statusCode = 404;
        throw error;
      }

      const qty = Number(item.quantity);

      if (!qty || qty < 1) {
        const error = new Error("Invalid quantity");
        error.statusCode = 400;
        throw error;
      }

      if (inventory.quantity < qty) {
        const error = new Error(
          `Insufficient stock for ${product.name}. Available: ${inventory.quantity}`,
        );
        error.statusCode = 400;
        throw error;
      }

      const unitPrice = item.unit_price ?? product.selling_price;
      const subtotal = Number(unitPrice) * qty;
      totalAmount += subtotal;

      saleItemsData.push({
        product_id: product.id,
        quantity: qty,
        unit_price: unitPrice,
        subtotal,
        inventory,
      });
    }

    const sale = await Sale.create(
      {
        company_id: data.company_id,
        sold_by: data.sold_by,
        customer_name: data.customer_name,
        total_amount: totalAmount,
        status: "completed",
        notes: data.notes,
      },
      { transaction: t },
    );

    for (const item of saleItemsData) {
      await SaleItem.create(
        {
          sale_id: sale.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        },
        { transaction: t },
      );

      await item.inventory.update(
        { quantity: item.inventory.quantity - item.quantity },
        { transaction: t },
      );
    }

    await t.commit();

    return Sale.findByPk(sale.id, { include: saleIncludes });
  } catch (error) {
    await t.rollback();

    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to create sale");
    err.statusCode = 500;
    throw err;
  }
};

export const getAllSalesService = async (
  page,
  limit,
  id = null,
  companyId = null,
  search = null,
  fromDate = null,
  toDate = null,
) => {
  try {
    const where = { status: "completed" };

    if (companyId) {
      where.company_id = companyId;
    }

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt[Op.gte] = new Date(fromDate);
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = end;
      }
    }

    if (search?.trim()) {
      where[Op.or] = [
        { customer_name: { [Op.iLike]: `%${search.trim()}%` } },
        { notes: { [Op.iLike]: `%${search.trim()}%` } },
      ];
    }

    if (id) {
      const sale = await Sale.findOne({
        where: { ...where, id },
        include: saleIncludes,
      });

      if (!sale) {
        const err = new Error("Sale not found");
        err.statusCode = 404;
        throw err;
      }

      assertOwnership(sale, companyId);

      return sale;
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(limit) || 10);
    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Sale.findAndCountAll({
      where,
      include: saleIncludes,
      limit: pageSize,
      offset,
      order: [["id", "DESC"]],
    });

    return {
      total: count,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(count / pageSize),
      data: rows,
    };
  } catch (error) {
    const err = new Error(error.message || "Failed to fetch sales");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

export const getSalesSummaryService = async (companyId = null) => {
  try {
    const where = { status: "completed" };

    if (companyId) {
      where.company_id = companyId;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySales = await Sale.findAll({
      where: {
        ...where,
        createdAt: { [Op.gte]: today, [Op.lt]: tomorrow },
      },
      attributes: ["id", "total_amount"],
    });

    const allSales = await Sale.findAll({
      where,
      attributes: ["id", "total_amount"],
    });

    const todayCount = todaySales.length;
    const todayAmount = todaySales.reduce(
      (sum, s) => sum + Number(s.total_amount),
      0,
    );
    const totalCount = allSales.length;
    const totalAmount = allSales.reduce(
      (sum, s) => sum + Number(s.total_amount),
      0,
    );

    return {
      today: { count: todayCount, amount: todayAmount },
      total: { count: totalCount, amount: totalAmount },
    };
  } catch (error) {
    const err = new Error(error.message || "Failed to fetch sales summary");
    err.statusCode = 500;
    throw err;
  }
};
