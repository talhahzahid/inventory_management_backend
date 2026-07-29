import {
  createSupplierService,
  getAllSupplierService,
} from "../service/supplier.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createSupplierController = async (req, res) => {
  const { company_id } = req.user;

  try {
    const response = await createSupplierService(company_id, req.body);

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
  const { company_id } = req.user;
  const { page, limit, search, status } = req.query;
  const { id } = req.params;
  try {
    const response = await getAllSupplierService(
      page,
      limit,
      id,
      company_id,
      search,
      status,
    );
    res
      .status(200)
      .json(ApiResponse(200, "Supplier fetch successfully", response));
  } catch (error) {
    res
      .status(error.statusCode || 400)
      .json(ApiResponse(error.statusCode, error.message, null));
  }
};
