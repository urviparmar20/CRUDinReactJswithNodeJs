const mongoose = require("mongoose");

const Books = mongoose.model(
  "Books",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: "This field is required!",
      },
      author_name: {
        type: String,
        required: "This field is required!",
      },
      edition: {
        type: String,
        required: "This field is required!",
      },
      price: {
        type: String,
        required: "This field is required!",
      },
      user: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    { timestamps: true }
  )
);

module.exports = Books;
