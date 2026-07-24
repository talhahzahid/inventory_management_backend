import {
  createCompanyService,
  getCompanyService,
} from '../service/company.service.js';

export const createCompanyController = async (req, res) => {
  try {
    const company = await createCompanyService (req.body);
    res
      .status (201)
      .json ({message: 'Company created successfully', data: company});
  } catch (error) {
    res.status (error.statusCode || 500).json ({message: error.message});
  }
};

export const getCompanyController = async (req, res) => {
  try {
    const {page = 1, limit = 10} = req.query;

    const result = await getCompanyService (page, limit);

    res
      .status (200)
      .json ({message: 'Companies fetched successfully', ...result});
  } catch (error) {
    res.status (error.statusCode || 500).json ({message: error.message});
  }
};
