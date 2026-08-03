import { Op } from "sequelize";
import Company from "../models/company.model.js";
import Role from "../models/roles.model.js";
import User from "../models/users.model.js";
import { hashPassword } from "../utils/hashPassword.js";
import { sendEmail } from "./email.service.js";

const userAttribute = {
  exclude: ["password"],
};

const assertOwnership = (record, companyId) => {
  if (companyId && record.company_id !== companyId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
};

export const createUserService = async (data, company_id) => {
  try {
    const existingUser = await User.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      const error = new Error("User with this email is already exits");
      error.statusCode = 409;
      throw error;
    }

    const company = await Company.findByPk(company_id);

    if (!company) {
      const error = new Error("Company not found");
      error.statusCode = 404;
      throw error;
    }

    const role = await Role.findByPk(data.role_id);
    if (!role) {
      const error = new Error("Role not found");
      error.statusCode = 404;
      throw error;
    }

    const password = data.password;
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      company_id: company_id,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role_id: data.role_id,
      status: data.status || "active",
    });

    sendEmail(
      data.email,
      "Welcome",
      `Your Account has been created. Your password is: ${password}`,
    ).catch((emailError) => {
      console.log("Failed to send welcome email", emailError);
    });

    return user.get({ plain: true, attributes: { exclude: ["password"] } });
  } catch (error) {
    if (error.statusCode) throw error;
    const err = new Error(error.message || "Failed to create user");
    err.statusCode = 500;
    throw err;
  }
};

export const getAllUsersService = async (
  page,
  limit,
  id = null,
  company_id = null,
  search = null,
  status = null,
) => {
  try {
    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(limit) || 10);
    const offset = (pageNumber - 1) * pageSize;

    const where = {};

    if (company_id) {
      where.company_id = company_id;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const include = [
      {
        model: Company,
        as: "company",
        attributes: ["id", "name", "email"],
      },
      {
        model: Role,
        as: "role",
        attributes: ["id", "name"],
      },
    ];

    // Get single user by ID
    if (id) {
      const user = await User.findOne({
        where: { ...where, id },
        attributes: userAttribute,
        include,
      });

      if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }

      assertOwnership(user, company_id);

      return user;
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: userAttribute,
      include,
      limit: pageSize,
      offset,
      order: [["id", "DESC"]],
    });

    return {
      total: count,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(count / pageSize),
      data: rows,
    };
  } catch (error) {
    const err = new Error(error.message || "Failed to fetch users");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

export const updateUserService = async (id, data, companyId = null) => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    assertOwnership(user, companyId);

    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== user.id) {
        const error = new Error("User with this email already exists");
        error.statusCode = 409;
        throw error;
      }
    }

    if (data.role_id) {
      const role = await Role.findByPk(data.role_id);

      if (!role) {
        const error = new Error("Role not found");
        error.statusCode = 404;
        throw error;
      }
    }

    const updateData = {
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      role_id: data.role_id ?? user.role_id,
      status: data.status ?? user.status,
    };

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    await user.update(updateData);

    return User.findByPk(user.id, {
      attributes: userAttribute,
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["id", "name", "email"],
        },
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"],
        },
      ],
    });
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to update user");
    err.statusCode = 500;
    throw err;
  }
};

export const deactivateUserService = async (id, companyId = null) => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    assertOwnership(user, companyId);

    if (user.status === "inactive") {
      const error = new Error("User is already inactive");
      error.statusCode = 409;
      throw error;
    }

    await user.update({ status: "inactive" });

    return user.get({ plain: true, attributes: { exclude: ["password"] } });
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to deactivate user");
    err.statusCode = 500;
    throw err;
  }
};
