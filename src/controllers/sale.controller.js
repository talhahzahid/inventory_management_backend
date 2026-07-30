import {
  createSaleService,
  getAllSalesService,
  getSalesSummaryService,
} from "../service/sale.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createSaleController = async (req, res) => {
  try {
    const sale = await createSaleService({
      company_id: req.companyId,
      sold_by: req.user.id,
      customer_name: req.body.customer_name,
      notes: req.body.notes,
      items: req.body.items,
    });

    res.status(201).json(ApiResponse(201, "Sale created successfully", sale));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getAllSalesController = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, from_date, to_date } = req.query;

    const result = await getAllSalesService(
      page,
      limit,
      null,
      req.companyId,
      search,
      from_date,
      to_date,
    );

    res
      .status(200)
      .json(ApiResponse(200, "Sales fetched successfully", result));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getSaleByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await getAllSalesService(
      null,
      null,
      id,
      req.companyId,
    );

    res.status(200).json(ApiResponse(200, "Sale fetched successfully", sale));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getSalesSummaryController = async (req, res) => {
  try {
    const summary = await getSalesSummaryService(req.companyId);

    res
      .status(200)
      .json(ApiResponse(200, "Sales summary fetched successfully", summary));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};
