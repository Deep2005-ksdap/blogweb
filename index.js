// Load environment variables
require('dotenv').config();

// internal modules
const path = require('path');

// external modules
const express = require('express');
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Load values from .env
const db_url = process.env.MONGO_URI;
const sessionSecret = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 3000;

// internal modules
const editorRouter = require('./routes/editorRouter');
const authRouter = require('./routes/authRouter');
const rootDir = require('./util/pathUtil');

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(rootDir, 'public')));
app.use(express.urlencoded());

// MongoDB session store
const store = new MongoDBStore({
    uri: db_url,
    collection: 'sessions'
});

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60  // 1 hour
    }
}));

// Routes
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
app.get("/", (req, res) => res.redirect("/home"));

// Passing session info
app.use((req, res, next) => {
    const isLoggedIn = req.session && req.session.isLoggedIn ? req.session.isLoggedIn : false;
    req.isLoggedIn = isLoggedIn;
    res.locals.isLoggedIn = isLoggedIn;  // 👈 Make it available to EJS
    next();
});


app.use(editorRouter);
app.use(authRouter);

app.use((req, res, next) => {
    res.send("Error: Invalid URL");
    next();
});
 
mongoose.connect(db_url)
    .then(() => {
        console.log("Connected to DB");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Error connecting to DB:", err);
    });
