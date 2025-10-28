const express = require("express");
const mainRouter = require("./routes/index");
const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const { createUser, login } = require("./controllers/users");
const cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the Database");
  })
  .catch((e) => console.error("Error connecting to the Database", e));

app.use(cors());
app.use(express.json());

app.post("/login", login);
app.post("/signup", createUser);

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
