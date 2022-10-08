const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user");
db.role = require("./role");
db.books = require("./books");

db.ROLES = ["view_all", "viewer", "creator"];

module.exports = db;
