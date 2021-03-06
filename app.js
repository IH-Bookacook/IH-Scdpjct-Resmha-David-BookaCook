require("dotenv").config();
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passportSetup = require("./passport-setup");

// controllers
const indexController = require("./routes/index");
const authController = require("./routes/auth");
const cooksController = require("./routes/cooks");
const becomecookController = require("./routes/becomecook");
const ourcuisineController = require("./routes/ourcuisine");
const bookingController = require("./routes/booking");

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/main-layout");
app.use(expressLayouts);
app.locals.title = "Book a Cook";

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "iamagoodcookandilovecooking",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(flash());
passportSetup(app);

// routes
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexController);
app.use("/", authController);
app.use("/cooks", cooksController);
app.use("/becomecook", becomecookController);
app.use("/ourcuisine", ourcuisineController);
app.use("/cooks", bookingController);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
