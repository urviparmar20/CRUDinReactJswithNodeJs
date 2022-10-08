const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
morgan.format =
  "' Request_From_IP \t ' :remote-addr, ' Request_User \t' :remote-user, ' Request_Date_Time \t' :date[clf], ' Request_Type \t' :method, ' Request_URL \t' :url, ' HTTP_Version \t' :http-version, ' Response_Code \t' :status, ' Content_Length \t' :res[content-length], ' Response_Time \t' :response-time ms,";
app.use(morgan(morgan.format));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit();
  });

// routes
require("./app/routes/auth")(app);
require("./app/routes/book")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "creator",
      }).save((err) => {
        if (err) {
          console.log("error:", err);
        }

        console.log("added creator to roles collection");
      });

      new Role({
        name: "viewer",
      }).save((err) => {
        if (err) {
          console.log("error:", err);
        }

        console.log("added viewer to roles collection");
      });

      new Role({
        name: "view_all",
      }).save((err) => {
        if (err) {
          console.log("error:", err);
        }

        console.log("added view_all to roles collection");
      });
    }
  });
}
