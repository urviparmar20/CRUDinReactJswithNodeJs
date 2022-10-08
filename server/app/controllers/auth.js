const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  if (
    req.body.email &&
    req.body.password &&
    req.body.first_name &&
    req.body.last_name
  ) {
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err, user) => {
      if (err) {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = err;
        jsonObject["data"] = [];
        return;
      }
      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles },
          },
          (err, roles) => {
            if (err) {
              var jsonObject = {};
              jsonObject["status"] = "0";
              jsonObject["message"] = err;
              jsonObject["data"] = [];
              res.send(jsonObject);
              return;
            }
            var token = jwt.sign({ id: user.id }, config.secret, {
              expiresIn: 86400, // 24 hours
            });
            user.token = token;
            user.roles = roles;
            user.save((err) => {
              if (err) {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = err;
                jsonObject["data"] = [];
                res.send(jsonObject);
                return;
              }

              var authorities = [];
              for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
              }
              var jsonObject = {};
              jsonObject["status"] = "1";
              jsonObject["message"] = "User was registered successfully!";
              jsonObject["data"] = [
                {
                  id: user._id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  roles: user.roles,
                  accessToken: token,
                },
              ];
              res.send(jsonObject);
            });
          }
        );
      } else {
        Role.findOne({ name: "view_all" }, (err, roles) => {
          if (err) {
            var jsonObject = {};
            jsonObject["status"] = "0";
            jsonObject["message"] = err;
            jsonObject["data"] = [];
            res.send(jsonObject);
            return;
          }
          var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400, // 24 hours
          });
          user.roles = roles;
          user.token = token;
          user.save((err) => {
            if (err) {
              var jsonObject = {};
              jsonObject["status"] = "0";
              jsonObject["message"] = err;
              jsonObject["data"] = [];
              res.send(jsonObject);
              return;
            }
            var authorities = [];
            for (let i = 0; i < user.roles.length; i++) {
              authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }

            var jsonObject = {};
            jsonObject["status"] = "1";
            jsonObject["message"] = "User was registered successfully!";
            jsonObject["data"] = [
              {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                roles: user.roles,
                accessToken: token,
              },
            ];
            res.send(jsonObject);
          });
        });
      }
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

exports.signIn = (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne({
      email: req.body.email,
    })
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          var jsonObject = {};
          jsonObject["status"] = "0";
          jsonObject["message"] = err;
          jsonObject["data"] = [];
          res.send(jsonObject);
          return;
        }

        if (!user) {
          var jsonObject = {};
          jsonObject["status"] = "0";
          jsonObject["message"] = "User Not found.";
          jsonObject["data"] = [];
          return res.send(jsonObject);
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          var jsonObject = {};
          jsonObject["status"] = "0";
          jsonObject["message"] = "Invalid Password!";
          jsonObject["data"] = [];
          return res.send(jsonObject);
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400, // 24 hours
        });

        User.findOneAndUpdate(
          { _id: user._id },
          { token: token },
          { new: true },
          (err, data) => {}
        );

        var jsonObject = {};
        jsonObject["status"] = "1";
        jsonObject["message"] = err;
        jsonObject["data"] = [
          {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            roles: user.roles,
            accessToken: token,
          },
        ];
        res.send(jsonObject);
      });
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] = " email and Password is required field!";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};
