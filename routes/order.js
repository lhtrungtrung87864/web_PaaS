// const { authenticate, authorizeAdmin } = require("../middlewares/auth");
// const express = require("express");
// const {
//   createOrder,
//   getOrders,
//   getOrder,
// } = require("../controllers/orderController");
// const auth = require("../middlewares/authMiddleware");
// const router = express.Router();

// router.post("/", auth, createOrder);
// router.get("/", auth, getOrders);
// router.get("/:id", auth, getOrder);

// module.exports = router;


const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const { createOrder, getOrders, getOrder } = require("../controllers/orderController");

const router = express.Router();

// Customer tạo order cho chính mình
router.post("/", authenticate, createOrder);

// Xem danh sách order
router.get("/", authenticate, getOrders);

// Xem chi tiết 1 order
router.get("/:id", authenticate, getOrder);

module.exports = router;
