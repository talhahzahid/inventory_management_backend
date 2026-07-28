import Category from '../models/categories.model.js';
import Company from '../models/company.model.js';

const assertOwnership = (record, companyId) => {
  if (companyId && record.company_id !== companyId) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    throw error;
  }
};

export const createCategoryService = async data => {
  try {
    const company = await Company.findByPk(data.company_id);

    if (!company) {
      const error = new Error('Company not found');
      error.statusCode = 404;
      throw error;
    }

    const existingCategory = await Category.findOne({
      where: {
        company_id: data.company_id,
        name: data.name,
      },
    });

    if (existingCategory) {
      const error = new Error('Category with this name already exists');
      error.statusCode = 409;
      throw error;
    }

    const category = await Category.create({
      company_id: data.company_id,
      name: data.name,
      description: data.description,
      status: data.status || 'active',
    });

    return category;
  } catch (error) {
    if (error.statusCode) throw error;
    const err = new Error(error.message || 'Failed to create category');
    err.statusCode = 500;
    throw err;
  }
};

export const getAllCategoriesService = async (
  page,
  limit,
  id = null,
  companyId = null,
  status = null
) => {
  try {
    if (id) {
      const category = await Category.findByPk(id, {
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });

      if (!category) {
        const err = new Error('Category not found');
        err.statusCode = 404;
        throw err;
      }

      assertOwnership(category, companyId);

      return category;
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(limit) || 10);
    const offset = (pageNumber - 1) * pageSize;

    const where = {};
    if (companyId) {
      where.company_id = companyId;
    }
    if (status) {
      where.status = status;
    }

    const {count, rows} = await Category.findAndCountAll({
      where,
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'email'],
        },
      ],
      limit: pageSize,
      offset,
      order: [['id', 'ASC']],
    });

    return {
      total: count,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(count / pageSize),
      data: rows,
    };
  } catch (error) {
    const err = new Error(error.message || 'Failed to fetch categories');
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

export const updateCategoryService = async (id, data, companyId = null) => {
  try {
    const category = await Category.findByPk(id);

    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    assertOwnership(category, companyId);

    const name = data.name || category.name;

    if (data.name) {
      const existingCategory = await Category.findOne({
        where: {
          company_id: category.company_id,
          name,
        },
      });

      if (existingCategory && existingCategory.id !== category.id) {
        const error = new Error('Category with this name already exists');
        error.statusCode = 409;
        throw error;
      }
    }

    await category.update({
      name: data.name ?? category.name,
      description: data.description ?? category.description,
      status: data.status ?? category.status,
    });

    return category;
  } catch (error) {
    if (error.statusCode) throw error;
    const err = new Error(error.message || 'Failed to update category');
    err.statusCode = 500;
    throw err;
  }
};

export const deactivateCategoryService = async (id, companyId = null) => {
  try {
    const category = await Category.findByPk(id);

    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    assertOwnership(category, companyId);

    if (category.status === 'inactive') {
      const error = new Error('Category is already inactive');
      error.statusCode = 409;
      throw error;
    }

    await category.update({status: 'inactive'});

    return category;
  } catch (error) {
    if (error.statusCode) throw error;
    const err = new Error(error.message || 'Failed to deactivate category');
    err.statusCode = 500;
    throw err;
  }
};
