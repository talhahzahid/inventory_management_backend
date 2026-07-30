import {
  createPurchaseService,
  getAllPurchasesService,
} from "../service/purchase.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createPurchaseController = async (req, res) => {
  try {
    const purchase = await createPurchaseService({
      company_id: req.companyId,
      supplier_id: req.body.supplier_id,
      purchased_by: req.user.id,
      notes: req.body.notes,
      items: req.body.items,
    });

    res
      .status(201)
      .json(ApiResponse(201, "Purchase created successfully", purchase));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getAllPurchasesController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      supplier_id,
      from_date,
      to_date,
    } = req.query;

    const result = await getAllPurchasesService(
      page,
      limit,
      null,
      req.companyId,
      search,
      supplier_id,
      from_date,
      to_date,
    );

    res
      .status(200)
      .json(ApiResponse(200, "Purchases fetched successfully", result));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};

export const getPurchaseByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await getAllPurchasesService(
      null,
      null,
      id,
      req.companyId,
    );

    res
      .status(200)
      .json(ApiResponse(200, "Purchase fetched successfully", purchase));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};
