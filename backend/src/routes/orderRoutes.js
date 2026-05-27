const express = require("express");

const {
  createOrder,
  listOrders,
  getOrderById,
  acceptOrder,
  finishOrder,
  addTeamMember,
  removeTeamMember,
} = require("../controllers/orderController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listOrders);
router.get("/:id", getOrderById);

router.post("/", adminMiddleware, createOrder);

router.patch("/:id/accept", acceptOrder);
router.patch("/:id/finish", finishOrder);

router.post("/:id/team", addTeamMember);
router.delete("/:id/team/:memberId", removeTeamMember);

module.exports = router;