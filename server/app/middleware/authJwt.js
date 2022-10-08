const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] = "No token provided!";
    jsonObject["data"] = [];
    res.send(jsonObject);
    return;
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      var jsonObject = {};
      jsonObject["status"] = "0";
      jsonObject["message"] = "Unauthorized!";
      jsonObject["data"] = [];
      res.send(jsonObject);
      return;
    }
    if (req.body.user_id) {
      User.find({ _id: req.body?.user_id }).exec((err1, user) => {
        if (err1) {
          var jsonObject = {};
          jsonObject["status"] = "0";
          jsonObject["message"] = err1;
          jsonObject["data"] = [];
          res.send(jsonObject);
          return;
        }
        if (user !== null && user[0]?.token === token) {
          req.user_id = decoded.id;
          next();
        } else {
          var jsonObject = {};
          jsonObject["status"] = "0";
          jsonObject["message"] =
            user !== null ? "Please Provide Updated Token!" : "User Not Found!";
          jsonObject["data"] = [];
          res.send(jsonObject);
          return;
        }
      });
    } else {
      var jsonObject = {};
      jsonObject["status"] = "0";
      jsonObject["message"] = "user_id is required fields!";
      jsonObject["data"] = [];
      res.send(jsonObject);
    }
  });
};

const isCreator = (req, res, next) => {
  if (req.body.user_id) {
    User.findById({ _id: req.body.user_id }).exec((err, user) => {
      if (err) {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = err;
        jsonObject["data"] = [];
        res.send(jsonObject);
        return;
      }
      if (user !== null) {
        Role.find(
          {
            _id: { $in: user.roles },
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
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name === "creator") {
                next();
                return;
              }
            }
            var jsonObject = {};
            jsonObject["status"] = "0";
            jsonObject["message"] = "Require Creator Role!";
            jsonObject["data"] = [];
            res.send(jsonObject);
            return;
          }
        );
      } else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "User Not Found!";
        jsonObject["data"] = [];
        res.send(jsonObject);
        return;
      }
    });
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] = "user_id is required fields!";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};

const isViewerAndCreator = (req, res, next) => {
  if (req.body.user_id) {
    User.findById({ _id: req.body.user_id }).exec((err, user) => {
      if (err) {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = err;
        jsonObject["data"] = [];
        res.send(jsonObject);
        return;
      }
      if (user !== null) {
        Role.find(
          {
            _id: { $in: user.roles },
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
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name === "viewer" || roles[i].name === "creator") {
                next();
                return;
              }
            }
            var jsonObject = {};
            jsonObject["status"] = "0";
            jsonObject["message"] = "Require Creator or Viewer Role!";
            jsonObject["data"] = [];
            res.send(jsonObject);
            return;
          }
        );
      } else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "User Not Found!";
        jsonObject["data"] = [];
        res.send(jsonObject);
        return;
      }
    });
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] = "user_id is required fields!";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};

const isViewer = (req, res, next) => {
  if (req.body.user_id) {
    User.findById({ _id: req.body.user_id }).exec((err, user) => {
      if (err) {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = err;
        jsonObject["data"] = [];
        res.send(jsonObject);
        return;
      }
      if (user !== null) {
        Role.find(
          {
            _id: { $in: user.roles },
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

            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name === "viewer") {
                next();
                return;
              }
            }
            var jsonObject = {};
            jsonObject["status"] = "0";
            jsonObject["message"] = "Require Viewer Role!";
            jsonObject["data"] = [];
            res.send(jsonObject);
            return;
          }
        );
      } else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "User Not Found!";
        jsonObject["data"] = [];
        res.send(jsonObject);
        return;
      }
    });
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] = "user_id is required fields!";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};

const isViewAll = (req, res, next) => {
  if (req.body.user_id) {
    User.findById({ _id: req.body.user_id }).exec((err, user) => {
      if (err) {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = err;
        jsonObject["data"] = [];
        res.send(jsonObject);
        return;
      }
      if (user !== null) {
        Role.find(
          {
            _id: { $in: user.roles },
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

            for (let i = 0; i < roles.length; i++) {
              if (
                roles[i].name === "view_all" ||
                roles[i].name === "viewer" ||
                roles[i].name === "creator"
              ) {
                next();
                return;
              }
            }
            var jsonObject = {};
            jsonObject["status"] = "0";
            jsonObject["message"] = "Require View All Role!";
            jsonObject["data"] = [];
            res.send(jsonObject);
            return;
          }
        );
      } else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "User Not Found!";
        jsonObject["data"] = [];
        res.send(jsonObject);
        return;
      }
    });
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] = "user_id is required fields!";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};

const checkUserType = (req, res, next) => {
  if (req.body.type === "create") {
    isViewerAndCreator(req, res, next);
  } else if (req.body.type === "detail") {
    isViewAll(req, res, next);
  } else if (req.body.type === "list") {
    isViewAll(req, res, next);
  } else if (req.body.type === "update") {
    isCreator(req, res, next);
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] = "type is required fields!";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};

const authJwt = {
  verifyToken,
  isViewerAndCreator,
  isCreator,
  isViewer,
  isViewAll,
  checkUserType,
};
module.exports = authJwt;
