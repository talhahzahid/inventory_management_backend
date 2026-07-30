import { getDashboardSummaryService } from "../service/dashboard.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDashboardSummaryController = async (req, res) => {
  try {
    const summary = await getDashboardSummaryService(req.companyId);

    res
      .status(200)
      .json(ApiResponse(200, "Dashboard summary fetched successfully", summary));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(ApiResponse(error.statusCode || 500, error.message, null));
  }
};
