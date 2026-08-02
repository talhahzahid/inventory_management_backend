import {
  changePasswordService,
  loginService,
} from "../service/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json(ApiResponse(200, "Login successful", result));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const result = await changePasswordService(req.user.id, req.body);
    res
      .status(200)
      .json(ApiResponse(200, "Password changed successfully", result));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};
