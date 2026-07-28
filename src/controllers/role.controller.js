import {
  createRoleService,
  getAllRoleService,
} from '../service/role.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const createRoleController = async (req, res) => {
  try {
    const role = await createRoleService(req.body);
    res
      .status(201)
      .json(ApiResponse(201, 'Role created successfully', role));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getAllRolesController = async (req, res) => {
  try {
    const {page = 1, limit = 10} = req.query;
    const result = await getAllRoleService(page, limit);

    res
      .status(200)
      .json(ApiResponse(200, 'Roles fetched successfully', result));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getRoleByIdController = async (req, res) => {
  try {
    const {id} = req.params;
    const role = await getAllRoleService(null, null, id);

    res.status(200).json(ApiResponse(200, 'Role fetched successfully', role));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};
