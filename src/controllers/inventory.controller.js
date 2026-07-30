import {
  getAllInventoryService,
  updateInventoryService,
  adjustStockService,
} from "../service/inventory.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAllInventoryController = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, low_stock } = req.query;

    const result = await getAllInventoryService(
      page,
      limit,
      null,
      req.companyId,
      search,
      low_stock === "true",
    );

    res
      .status(200)
      .json(ApiResponse(200, "Inventory fetched successfully", result));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getInventoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await getAllInventoryService(
      null,
      null,
      id,
      req.companyId,
    );

    res
      .status(200)
      .json(ApiResponse(200, "Inventory fetched successfully", inventory));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const updateInventoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await updateInventoryService(
      id,
      req.body,
      req.companyId,
    );

    res
      .status(200)
      .json(ApiResponse(200, "Inventory updated successfully", inventory));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const adjustStockController = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await adjustStockService(
      id,
      req.body.adjustment,
      req.companyId,
    );

    res
      .status(200)
      .json(ApiResponse(200, "Stock adjusted successfully", inventory));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};
