const User = require("../models/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendNewUserEmail } = require("../utils/email");

// Đăng ký
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kiểm tra đã có admin chưa
    const adminExists = await User.findOne({ where: { role: "admin" } });

    // Nếu chưa có admin, tài khoản đầu tiên là admin, còn lại customer
    const role = adminExists ? "customer" : "admin";

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    if (process.env.ADMIN_EMAIL) {
      sendNewUserEmail(process.env.ADMIN_EMAIL, username, email);
    }

    res.status(201).json({ message: "User created", userId: user.id, role: user.role });
  } catch (err) {
    // Nếu lỗi validation của Sequelize
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
      const errors = err.errors.map((e) => e.message);
      return res.status(400).json({ error: errors });
    }

    res.status(500).json({ error: err.message });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Không cho admin xóa chính mình
    if (user.role === "admin") {
      return res.status(403).json({ error: "Cannot delete admin account" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, deleteUser };
