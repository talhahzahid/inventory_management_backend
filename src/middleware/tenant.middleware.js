import { ROLES } from "../config/permissions.js";

export const tenantScope = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role === ROLES.SUPER_ADMIN) {
    req.companyId = req.query.company_id ? Number(req.query.company_id) : null;
  } else {
    req.companyId = req.user.company_id;
  }

  next();
};
