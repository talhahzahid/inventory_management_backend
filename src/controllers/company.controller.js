import {
  createCompanyService,
  getCompanyService,
} from "../service/company.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createCompanyController = async (req, res) => {
  try {
    const company = await createCompanyService(req.body);
    res
      .status(201)
      .json(ApiResponse(201, "Company created successfully", company));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getCompanyController = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, search, status } = req.query;
    const result = await getCompanyService(page, limit, id, search, status);
    res
      .status(200)
      .json(ApiResponse(200, "Companies fetched successfully", result));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};
