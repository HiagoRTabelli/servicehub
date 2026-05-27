const express = require("express");
const { createReport } = require("../controllers/reportController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../config/multer");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/orders/:orderId/report",
  upload.single("attachment"),
  createReport
);

module.exports = router;