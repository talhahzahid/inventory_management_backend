import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import Inventory from "../models/inventory.model.js";
import Product from "../models/products.model.js";
import Purchase from "../models/purchases.model.js";
import PurchaseItem from "../models/purchase_items.model.js";
import Supplier from "../models/suppliers.model.js";
import User from "../models/users.model.js";

const purchaseIncludes = [
  {
    model: Supplier,
    as: "supplier",
    attributes: ["id", "name", "email", "phone"],
  },
  {
    model: User,
    as: "buyer",
    attributes: ["id", "name", "email"],
  },
  {
    model: PurchaseItem,
    as: "items",
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "sku", "name", "purchase_price"],
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

export const createPurchaseService = async (data) => {
  const t = await sequelize.transaction();

  try {
    if (!data.items?.length) {
      const error = new Error("At least one purchase item is required");
      error.statusCode = 400;
      throw error;
    }

    const supplier = await Supplier.findOne({
      where: { id: data.supplier_id, company_id: data.company_id },
      transaction: t,
    });

    if (!supplier) {
      const error = new Error("Supplier not found for this company");
      error.statusCode = 404;
      throw error;
    }

    let totalAmount = 0;
    const purchaseItemsData = [];

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

      const newQty = inventory.quantity + qty;

      if (inventory.maximum_stock > 0 && newQty > inventory.maximum_stock) {
        const error = new Error(
          `Purchase exceeds maximum stock for ${product.name}. Max: ${inventory.maximum_stock}, would become: ${newQty}`,
        );
        error.statusCode = 400;
        throw error;
      }

      const unitCost = item.unit_cost ?? product.purchase_price;
      const subtotal = Number(unitCost) * qty;
      totalAmount += subtotal;

      purchaseItemsData.push({
        product_id: product.id,
        quantity: qty,
        unit_cost: unitCost,
        subtotal,
        inventory,
        newQty,
      });
    }

    const purchase = await Purchase.create(
      {
        company_id: data.company_id,
        supplier_id: data.supplier_id,
        purchased_by: data.purchased_by,
        total_amount: totalAmount,
        status: "completed",
        notes: data.notes,
      },
      { transaction: t },
    );

    for (const item of purchaseItemsData) {
      await PurchaseItem.create(
        {
          purchase_id: purchase.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_cost: item.unit_cost,
          subtotal: item.subtotal,
        },
        { transaction: t },
      );

      await item.inventory.update({ quantity: item.newQty }, { transaction: t });
    }

    await t.commit();

    return Purchase.findByPk(purchase.id, { include: purchaseIncludes });
  } catch (error) {
    await t.rollback();

    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to create purchase");
    err.statusCode = 500;
    throw err;
  }
};

export const getAllPurchasesService = async (
  page,
  limit,
  id = null,
  companyId = null,
  search = null,
  supplierId = null,
  fromDate = null,
  toDate = null,
) => {
  try {
    const where = { status: "completed" };

    if (companyId) {
      where.company_id = companyId;
    }

    if (supplierId) {
      where.supplier_id = supplierId;
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
      where.notes = { [Op.iLike]: `%${search.trim()}%` };
    }

    if (id) {
      const purchase = await Purchase.findOne({
        where: { ...where, id },
        include: purchaseIncludes,
      });

      if (!purchase) {
        const err = new Error("Purchase not found");
        err.statusCode = 404;
        throw err;
      }

      assertOwnership(purchase, companyId);

      return purchase;
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(limit) || 10);
    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Purchase.findAndCountAll({
      where,
      include: purchaseIncludes,
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
    const err = new Error(error.message || "Failed to fetch purchases");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};
