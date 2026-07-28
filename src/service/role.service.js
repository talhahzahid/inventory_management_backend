import Role from '../models/roles.model.js';

export const createRoleService = async data => {
  try {
    const existingRole = await Role.findOne({
      where: {name: data.name},
    });

    if (existingRole) {
      const error = new Error('Role with this name already exists');
      error.statusCode = 409;
      throw error;
    }

    const response = await Role.create(data);
    return response;
  } catch (error) {
    if (error.statusCode) throw error;
    const err = new Error(error.message || 'Failed to create role');
    err.statusCode = 500;
    throw err;
  }
};

export const getAllRoleService = async (page, limit, id = null) => {
  try {
    if (id) {
      const role = await Role.findByPk(id);

      if (!role) {
        const err = new Error('Role not found');
        err.statusCode = 404;
        throw err;
      }

      return role;
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(limit) || 10);
    const offset = (pageNumber - 1) * pageSize;

    const {count, rows} = await Role.findAndCountAll({
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
    const err = new Error(error.message || 'Failed to fetch roles');
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};
