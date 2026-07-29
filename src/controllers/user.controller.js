import {
  createUserService,
  getAllUsersService,
} from "../service/user.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createUserController = async (req, res) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json(ApiResponse(201, "User created successfully", user));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, search, status } = req.query;
    const { company_id } = req.user;
    console.log(company_id, "company_id");
    const result = await getAllUsersService(page, limit, id);

    res
      .status(200)
      .json(ApiResponse(200, "Users fetched successfully", result));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getUsersByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getAllUsersService(null, null, id);

    res.status(200).json(ApiResponse(200, "User fetched successfully", result));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};
