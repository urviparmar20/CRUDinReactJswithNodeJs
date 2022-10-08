const mongoose = require("mongoose");

const Role = mongoose.model(
  "Role",
  new mongoose.Schema({
    name: {
      type: String,
      required: "This field is required!",
    },
  })
);

module.exports = Role;
