import Role from '../models/roles.model.js';

export const createRoleService = async data => {
  try {
    // check if role already exists
    const existingRole = await Role.findOne ({
      where: {name: data.name},
    });

    if (existingRole) {
      const error = new Error ('Role with this name already exists');
      error.statusCode = 409;
      throw error;
    }

    const response = await Role.create (data);
    return response;
  } catch (error) {
    if (error.statusCode) throw error;
    const err = new Error (error.message || 'Failed to create role');
    err.statusCode = 500;
    throw err;
  }
};
