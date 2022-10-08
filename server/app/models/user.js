const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    first_name: {
      type: String,
      required: "This field is required!",
    },
    last_name: {
      type: String,
      required: "This field is required!",
    },
    email: {
      type: String,
      required: "This field is required!",
    },
    token: {
      type: String,
    },
    password: {
      type: String,
      required: "This field is required!",
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);

module.exports = User;
