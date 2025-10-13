const router = require("express").Router();
const {
  getItems,
  postNewItem,
  deleteItem,
} = require("../controllers/clothingitems");

router.get("/", getItems);
router.post("/", postNewItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
