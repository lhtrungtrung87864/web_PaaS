const Product = require("../models/Product");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");

// CREATE product (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;
    const image = req.file ? req.file.path : null;
    const product = await Product.create({ name, price, stock, description, image });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all products (all users)
const getProducts = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

// GET single product (all users)
const getProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
};

// UPDATE product (admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const { name, price, stock, description } = req.body;
    const image = req.file ? req.file.path : product.image;
    await product.update({ name, price, stock, description, image });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE product (admin only)
const deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  await product.destroy();
  res.json({ message: "Product deleted successfully" });
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };
