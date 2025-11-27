const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");
const Product = require("./Product");

const Order = sequelize.define("Order", {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.FLOAT, allowNull: false }
});

Order.belongsTo(Customer);
Customer.hasMany(Order);

Order.belongsTo(Product);
Product.hasMany(Order);

module.exports = Order;
