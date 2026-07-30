import {
  createSupplierService,
  getAllSupplierService,
  updateSupplierService,
  deactivateSupplierService,
} from "../service/supplier.service.js";
import { ROLES } from "../config/permissions.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createSupplierController = async (req, res) => {
  try {
    const response = await createSupplierService(req.companyId, req.body);

    return res
      .status(201)
      .json(ApiResponse(201, "Supplier created successfully", response));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getAllSupplierController = async (req, res) => {
  const { page, limit, search, status } = req.query;
  const { id } = req.params;

  try {
    const resolvedStatus =
      req.user.role === ROLES.EMPLOYEE ? status || "active" : status;

    const response = await getAllSupplierService(
      page,
      limit,
      id,
      req.companyId,
      search,
      resolvedStatus,
    );

    res
      .status(200)
      .json(ApiResponse(200, "Supplier fetched successfully", response));
  } catch (error) {
    res
      .status(error.statusCode || 400)
      .json(ApiResponse(error.statusCode || 400, error.message, null));
  }
};

export const updateSupplierController = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await updateSupplierService(id, req.body, req.companyId);

    res
      .status(200)
      .json(ApiResponse(200, "Supplier updated successfully", supplier));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const deactivateSupplierController = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await deactivateSupplierService(id, req.companyId);

    res
      .status(200)
      .json(ApiResponse(200, "Supplier deactivated successfully", supplier));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};
