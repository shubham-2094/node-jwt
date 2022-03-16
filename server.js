const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const movies = require("./routes/movie");
const users = require("./routes/user");
const mongoose = require("./config/database"); //DB configuration
var jwt = require("jsonwebtoken");
//const { decode } = require("jsonwebtoken");

const app = express();

app.set("secretKey", "nodeRestApi"); //jwt token

// connection to mongodb
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
console.log("Connectd to database");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ Message: "REST API with Node js" });
});

//public route
app.use("/users", users);

//private route
app.use("/movies", validateUser, movies);

// app.get("/favicon.ico", (req, res) => {
//   res.sendStatus(204);
// });

function validateUser(req, res, next) {
  jwt.verify(
    req.headers["x-access-token"],
    req.app.get("secretKey"),
    (err, decoded) => {
      if (err) {
        res.json({ status: "error", message: err.message, data: null });
      } else {
        //add user id to req
        req.body.userId = decoded.id;
        next();
      }
    }
  );
}

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// handle errors
app.use((err, req, res, next) => {
  console.log(err);

  if (err.status === 404) res.status(404).json({ message: "Not found" });
  else res.status(500).json({ message: "Something looks wrong :( !!!" });
});

app.listen(5000, () => {
  console.log("Node server listening on port 5000");
});
