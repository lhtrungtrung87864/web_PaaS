const express = require("express");
const multer = require("multer");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware"); // dùng middleware phân quyền
const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

// -------------------- Routes --------------------

// CREATE, UPDATE, DELETE → admin only
router.post("/", authenticate, authorizeAdmin, upload.single("image"), createProduct);
router.put("/:id", authenticate, authorizeAdmin, upload.single("image"), updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

// READ → all authenticated users
router.get("/", authenticate, getProducts);
router.get("/:id", authenticate, getProduct);

module.exports = router;
