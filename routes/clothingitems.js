const auth = require("../middlewares/auth");
const router = require("express").Router();
const {
  getItems,
  postNewItem,
  deleteItem,
} = require("../controllers/clothingitems");

router.get("/", getItems);
router.post("/", auth, postNewItem);
router.delete("/:itemId", auth, deleteItem);

module.exports = router;
