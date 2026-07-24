import {sequelize} from '../config/database.js';
import Company from '../models/company.model.js';
import User from '../models/users.model.js';
import randomPasswordGenerate from '../utils/password.js';
import {sendEmail} from './email.service.js';

export const createCompanyService = async data => {
  const t = await sequelize.transaction ();

  try {
    const existingCompany = await Company.findOne ({
      where: {email: data.email},
      transaction: t,
    });

    if (existingCompany) {
      const error = new Error ('Company with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    const response = await Company.create (data, {transaction: t});

    // generate password
    const password = randomPasswordGenerate ();

    const user = {
      company_id: response.id,
      name: data.name,
      email: data.email,
      password: password,
      role_id: 1,
      status: 'active',
    };

    await User.create (user, {transaction: t});

    await t.commit ();

    try {
      await sendEmail (data.email, 'Welcome', `Your password is: ${password}`);
    } catch (emailError) {
      console.error ('Failed to send welcome email:', emailError);
    }

    return response;
  } catch (error) {
    await t.rollback ();

    if (error.statusCode) throw error;
    const err = new Error (error.message || 'Failed to create company');
    err.statusCode = 500;
    throw err;
  }
};

export const getCompanyService = async (page, limit) => {
  try {
    const pageNumber = Number (page) || 1;
    const pageSize = Number (limit) || 10;
    const offset = (pageNumber - 1) * pageSize;

    const {count, rows} = await Company.findAndCountAll ({
      limit: pageSize,
      offset,
    });

    return {
      total: count,
      page: pageNumber,
      totalPages: Math.ceil (count / pageSize),
      data: rows,
    };
  } catch (error) {
    const err = new Error (error.message || 'Failed to fetch companies');
    err.statusCode = 500;
    throw err;
  }
};
