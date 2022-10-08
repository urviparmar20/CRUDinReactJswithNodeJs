const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
  if (
    req.body.email &&
    req.body.password &&
    req.body.first_name &&
    req.body.last_name
  ) {
    // Email
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = err;
        jsonObject["data"] = [];
        res.send(jsonObject);
        return;
      }

      if (user) {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "Failed! Email is already in use!";
        jsonObject["data"] = [];
        res.send(jsonObject);
        return;
      }

      next();
    });
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] =
      "first_name, last_name, email and password is required fields!";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = `Failed! Role ${req.body.role} does not exist!`;
        jsonObject["data"] = [];
        res.send(jsonObject);
        return;
      }
    }
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] = "role is required fields!";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }

  next();
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
