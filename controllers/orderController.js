// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const Customer = require("../models/Customer");
// const { sendOrderEmail } = require("../utils/email");

const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const { sendOrderEmail } = require("../utils/email");
const { authenticate } = require("../middlewares/authMiddleware");

const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const customerId = req.user.id; // Customer chỉ được tạo order cho chính mình

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ error: "Insufficient stock" });

    const total = product.price * quantity;
    const order = await Order.create({ quantity, total, ProductId: productId, CustomerId: customerId });

    await product.update({ stock: product.stock - quantity });

    sendOrderEmail(req.user.email, product.name, quantity, total);

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả order (admin) hoặc order của chính mình (customer)
const getOrders = async (req, res) => {
  let orders;
  if (req.user.role === "admin") {
    orders = await Order.findAll({ include: [Product, Customer] });
  } else {
    orders = await Order.findAll({
      where: { CustomerId: req.user.id },
      include: [Product, Customer],
    });
  }
  res.json(orders);
};

// Lấy chi tiết 1 order
const getOrder = async (req, res) => {
  const order = await Order.findByPk(req.params.id, { include: [Product, Customer] });

  if (!order) return res.status(404).json({ error: "Order not found" });

  // Customer chỉ xem được order của chính mình
  if (req.user.role !== "admin" && order.CustomerId !== req.user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.json(order);
};

module.exports = { createOrder, getOrders, getOrder };

