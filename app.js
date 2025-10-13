const express = require("express");
const mainRouter = require("./routes/index");
const app = express();
const { PORT = 3003 } = process.env;
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the Database");
  })
  .catch((e) => console.error(e));

app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
