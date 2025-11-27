const Product = require("../models/Product");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const File = require("../models/File");


const getStats = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();
    const totalCustomers = await Customer.count();
    const totalFiles = await File.count();

    const orders = await Order.findAll();
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    res.json({
      totalFiles,
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStats };
