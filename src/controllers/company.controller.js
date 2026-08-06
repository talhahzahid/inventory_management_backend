import fs from "fs";
import {
  createCompanyService,
  getCompanyService,
  updateCompanyService,
  deactivateCompanyService,
} from "../service/company.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createCompanyController = async (req, res) => {
  console.log("BODY:", req.body);
console.log("FILE:", req.file);
console.log("HEADERS:", req.headers["content-type"]);
  console.log(req.body);
  const file = req.file?.path;
  try {
    const company = await createCompanyService(req.body, file);
    res
      .status(201)
      .json(ApiResponse(201, "Company created successfully", company));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  } finally {
    if (file) {
      fs.unlink(file, (err) => {
        if (err) console.error("Failed to delete local file:", err.message);
      });
    }
  }
};

export const getCompanyController = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, search, status } = req.query;
    const result = await getCompanyService(
      page,
      limit,
      id,
      search,
      status,
      req.user?.role,
      req.user?.company_id,
    );
    res
      .status(200)
      .json(ApiResponse(200, "Companies fetched successfully", result));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const updateCompanyController = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await updateCompanyService(
      id,
      req.body,
      req.user.role,
      req.user.company_id,
    );

    res
      .status(200)
      .json(ApiResponse(200, "Company updated successfully", company));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const deactivateCompanyController = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await deactivateCompanyService(
      id,
      req.user.role,
      req.user.company_id,
    );

    res
      .status(200)
      .json(ApiResponse(200, "Company deactivated successfully", company));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};
