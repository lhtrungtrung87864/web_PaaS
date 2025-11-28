require("./utils/backup");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

// Routes

const authRoutes = require("./api/auth");
const productRoutes = require("./api/product");
const customerRoutes = require("./api/customer");
const orderRoutes = require("./api/order");
const dashboardRoutes = require("./api/dashboard");
const fileRoutes = require("./api/file");

// const userRoutes = require("./routes/user");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// app.use("/api/user/delete", userRoutes);

app.use("/uploads", express.static("uploads")); // để tải file được
app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);


sequelize.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
  );
});
