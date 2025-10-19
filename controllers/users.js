const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const auth = require("../middlewares/auth");

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server Error" });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server Error" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return User.findOne({ email }).then((existingUser) => {
        if (existingUser) {
          return res
            .status(409)
            .send({ message: "A user already exists with that email" });
        }
        return User.create({
          name,
          avatar,
          email,
          password: hashedPassword,
        }).then((user) => res.status(201).send({ message: "User created!" }));
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error creating user" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token, message: "User logged in" });
    })
    .catch((err) => {
      res.status(401).send({ message: "Incorrect email or password" });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data" });
      }

      console.error(err);
      res.status(500).send({ message: "Server Error" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  getAllUsers,
  login,
  updateProfile,
};
