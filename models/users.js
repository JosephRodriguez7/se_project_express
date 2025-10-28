const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  console.log("Looking for user with email:", email);
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      console.log("User found:", user ? "Yes" : "No");
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      console.log("Comparing passwords...");
      return bcrypt.compare(password, user.password).then((matched) => {
        console.log("Password match:", matched);
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
