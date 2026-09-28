const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const c = require("../controllers/dashboardController");
router.get("/submissions", requireAuth, c.submissions);
router.get("/stats", requireAuth, c.stats);
module.exports = router;
