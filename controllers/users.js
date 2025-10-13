const User = require("../models/users");

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server Error" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
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
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send({ user, message: "User created!" }))
    .catch((err) => {
      console.error(err);
      res.status(400).send({ message: "Invalid data" });
    });
};

module.exports = { createUser, getUserById, getAllUsers };
