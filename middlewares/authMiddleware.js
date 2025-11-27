// middlewares/auth.js
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Customer.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user; // lưu user object
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "User not authenticated" });
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  next();
};


const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({ storage });

module.exports = upload;

module.exports = { authenticate, authorizeAdmin };
