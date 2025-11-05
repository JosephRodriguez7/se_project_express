const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const auth = require("../middlewares/auth");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../middlewares/error-handler");

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return User.findOne({ email }).then((existingUser) => {
        if (existingUser) {
          throw new ConflictError("A user already exists with that email");
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
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else if (err.statusCode) {
        next(err);
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token, message: "User logged in" });
    })
    .catch(() => {
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  if (!name && !avatar) {
    throw new BadRequestError(
      "At least one of name or avatar must be provided"
    );
  }

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else if (err.statusCode) {
        next(err);
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  getAllUsers,
  login,
  updateProfile,
};
