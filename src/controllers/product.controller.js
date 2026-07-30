import {
  createProductService,
  getAllProductsService,
  updateProductService,
  deactivateProductService,
} from "../service/product.service.js";
import { ROLES } from "../config/permissions.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createProductController = async (req, res) => {
  try {
    const product = await createProductService({
      company_id: req.companyId,
      category_id: req.body.category_id,
      supplier_id: req.body.supplier_id,
      sku: req.body.sku,
      name: req.body.name,
      description: req.body.description,
      purchase_price: req.body.purchase_price,
      selling_price: req.body.selling_price,
      status: req.body.status,
      quantity: req.body.quantity,
      minimum_stock: req.body.minimum_stock,
      maximum_stock: req.body.maximum_stock,
      warehouse_location: req.body.warehouse_location,
    });

    res
      .status(201)
      .json(ApiResponse(201, "Product created successfully", product));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      category_id,
      supplier_id,
    } = req.query;

    const resolvedStatus =
      req.user.role === ROLES.EMPLOYEE ? status || "active" : status;

    const result = await getAllProductsService(
      page,
      limit,
      null,
      req.companyId,
      resolvedStatus,
      search,
      category_id,
      supplier_id,
    );

    res
      .status(200)
      .json(ApiResponse(200, "Products fetched successfully", result));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getAllProductsService(
      null,
      null,
      id,
      req.companyId,
    );

    res
      .status(200)
      .json(ApiResponse(200, "Product fetched successfully", product));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await updateProductService(id, req.body, req.companyId);

    res
      .status(200)
      .json(ApiResponse(200, "Product updated successfully", product));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const deactivateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await deactivateProductService(id, req.companyId);

    res
      .status(200)
      .json(ApiResponse(200, "Product deactivated successfully", product));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};
