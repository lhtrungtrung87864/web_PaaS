// const express = require("express");
// const { getStats } = require("../controllers/dashboardController");
// const auth = require("../middlewares/authMiddleware");
// const router = express.Router();

// router.get("/", auth, getStats);

// module.exports = router;


const express = require("express");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");
const { getStats } = require("../controllers/dashboardController");

const router = express.Router();

// Chỉ admin mới được xem thống kê
router.get("/", authenticate, authorizeAdmin, getStats);

module.exports = router;
