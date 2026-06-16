const notFound = (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  console.error(error);

  if (error?.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(", "),
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({ message: "A record with these details already exists" });
  }

  return res.status(error.status || 500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected server error occurred"
        : error.message || "An unexpected server error occurred",
  });
};

module.exports = { notFound, errorHandler };
