import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import Supplier from "../models/suppliers.model.js";

const assertOwnership = (record, companyId) => {
  if (companyId && record.company_id !== companyId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
};

export const createSupplierService = async (company_id, data) => {
  const t = await sequelize.transaction();

  try {
    const existingSupplier = await Supplier.findOne({
      where: {
        email: data.email,
        company_id,
      },
      transaction: t,
    });

    if (existingSupplier) {
      const error = new Error(
        "Email already exists for another supplier in this company",
      );
      error.statusCode = 409;
      throw error;
    }

    const supplier = await Supplier.create(
      {
        ...data,
        company_id,
      },
      {
        transaction: t,
      },
    );

    await t.commit();

    return supplier;
  } catch (error) {
    await t.rollback();

    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to create supplier");
    err.statusCode = 500;
    throw err;
  }
};

export const getAllSupplierService = async (
  page,
  limit,
  id = null,
  company_id,
  search = null,
  status,
) => {
  try {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const offset = (pageNumber - 1) * pageSize;

    let where = {};
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

    if (id) {
      const supplier = await Supplier.findOne({
        where: { ...where, id },
      });

      if (!supplier) {
        const error = new Error("Supplier not found");
        error.statusCode = 404;
        throw error;
      }

      assertOwnership(supplier, company_id);

      return supplier;
    }

    const { count, rows } = await Supplier.findAndCountAll({
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
    const err = new Error(error.message || "Failed to fetch suppliers");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

export const updateSupplierService = async (id, data, companyId = null) => {
  try {
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      const error = new Error("Supplier not found");
      error.statusCode = 404;
      throw error;
    }

    assertOwnership(supplier, companyId);

    const name = data.name ?? supplier.name;

    if (data.name) {
      const existingByName = await Supplier.findOne({
        where: {
          company_id: supplier.company_id,
          name,
        },
      });

      if (existingByName && existingByName.id !== supplier.id) {
        const error = new Error(
          "Supplier with this name already exists in this company",
        );
        error.statusCode = 409;
        throw error;
      }
    }

    if (data.email && data.email !== supplier.email) {
      const existingByEmail = await Supplier.findOne({
        where: {
          company_id: supplier.company_id,
          email: data.email,
        },
      });

      if (existingByEmail && existingByEmail.id !== supplier.id) {
        const error = new Error(
          "Email already exists for another supplier in this company",
        );
        error.statusCode = 409;
        throw error;
      }
    }

    await supplier.update({
      name: data.name ?? supplier.name,
      phone: data.phone ?? supplier.phone,
      email: data.email ?? supplier.email,
      address: data.address ?? supplier.address,
      status: data.status ?? supplier.status,
    });

    return supplier;
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to update supplier");
    err.statusCode = 500;
    throw err;
  }
};

export const deactivateSupplierService = async (id, companyId = null) => {
  try {
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      const error = new Error("Supplier not found");
      error.statusCode = 404;
      throw error;
    }

    assertOwnership(supplier, companyId);

    if (supplier.status === "inactive") {
      const error = new Error("Supplier is already inactive");
      error.statusCode = 409;
      throw error;
    }

    await supplier.update({ status: "inactive" });

    return supplier;
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error(error.message || "Failed to deactivate supplier");
    err.statusCode = 500;
    throw err;
  }
};
