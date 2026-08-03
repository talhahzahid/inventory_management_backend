import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import Category from "../models/categories.model.js";
import Company from "../models/company.model.js";
import Inventory from "../models/inventory.model.js";
import Product from "../models/products.model.js";
import Supplier from "../models/suppliers.model.js";

const productIncludes = [
  {
    model: Company,
    as: "company",
    attributes: ["id", "name", "email"],
  },
  {
    model: Category,
    as: "category",
    attributes: ["id", "name"],
  },
  {
    model: Supplier,
    as: "supplier",
    attributes: ["id", "name", "email"],
  },
  {
    model: Inventory,
    as: "inventory",
    attributes: [
      "id",
      "quantity",
      "minimum_stock",
      "maximum_stock",
      "warehouse_location",
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

const validateProductRelations = async (companyId, categoryId, supplierId) => {
  const company = await Company.findByPk(companyId);

  if (!company) {
    const error = new Error("Company not found");
    error.statusCode = 404;
    throw error;
  }

  const category = await Category.findOne({
    where: { id: categoryId, company_id: companyId },
  });

  if (!category) {
    const error = new Error("Category not found for this company");
    error.statusCode = 404;
    throw error;
  }

  const supplier = await Supplier.findOne({
    where: { id: supplierId, company_id: companyId },
  });

  if (!supplier) {
    const error = new Error("Supplier not found for this company");
    error.statusCode = 404;
    throw error;
  }
};

export const createProductService = async (data) => {
  const t = await sequelize.transaction();

  try {
    await validateProductRelations(
      data.company_id,
      data.category_id,
      data.supplier_id,
    );

    const existingProduct = await Product.findOne({
      where: {
        company_id: data.company_id,
        sku: data.sku,
      },
      transaction: t,
    });

    if (existingProduct) {
      const error = new Error("Product with this SKU already exists");
      error.statusCode = 409;
      throw error;
    }

    const product = await Product.create(
      {
        company_id: data.company_id,
        category_id: data.category_id,
        supplier_id: data.supplier_id,
        sku: data.sku,
        name: data.name,
        description: data.description,
        purchase_price: data.purchase_price,
        selling_price: data.selling_price,
        status: data.status || "active",
      },
      { transaction: t },
    );

    await Inventory.create(
      {
        company_id: data.company_id,
        product_id: product.id,
        quantity: data.quantity ?? 0,
        minimum_stock: data.minimum_stock ?? 0,
        maximum_stock: data.maximum_stock ?? 0,
        warehouse_location: data.warehouse_location,
      },
      { transaction: t },
    );

    await t.commit();

    return Product.findByPk(product.id, { include: productIncludes });
  } catch (error) {
    await t.rollback();

    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to create product");
    err.statusCode = 500;
    throw err;
  }
};

export const getAllProductsService = async (
  page,
  limit,
  id = null,
  companyId = null,
  status = null,
  search = null,
  categoryId = null,
  supplierId = null,
) => {
  try {
    const where = {};

    if (companyId) {
      where.company_id = companyId;
    }

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.category_id = categoryId;
    }

    if (supplierId) {
      where.supplier_id = supplierId;
    }

    if (search?.trim()) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search.trim()}%` } },
        { sku: { [Op.iLike]: `%${search.trim()}%` } },
      ];
    }

    if (id) {
      const product = await Product.findOne({
        where: { ...where, id },
        include: productIncludes,
      });

      if (!product) {
        const err = new Error("Product not found");
        err.statusCode = 404;
        throw err;
      }

      assertOwnership(product, companyId);

      return product;
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(limit) || 10);
    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: productIncludes,
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
    const err = new Error(error.message || "Failed to fetch products");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

export const updateProductService = async (id, data, companyId = null) => {
  try {
    const product = await Product.findByPk(id);

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    assertOwnership(product, companyId);

    const categoryId = data.category_id ?? product.category_id;
    const supplierId = data.supplier_id ?? product.supplier_id;

    if (data.category_id || data.supplier_id) {
      await validateProductRelations(
        product.company_id,
        categoryId,
        supplierId,
      );
    }

    if (data.sku && data.sku !== product.sku) {
      const existingProduct = await Product.findOne({
        where: {
          company_id: product.company_id,
          sku: data.sku,
        },
      });

      if (existingProduct && existingProduct.id !== product.id) {
        const error = new Error("Product with this SKU already exists");
        error.statusCode = 409;
        throw error;
      }
    }

    await product.update({
      category_id: data.category_id ?? product.category_id,
      supplier_id: data.supplier_id ?? product.supplier_id,
      sku: data.sku ?? product.sku,
      name: data.name ?? product.name,
      description: data.description ?? product.description,
      purchase_price: data.purchase_price ?? product.purchase_price,
      selling_price: data.selling_price ?? product.selling_price,
      status: data.status ?? product.status,
    });

    return Product.findByPk(product.id, { include: productIncludes });
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to update product");
    err.statusCode = 500;
    throw err;
  }
};

export const deactivateProductService = async (id, companyId = null) => {
  try {
    const product = await Product.findByPk(id);

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    assertOwnership(product, companyId);

    if (product.status === "inactive") {
      const error = new Error("Product is already inactive");
      error.statusCode = 409;
      throw error;
    }

    await product.update({ status: "inactive" });

    return product;
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to deactivate product");
    err.statusCode = 500;
    throw err;
  }
};
