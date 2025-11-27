// const express = require("express");
// const router = express.Router();
// const upload = require("../middlewares/uploadMiddleware");
// const File = require("../models/File"); // Tạo model File nếu chưa có
// const auth = require("../middlewares/authMiddleware");

// // Upload 1 file
// router.post("/upload", auth, upload.single("file"), async (req, res) => {
//   try {
//     const file = await File.create({
//       filename: req.file.filename,
//       originalName: req.file.originalname,
//       path: req.file.path,
//       size: req.file.size,
//       userId: req.user.id, // nếu bạn có user
//     });
//     res.status(201).json(file);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Lấy danh sách file
// router.get("/", auth, async (req, res) => {
//   const files = await File.findAll();
//   res.json(files);
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const File = require("../models/File");
const { authenticate } = require("../middlewares/authMiddleware");

// Upload 1 file
router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    const file = await File.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      userId: req.user.id,
    });
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy danh sách file
router.get("/", authenticate, async (req, res) => {
  const files = await File.findAll();
  res.json(files);
});

module.exports = router;
