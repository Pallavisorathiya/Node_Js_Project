const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/DbConnection");
const indexRoutes = require("./routes/index.routes");
// const blogRoutes = require("./routes/blog.routes");
const passport = require("passport");
const localStrategy = require("./middleware/localStrategy");
const session = require("express-session");
const flash = require("connect-flash");
const { flashMessage } = require("./middleware/flashMessage");

dbConnect();

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static folders
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Session middleware (must be before flash & passport)
app.use(
  session({
    name: "adminanel",
    secret: "OTP",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// Flash must come after session
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setValidateUser);

// Custom flash message middleware (to pass to EJS)
app.use(flashMessage);

// Routes
app.use("/", indexRoutes);
// app.use("/blog", blogRoutes);
// app.use("/category", categoryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Start server
const port = 9090;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
