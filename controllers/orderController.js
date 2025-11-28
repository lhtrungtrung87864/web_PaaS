const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const { sendOrderEmail } = require("../utils/email");

// Tạo order
const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const customerId = req.user.id;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ error: "Insufficient stock" });

    const total = product.price * quantity;
    const order = await Order.create({ quantity, total, ProductId: productId, CustomerId: customerId });

    await product.update({ stock: product.stock - quantity });

    // sendOrderEmail(req.user.email, product.name, quantity, total);

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả order
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
  if (req.user.role !== "admin" && order.CustomerId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });

  res.json(order);
};

// Update order (chỉ admin hoặc customer chỉnh chính order của mình)
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: Product });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (req.user.role !== "admin" && order.CustomerId !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    const { quantity } = req.body;
    const product = order.Product;

    if (quantity && quantity > product.stock + order.quantity)
      return res.status(400).json({ error: "Insufficient stock" });

    // Cập nhật stock
    if (quantity) {
      await product.update({ stock: product.stock + order.quantity - quantity });
      order.quantity = quantity;
      order.total = quantity * product.price;
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete order (chỉ admin hoặc customer xóa chính order của mình)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: Product });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (req.user.role !== "admin" && order.CustomerId !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    // Hoàn trả stock về product
    const product = order.Product;
    await product.update({ stock: product.stock + order.quantity });

    await order.destroy();
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createOrder, getOrders, getOrder, updateOrder, deleteOrder };
