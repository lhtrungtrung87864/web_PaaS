// const express = require("express");
// const { register, login } = require("../controllers/authController");
const express = require("express");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");
const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();

// ---------------------- CREATE ----------------------
router.post("/", authenticate, authorizeAdmin, createCustomer); // chỉ admin mới tạo

// ---------------------- READ ------------------------
router.get("/", authenticate, getCustomers);          // tất cả user đều xem được danh sách
router.get("/:id", authenticate, getCustomer);        // tất cả user đều xem chi tiết

// ---------------------- UPDATE ----------------------
router.put("/:id", authenticate, authorizeAdmin, updateCustomer); // chỉ admin sửa

// ---------------------- DELETE ----------------------
router.delete("/:id", authenticate, authorizeAdmin, deleteCustomer); // chỉ admin xóa

module.exports = router;
