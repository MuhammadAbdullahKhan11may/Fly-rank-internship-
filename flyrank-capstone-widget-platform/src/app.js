require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const widgetRoutes = require("./routes/widgets");
const publicRoutes = require("./routes/public");
const dashboardRoutes = require("./routes/dashboard");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();
app.disable("x-powered-by");

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "16kb" }));

app.get("/health", (req, res) => res.json({ ok: true }));
app.use(express.static(path.join(__dirname, "..", "public"), {
  setHeaders(res, filePath) {
    if (filePath.endsWith("widget.v1.js")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  }
}));
app.use("/api/auth", authRoutes);
app.use("/api/widgets", widgetRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
