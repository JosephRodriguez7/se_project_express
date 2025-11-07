require("dotenv").config();

const express = require("express");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const { createUser, login } = require("./controllers/users");
const cors = require("cors");
const { errorHandler } = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the Database");
  })
  .catch((e) => console.error("Error connecting to the Database", e));

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", mainRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
