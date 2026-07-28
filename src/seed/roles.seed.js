import {sequelize} from '../config/database.js';
import Role from '../models/roles.model.js';
import {ROLES} from '../config/permissions.js';

const DEFAULT_ROLES = [
  {
    name: ROLES.SUPER_ADMIN,
    description: 'Platform super administrator',
  },
  {
    name: ROLES.ADMIN,
    description: 'Company administrator',
  },
  {
    name: ROLES.MANAGER,
    description: 'Company manager',
  },
  {
    name: ROLES.EMPLOYEE,
    description: 'Company employee',
  },
];

const addSuperAdminEnumValue = async () => {
  try {
    await sequelize.query(
      `ALTER TYPE "enum_roles_name" ADD VALUE IF NOT EXISTS 'superAdmin';`
    );
  } catch (error) {
    // Fresh database: enum is created by sync with all values already included.
    if (!error.message?.includes('does not exist')) {
      throw error;
    }
  }
};

export const seedRoles = async () => {
  await addSuperAdminEnumValue();

  for (const role of DEFAULT_ROLES) {
    await Role.findOrCreate({
      where: {name: role.name},
      defaults: role,
    });
  }

  console.log('✔ Default roles seeded successfully');
};
