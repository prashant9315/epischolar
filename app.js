const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDb = require("./config/db");
const AuthRouter = require("./Routes/AuthRouter");
const passport = require("passport");
const session = require("express-session");

const Auth = require("./Routes/Auth");

require("dotenv").config();
require("./config/passport");
require("./models/User");
require("./models/Authuser");
const PORT = process.env.PORT || 8080;
connectDb();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "mysecretkey24",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", AuthRouter);
app.use("/aut", Auth);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
