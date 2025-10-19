const auth = require("../middlewares/auth");
const router = require("express").Router();
const {
  getAllUsers,
  getCurrentUser,
  createUser,
  login,
  updateProfile,
} = require("../controllers/users");

router.get("/", auth, getAllUsers);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

module.exports = router;
