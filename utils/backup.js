const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
require("dotenv").config();

const backupDir = path.join(__dirname, "../db_backups");
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

// Cấu hình email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (subject, text) => {
  transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject,
    text,
  }, (err, info) => {
    if (err) console.error("Email error:", err);
    else console.log("Email sent:", info.response);
  });
};

// Xóa file backup quá 7 ngày
const deleteOldBackups = () => {
  const files = fs.readdirSync(backupDir);
  const now = Date.now();
  const days7 = 7 * 24 * 60 * 60 * 1000;

  files.forEach(file => {
    const filePath = path.join(backupDir, file);
    const stats = fs.statSync(filePath);
    if (now - stats.mtimeMs > days7) {
      fs.unlinkSync(filePath);
      console.log("Deleted old backup:", file);
    }
  });
};

// Backup DB bằng Node.js
const backupDatabase = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = path.join(backupDir, `backup_${timestamp}.sql`);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [tables] = await connection.query("SHOW TABLES");
    const tableNames = tables.map(row => Object.values(row)[0]);
    let sqlDump = "";

    for (const table of tableNames) {
      // Lấy cấu trúc bảng
      const [createStmt] = await connection.query(`SHOW CREATE TABLE \`${table}\``);
      sqlDump += createStmt[0]["Create Table"] + ";\n\n";

      // Lấy dữ liệu bảng
      const [rows] = await connection.query(`SELECT * FROM \`${table}\``);
      for (const row of rows) {
        const values = Object.values(row).map(v => connection.escape(v)).join(", ");
        sqlDump += `INSERT INTO \`${table}\` VALUES (${values});\n`;
      }
      sqlDump += "\n";
    }

    fs.writeFileSync(file, sqlDump);
    console.log("✅ Backup created:", file);
    sendEmail("✅ Database Backup SUCCESS", `Backup created:\n${file}`);
    await connection.end();
  } catch (err) {
    console.error("❌ Backup error:", err);
    sendEmail("❌ Database Backup FAILED", `Backup failed:\n${err.message}`);
  }
};

// Lên lịch backup mỗi ngày 19:30 giờ VN
cron.schedule(
  "50 19 * * *",
  () => {
    console.log("⏳ Running daily backup at 19:30 VN time...");
    deleteOldBackups();
    backupDatabase();
  },
  { timezone: "Asia/Ho_Chi_Minh" }
);

console.log("🔥 Database backup scheduler running...");
