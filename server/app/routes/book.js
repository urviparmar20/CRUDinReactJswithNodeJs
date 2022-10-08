const { authJwt } = require("../middleware");
const controller = require("../controllers/book");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // create, update, list and list using id
  app.post(
    "/books",
    [authJwt.verifyToken, authJwt.checkUserType],
    controller.booksListAndCreate
  );

  // delete
  app.post(
    "/books/delete",
    [authJwt.verifyToken, authJwt.isCreator],
    controller.deleteBook
  );
};
