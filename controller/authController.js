const { check, validationResult } = require("express-validator");
const user = require("../models/authModel");
const bcrypt = require("bcryptjs");

exports.getSignup = (req, res) => {
  res.render("signup", {
    pageTitle: "Signup-page",
    errors: [],
    oldInput: { userName: "", email: "" },
  });
};

exports.postSignup = [
  check("userName")
    .isLength({ min: 2 })
    .withMessage("User name must be at least 2 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("User name must contain only letters"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
    .withMessage("Password must contain at least one letter and one number"),

  (req, res) => {
    const { userName, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("signup", {
        pageTitle: "Signup-page",
        errors: errors.array().map((err) => err.msg),
        oldInput: { userName, email },
      });
    }
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const RegisterUser = new user({
          userName,
          email,
          password: hashedPassword,
        });
        return RegisterUser.save()
          .then(() => {
            console.log("data has been gone to db");
            res.redirect("/login");
          })
          .catch((err) => {
            console.log("error while saving in db: ", err);
          });
      })
      .catch((err) => {
        res.status(500).render("signup", {
          pageTitle: "Signup-page",
          isLoggedIn: false,
          errors: [err.message],
          oldInput: { userName, email },
        });
      });
  },
];

exports.getLogin = (req, res) => {
  res.render("login", {
    pageTitle: "login",
    errors: [],
    oldInput: { email: "" },
  });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await user.findOne({ email });
    if (!userData) {
      return res.status(401).render("login", {
        pageTitle: "login",
        errors: ["user not found"],
        oldInput: { email },
      });
    }
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).render("login", {
        pageTitle: "login",
        errors: ["password not matched"],
        oldInput: { email },
      });
    }

    //session data
    req.session.isLoggedIn = true;
    req.session.user = userData;
    req.session.save();

    res.redirect("/home");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).render("login", {
      pageTitle: "Login",
      errors: ["Internal server error"],
      oldInput: { email },
    });
  }
};

exports.getLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
};
