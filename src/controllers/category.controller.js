import {
  createCategoryService,
  getAllCategoriesService,
  updateCategoryService,
  deactivateCategoryService,
} from '../service/category.service.js';

export const createCategoryController = async (req, res) => {
  console.log (req.body, 'received');
  try {
    const category = await createCategoryService (req.body);
    res
      .status (201)
      .json ({message: 'Category created successfully', data: category});
  } catch (error) {
    res.status (error.statusCode || 500).json ({message: error.message});
  }
};

export const getAllCategoriesController = async (req, res) => {
  console.log (req);
  try {
    const {page = 1, limit = 10, company_id, status} = req.query;
    // console.log (company_id, 'company id');
    console.log (req.user, 'user coming');

    const result = await getAllCategoriesService (
      page,
      limit,
      null,
      req.user.company_id,
      status
    );

    res
      .status (200)
      .json ({message: 'Categories fetched successfully', ...result});
  } catch (error) {
    res.status (error.statusCode || 500).json ({message: error.message});
  }
};

export const getCategoryByIdController = async (req, res) => {
  try {
    const {id} = req.params;
    const category = await getAllCategoriesService (null, null, id);

    res
      .status (200)
      .json ({message: 'Category fetched successfully', data: category});
  } catch (error) {
    res.status (error.statusCode || 500).json ({message: error.message});
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const {id} = req.params;
    const category = await updateCategoryService (id, req.body);

    res
      .status (200)
      .json ({message: 'Category updated successfully', data: category});
  } catch (error) {
    res.status (error.statusCode || 500).json ({message: error.message});
  }
};

export const deactivateCategoryController = async (req, res) => {
  try {
    const {id} = req.params;
    const category = await deactivateCategoryService (id);

    res
      .status (200)
      .json ({message: 'Category deactivated successfully', data: category});
  } catch (error) {
    res.status (error.statusCode || 500).json ({message: error.message});
  }
};
