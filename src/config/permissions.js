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
    read: [ROLES.SUPER_ADMIN],
    update: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
};
