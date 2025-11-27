const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const File = sequelize.define("File", {
  filename: DataTypes.STRING,
  originalName: DataTypes.STRING,
  path: DataTypes.STRING,
  size: DataTypes.INTEGER,
  userId: DataTypes.INTEGER,
});

module.exports = File;
