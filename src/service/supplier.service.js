import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import Supplier from "../models/suppliers.model.js";

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
    if(status){
      where.status = status
    }
    if (search) {
      where[Op.or] = [
        {
          name: { [Op.iLike]: `%${search}%` },
          email: { [Op.iLike]: `%${search}%` },
        },
      ];
    }

    if (id) {
      const supplier = await Supplier.findByPk(id, {
        where,
      });

      if (!supplier) {
        const error = new Error("Supplier not found");
        error.statusCode = 404;
        throw error;
      }

      return supplier;
    }

    const { counts, rows } = await Supplier.findAndCountAll({
      where,
      limit: pageSize,
      offset,
    });

    return {
      total: counts,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(counts / pageSize),
      data: rows,
    };
  } catch (error) {
    const err = new Error(error.message || "Failed to fetch suppliers");
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};
