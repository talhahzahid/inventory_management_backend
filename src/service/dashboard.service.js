import { Op, col, where as sequelizeWhere } from "sequelize";
import Inventory from "../models/inventory.model.js";
import Product from "../models/products.model.js";
import Category from "../models/categories.model.js";
import Supplier from "../models/suppliers.model.js";
import { getSalesSummaryService } from "./sale.service.js";

export const getDashboardSummaryService = async (companyId = null) => {
  try {
    const productWhere = { status: "active" };
    const inventoryWhere = {};

    if (companyId) {
      productWhere.company_id = companyId;
      inventoryWhere.company_id = companyId;
    }

    const totalProducts = await Product.count({ where: productWhere });

    const lowStockItems = await Inventory.findAll({
      where: {
        ...inventoryWhere,
        [Op.and]: sequelizeWhere(col("quantity"), "<=", col("minimum_stock")),
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "sku", "name", "status"],
          where: { status: "active" },
        },
      ],
    });

    const reorderList = lowStockItems.map((item) => {
      const suggestedQty =
        item.maximum_stock > 0
          ? item.maximum_stock - item.quantity
          : Math.max(item.minimum_stock - item.quantity, item.minimum_stock);

      return {
        product_id: item.product_id,
        product_name: item.product?.name,
        sku: item.product?.sku,
        current_stock: item.quantity,
        minimum_stock: item.minimum_stock,
        maximum_stock: item.maximum_stock,
        suggested_purchase_qty: Math.max(suggestedQty, 0),
        warehouse_location: item.warehouse_location,
      };
    });

    const salesSummary = await getSalesSummaryService(companyId);

    const totalCategories = await Category.count({
      where: companyId ? { company_id: companyId, status: "active" } : { status: "active" },
    });

    const totalSuppliers = await Supplier.count({
      where: companyId ? { company_id: companyId, status: "active" } : { status: "active" },
    });

    const totalStockUnits = await Inventory.sum("quantity", {
      where: inventoryWhere,
    });

    return {
      total_products: totalProducts,
      total_categories: totalCategories,
      total_suppliers: totalSuppliers,
      total_stock_units: totalStockUnits || 0,
      low_stock_count: lowStockItems.length,
      sales: salesSummary,
      reorder_list: reorderList,
    };
  } catch (error) {
    const err = new Error(error.message || "Failed to fetch dashboard summary");
    err.statusCode = 500;
    throw err;
  }
};
