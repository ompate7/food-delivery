export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || "Internal server error" });
};

export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};
