const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { config } = require("../controllers/widgetController");
const { submit } = require("../controllers/submissionController");

const submissionLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => `${req.params.widgetId}:${req.ip}`,
  handler: (req, res) => res.status(429).json({ error: "Too many submissions. Try again shortly." })
});

router.get("/widgets/:id/config", config);
router.post("/widgets/:widgetId/submissions", submissionLimiter, submit);
module.exports = router;
