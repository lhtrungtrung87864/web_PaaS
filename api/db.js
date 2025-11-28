const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise"); // nếu dùng MySQL, Postgres thay đổi driver

/**
 * POST /api/db/connect
 * Body: { host, port, user, password, dbName }
 * Backend sẽ thử kết nối tới Aiven database với thông tin gửi lên
 */
router.post("/connect", async (req, res) => {
  const { host, port, user, password, dbName } = req.body;

  if (!host || !port || !user || !dbName) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
  }

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database: dbName,
    });

    await connection.connect(); // kiểm tra kết nối
    await connection.end();

    res.json({ message: "Kết nối tới Aiven thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kết nối thất bại: " + err.message });
  }
});

module.exports = router;
