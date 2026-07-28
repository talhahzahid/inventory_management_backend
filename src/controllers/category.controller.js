import {
  createCategoryService,
  getAllCategoriesService,
  updateCategoryService,
  deactivateCategoryService,
} from '../service/category.service.js';
import {ROLES} from '../config/permissions.js';
import ApiResponse from '../utils/ApiResponse.js';

export const createCategoryController = async (req, res) => {
  try {
    const category = await createCategoryService({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      company_id: req.companyId,
    });
    res
      .status(201)
      .json(ApiResponse(201, 'Category created successfully', category));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getAllCategoriesController = async (req, res) => {
  try {
    const {page = 1, limit = 10, status} = req.query;

    const resolvedStatus =
      req.user.role === ROLES.EMPLOYEE ? status || 'active' : status;

    const result = await getAllCategoriesService(
      page,
      limit,
      null,
      req.companyId,
      resolvedStatus
    );

    res
      .status(200)
      .json(ApiResponse(200, 'Categories fetched successfully', result));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getCategoryByIdController = async (req, res) => {
  try {
    const {id} = req.params;
    const category = await getAllCategoriesService(
      null,
      null,
      id,
      req.companyId
    );

    res
      .status(200)
      .json(ApiResponse(200, 'Category fetched successfully', category));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const {id} = req.params;
    const category = await updateCategoryService(id, req.body, req.companyId);

    res
      .status(200)
      .json(ApiResponse(200, 'Category updated successfully', category));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const deactivateCategoryController = async (req, res) => {
  try {
    const {id} = req.params;
    const category = await deactivateCategoryService(id, req.companyId);

    res
      .status(200)
      .json(ApiResponse(200, 'Category deactivated successfully', category));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};
