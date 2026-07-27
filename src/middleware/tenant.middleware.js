export const tenantScope = async (req, res, next) => {
  if (!req.user) {
    return res.status (401).json ({message: 'Unauthorized'});
  }
};
