import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import Company from "../models/company.model.js";
import User from "../models/users.model.js";
import { hashPassword } from "../utils/hashPassword.js";
import randomPasswordGenerate from "../utils/password.js";
import { sendEmail } from "./email.service.js";
import { ROLES } from "../config/permissions.js";

const assertCompanyAccess = (company, requesterRole, requesterCompanyId) => {
  if (requesterRole === ROLES.SUPER_ADMIN) return;

  if (!requesterCompanyId || company.id !== requesterCompanyId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
};

export const createCompanyService = async (data) => {
  const t = await sequelize.transaction();

  try {
    const existingCompany = await Company.findOne({
      where: { email: data.email },
      transaction: t,
    });

    if (existingCompany) {
      const error = new Error("Company with this email already exists");
      error.statusCode = 409;
      throw error;
    }

    const response = await Company.create(data, { transaction: t });

    // generate password
    const password = randomPasswordGenerate();

    const hashedPassword = await hashPassword(password);

    const user = {
      company_id: response.id,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role_id: 1,
      status: "active",
    };

    await User.create(user, { transaction: t });

    await t.commit();

    try {
      await sendEmail(data.email, "Welcome", `Your password is: ${password}`);
    } catch (emailError) {
      console.error(
        "Failed to send welcome email:",
        emailError.message || emailError,
      );
    }

    return response;
  } catch (error) {
    await t.rollback();

    if (error.statusCode) throw error;
    const err = new Error(error.message || "Failed to create company");
    err.statusCode = 500;
    throw err;
  }
};

// export const createCompanyService = async (data) => {
//   const t = await sequelize.transaction();

//   try {
//     const existingCompany = await Company.findOne({
//       where: { email: data.email },
//       transaction: t,
//     });

//     if (existingCompany) {
//       const error = new Error("Company with this email already exists");
//       error.statusCode = 409;
//       throw error;
//     }

//     const response = await Company.create(data, { transaction: t });

//     // generate password
//     const password = randomPasswordGenerate();

//     const hashedPassword = await hashPassword(password);

//     const user = {
//       company_id: response.id,
//       name: data.name,
//       email: data.email,
//       password: hashedPassword,
//       role_id: 1,
//       status: "active",
//     };

//     await User.create(user, { transaction: t });

//     await t.commit();

//     sendEmail(data.email, "Welcome", `Your password is: ${password}`).catch(
//       (emailError) => {
//         console.error("Failed to send welcome email:", emailError);
//       },
//     );

//     return response;
//   } catch (error) {
//     await t.rollback();

//     if (error.statusCode) throw error;
//     const err = new Error(error.message || "Failed to create company");
//     err.statusCode = 500;
//     throw err;
//   }
// };

export const getCompanyService = async (
  page,
  limit,
  id = null,
  search = null,
  status = null,
  requesterRole = null,
  requesterCompanyId = null,
) => {
  try {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const offset = (pageNumber - 1) * pageSize;

    if (id) {
      const response = await Company.findByPk(id);

      if (!response) {
        const error = new Error("Company not found");
        error.statusCode = 404;
        throw error;
      }

      assertCompanyAccess(response, requesterRole, requesterCompanyId);

      return response;
    }

    let where = {};

    if (requesterRole !== ROLES.SUPER_ADMIN && requesterCompanyId) {
      where.id = requesterCompanyId;
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

    const { count, rows } = await Company.findAndCountAll({
      where,
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
    const err = new Error(error.message || "Failed to fetch companies");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

export const updateCompanyService = async (
  id,
  data,
  requesterRole,
  requesterCompanyId,
) => {
  try {
    const company = await Company.findByPk(id);

    if (!company) {
      const error = new Error("Company not found");
      error.statusCode = 404;
      throw error;
    }

    assertCompanyAccess(company, requesterRole, requesterCompanyId);

    if (data.email && data.email !== company.email) {
      const existingCompany = await Company.findOne({
        where: { email: data.email },
      });

      if (existingCompany && existingCompany.id !== company.id) {
        const error = new Error("Company with this email already exists");
        error.statusCode = 409;
        throw error;
      }
    }

    if (data.slug && data.slug !== company.slug) {
      const existingSlug = await Company.findOne({
        where: { slug: data.slug },
      });

      if (existingSlug && existingSlug.id !== company.id) {
        const error = new Error("Company with this slug already exists");
        error.statusCode = 409;
        throw error;
      }
    }

    await company.update({
      name: data.name ?? company.name,
      slug: data.slug ?? company.slug,
      email: data.email ?? company.email,
      phone: data.phone ?? company.phone,
      address: data.address ?? company.address,
      logo: data.logo ?? company.logo,
      status: data.status ?? company.status,
    });

    return company;
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to update company");
    err.statusCode = 500;
    throw err;
  }
};

export const deactivateCompanyService = async (
  id,
  requesterRole,
  requesterCompanyId,
) => {
  try {
    const company = await Company.findByPk(id);

    if (!company) {
      const error = new Error("Company not found");
      error.statusCode = 404;
      throw error;
    }

    assertCompanyAccess(company, requesterRole, requesterCompanyId);

    if (company.status === "inactive") {
      const error = new Error("Company is already inactive");
      error.statusCode = 409;
      throw error;
    }

    await company.update({ status: "inactive" });

    return company;
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to deactivate company");
    err.statusCode = 500;
    throw err;
  }
};
