import { Op, col, where as sequelizeWhere } from "sequelize";
import Inventory from "../models/inventory.model.js";
import Product from "../models/products.model.js";
import Company from "../models/company.model.js";

const inventoryIncludes = [
  {
    model: Product,
    as: "product",
    attributes: [
      "id",
      "sku",
      "name",
      "status",
      "purchase_price",
      "selling_price",
    ],
  },
  {
    model: Company,
    as: "company",
    attributes: ["id", "name", "email"],
  },
];

const assertOwnership = (record, companyId) => {
  if (companyId && record.company_id !== companyId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
};

export const getAllInventoryService = async (
  page,
  limit,
  id = null,
  companyId = null,
  search = null,
  lowStock = false,
) => {
  try {
    const where = {};

    if (companyId) {
      where.company_id = companyId;
    }

    if (lowStock) {
      where[Op.and] = sequelizeWhere(
        col("quantity"),
        "<=",
        col("minimum_stock"),
      );
    }

    const productWhere = {};

    if (search?.trim()) {
      productWhere[Op.or] = [
        { name: { [Op.iLike]: `%${search.trim()}%` } },
        { sku: { [Op.iLike]: `%${search.trim()}%` } },
      ];
    }

    if (id) {
      const inventory = await Inventory.findOne({
        where: { ...where, id },
        include: inventoryIncludes,
      });

      if (!inventory) {
        const err = new Error("Inventory record not found");
        err.statusCode = 404;
        throw err;
      }

      assertOwnership(inventory, companyId);

      return inventory;
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(limit) || 10);
    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Inventory.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "sku",
            "name",
            "status",
            "purchase_price",
            "selling_price",
          ],
          where: Object.keys(productWhere).length ? productWhere : undefined,
          required: Object.keys(productWhere).length > 0,
        },
        {
          model: Company,
          as: "company",
          attributes: ["id", "name", "email"],
        },
      ],
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
    const err = new Error(error.message || "Failed to fetch inventory");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

export const updateInventoryService = async (id, data, companyId = null) => {
  try {
    const inventory = await Inventory.findByPk(id);

    if (!inventory) {
      const error = new Error("Inventory record not found");
      error.statusCode = 404;
      throw error;
    }

    assertOwnership(inventory, companyId);

    const quantity = data.quantity ?? inventory.quantity;
    const minimumStock = data.minimum_stock ?? inventory.minimum_stock;
    const maximumStock = data.maximum_stock ?? inventory.maximum_stock;

    if (quantity < 0) {
      const error = new Error("Quantity cannot be negative");
      error.statusCode = 400;
      throw error;
    }

    if (maximumStock > 0 && quantity > maximumStock) {
      const error = new Error("Quantity cannot exceed maximum stock");
      error.statusCode = 400;
      throw error;
    }

    await inventory.update({
      quantity,
      minimum_stock: minimumStock,
      maximum_stock: maximumStock,
      warehouse_location:
        data.warehouse_location ?? inventory.warehouse_location,
    });

    return Inventory.findByPk(inventory.id, { include: inventoryIncludes });
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to update inventory");
    err.statusCode = 500;
    throw err;
  }
};

export const adjustStockService = async (id, adjustment, companyId = null) => {
  try {
    const inventory = await Inventory.findByPk(id);

    if (!inventory) {
      const error = new Error("Inventory record not found");
      error.statusCode = 404;
      throw error;
    }

    assertOwnership(inventory, companyId);

    if (adjustment === undefined || adjustment === null) {
      const error = new Error("Adjustment value is required");
      error.statusCode = 400;
      throw error;
    }

    const newQuantity = inventory.quantity + Number(adjustment);

    if (newQuantity < 0) {
      const error = new Error("Insufficient stock for this adjustment");
      error.statusCode = 400;
      throw error;
    }

    if (inventory.maximum_stock > 0 && newQuantity > inventory.maximum_stock) {
      const error = new Error("Adjustment exceeds maximum stock limit");
      error.statusCode = 400;
      throw error;
    }

    await inventory.update({ quantity: newQuantity });

    return Inventory.findByPk(inventory.id, { include: inventoryIncludes });
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to adjust stock");
    err.statusCode = 500;
    throw err;
  }
};
