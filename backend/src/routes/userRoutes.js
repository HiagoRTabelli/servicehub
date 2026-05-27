const express = require("express");
const {
  listUsers,
  listActiveTechnicians,
  createUser,
  updateUser,
  deactivateUser,
  deleteUser,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Técnico também pode acessar essa lista
router.get("/technicians/active", listActiveTechnicians);

// Daqui pra baixo só admin
router.use(adminMiddleware);

router.get("/", listUsers);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.patch("/:id/deactivate", deactivateUser);
router.delete("/:id", deleteUser);

module.exports = router;