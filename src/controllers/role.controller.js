import {createRoleService} from '../service/role.service.js';

export const createRoleController = async (req, res) => {
  try {
    const role = await createRoleService (req.body);
    res
      .status (201)
      .json ({message: 'Role created successfully', message: role});
  } catch (error) {
    res.status (error.statusCode || 500).json ({message: error.message});
  }
};
