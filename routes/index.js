const router = require("express").Router();

const clothingitemsRouter = require("./clothingitems");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingitemsRouter);

module.exports = router;
