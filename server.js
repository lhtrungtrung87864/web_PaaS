require("./utils/backup");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

// Routes

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const customerRoutes = require("./routes/customer");
const orderRoutes = require("./routes/order");
const dashboardRoutes = require("./routes/dashboard");
const fileRoutes = require("./routes/file");
const dbRoutes = require("./routes/db");
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
app.use("/api/db", dbRoutes);

sequelize.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
  );
});
