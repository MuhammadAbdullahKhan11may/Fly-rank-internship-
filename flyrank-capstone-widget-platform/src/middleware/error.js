function notFound(req, res) {
  res.status(404).json({ error: "Route not found" });
}
function errorHandler(err, req, res, next) {
  console.error(err);
  if (err && err.type === "entity.too.large") {
    return res.status(413).json({ error: "Payload too large" });
  }
  res.status(500).json({ error: "Internal server error" });
}
module.exports = { notFound, errorHandler };
