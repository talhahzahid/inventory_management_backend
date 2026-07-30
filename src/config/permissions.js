export const ROLES = {
  SUPER_ADMIN: "superAdmin",
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
};

export const PERMISSIONS = {
  roles: {
    create: [ROLES.SUPER_ADMIN],
    read: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  },
  categories: {
    create: [ROLES.ADMIN, ROLES.MANAGER],
    read: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
    update: [ROLES.ADMIN, ROLES.MANAGER],
    delete: [ROLES.ADMIN, ROLES.MANAGER],
  },
  users: {
    create: [ROLES.ADMIN],
    read: [ROLES.ADMIN, ROLES.MANAGER],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  companies: {
    create: [ROLES.SUPER_ADMIN],
    read: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    update: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN],
  },
  suppliers: {
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
    read: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
    update: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  },
  products: {
    create: [ROLES.ADMIN, ROLES.MANAGER],
    read: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
    update: [ROLES.ADMIN, ROLES.MANAGER],
    delete: [ROLES.ADMIN, ROLES.MANAGER],
  },
  inventory: {
    read: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
    update: [ROLES.ADMIN, ROLES.MANAGER],
  },
  sales: {
    create: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
    read: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
  purchases: {
    create: [ROLES.ADMIN, ROLES.MANAGER],
    read: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
  dashboard: {
    read: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
};
