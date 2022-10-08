const db = require("../models");
const Books = db.books;
const User = db.user;
const Role = db.role;

//get books list
exports.booksListAndCreate = (req, res) => {
  if (req.body.type === "create") {
    createBook(req, res);
  } else if (req.body.type === "detail") {
    getBookListUsingId(req, res);
  } else if (req.body.type === "list") {
    getBookList(req, res);
  } else if (req.body.type === "update") {
    updateBookDetail(req, res);
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] = "type is required fields!";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};

// GET book list
const getBookList = (req, res) => {
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
            if (roles.length === 1 && roles[0].name === "viewer") {
              console.log("sdshgdsdg");
              console.log(user);
              Books.find(
                req.query
                  ? req.query.old === "1"
                    ? {
                        user: req.body.user_id,
                        createdAt: {
                          $lte: new Date(Date.now() - 60 * 1000 * 10),
                        },
                      }
                    : req.query.new === "1"
                    ? {
                        user: req.body.user_id,
                        createdAt: {
                          $gte: new Date(Date.now() - 60 * 1000 * 10),
                        },
                      }
                    : { user: req.body.user_id }
                  : { user: req.body.user_id },
                (err, data) => {
                  if (!err) {
                    var jsonObject = {};
                    jsonObject["status"] = "1";
                    jsonObject["message"] = "Book List Found Successfully";
                    jsonObject["data"] = data;
                    res.send(jsonObject);
                  } else {
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = "Book List Not Found";
                    jsonObject["data"] = [];
                    res.send(jsonObject);
                  }
                }
              ).sort({ $natural: -1 });
            } else {
              Books.find(
                req.query
                  ? req.query.old === "1"
                    ? {
                        createdAt: {
                          $lte: new Date(Date.now() - 60 * 1000 * 10),
                        },
                      }
                    : req.query.new === "1"
                    ? {
                        createdAt: {
                          $gte: new Date(Date.now() - 60 * 1000 * 10),
                        },
                      }
                    : {}
                  : {},
                (err, data) => {
                  if (!err) {
                    var jsonObject = {};
                    jsonObject["status"] = "1";
                    jsonObject["message"] = "Book List Found Successfully";
                    jsonObject["data"] = data;
                    res.send(jsonObject);
                  } else {
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = "Book List Not Found";
                    jsonObject["data"] = [];
                    res.send(jsonObject);
                  }
                }
              ).sort({ $natural: -1 });
            }
          }
        );
      } else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "User Not Found!";
        jsonObject["data"] = [];
        res.send(jsonObject);
      }
    });
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] = "user_id is required field.";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};

// GET book list using id
const getBookListUsingId = (req, res) => {
  if (req.body.user_id && req.body.book_id) {
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

            if (roles[0].name === "viewer" && roles.length === 1) {
              Books.findById(
                { _id: req.body.book_id, user: { $in: req.body.user_id } },
                (err, data) => {
                  if (!err) {
                    var jsonObject = {};
                    jsonObject["status"] = "1";
                    jsonObject["message"] = "Book Found Successfully";
                    jsonObject["data"] = [data];
                    res.send(jsonObject);
                  } else {
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = "Book Not Found";
                    jsonObject["data"] = [];
                    res.send(jsonObject);
                  }
                }
              );
            } else {
              Books.findById({ _id: req.body.book_id }, (err, data) => {
                if (!err) {
                  var jsonObject = {};
                  jsonObject["status"] = "1";
                  jsonObject["message"] = "Book Found Successfully";
                  jsonObject["data"] = [data];
                  res.send(jsonObject);
                } else {
                  var jsonObject = {};
                  jsonObject["status"] = "0";
                  jsonObject["message"] = "Book Not Found";
                  jsonObject["data"] = [];
                  res.send(jsonObject);
                }
              });
            }
          }
        );
      } else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "User Not Found!";
        jsonObject["data"] = [];
        res.send(jsonObject);
      }
    });
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] = "user_id and book_id are required field.";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};

// CREATE Request Handler
const createBook = (req, res) => {
  if (
    req.body.user_id &&
    req.body.name &&
    req.body.author_name &&
    req.body.edition &&
    req.body.price
  ) {
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
        var book = new Books();
        book.user = user;
        book.name = req.body.name;
        book.author_name = req.body.author_name;
        book.edition = req.body.edition;
        book.price = req.body.price;
        book.save((err, data) => {
          if (!err) {
            var jsonObject = {};
            jsonObject["status"] = "1";
            jsonObject["message"] = "Book Inserted Successfully";
            jsonObject["data"] = [data];
            res.send(jsonObject);
          } else {
            var jsonObject = {};
            jsonObject["status"] = "0";
            jsonObject["message"] = "Error during record insertion";
            jsonObject["data"] = [];
            res.send(jsonObject);
          }
        });
      } else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "User Not Found!";
        jsonObject["data"] = [];
        res.send(jsonObject);
      }
    });
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] =
      "user_id, name, author_name, edition and price are required field.";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};

// UPDATE Request Handler
const updateBookDetail = (req, res) => {
  if (
    req.body.book_id &&
    req.body.name &&
    req.body.author_name &&
    req.body.edition &&
    req.body.price
  ) {
    Books.findOneAndUpdate(
      { _id: req.body.book_id },
      req.body,
      { new: true },
      (err, data) => {
        if (!err) {
          var jsonObject = {};
          jsonObject["status"] = "1";
          jsonObject["message"] = "Book Updated Successfully";
          jsonObject["data"] = data;
          res.send(jsonObject);
        } else {
          var jsonObject = {};
          jsonObject["status"] = "0";
          jsonObject["message"] = "Book Not Updated";
          jsonObject["data"] = [];
          res.send(jsonObject);
        }
      }
    );
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] =
      "book_id, name, author_name, edition and price are required field.";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};

//DELETE Request Handler
exports.deleteBook = (req, res) => {
  if (req.body.book_id) {
    Books.findByIdAndRemove({ _id: req.body.book_id }, (err, data) => {
      if (!err) {
        var jsonObject = {};
        jsonObject["status"] = "1";
        jsonObject["message"] = "Book Deleted Successfully";
        jsonObject["data"] = [];
        res.send(jsonObject);
      } else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "Book Not Deleted";
        jsonObject["data"] = [];
        res.send(jsonObject);
      }
    });
  } else {
    var jsonObject = {};
    jsonObject["status"] = "0";
    jsonObject["message"] = "book_id is required field.";
    jsonObject["data"] = [];
    res.send(jsonObject);
  }
};
