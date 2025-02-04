// Import necessary modules
import express from "express"; // Express framework for building web applications
import bodyParser from "body-parser"; // Middleware for parsing request bodies
import pg from "pg"; // PostgreSQL client for Node.js
import bcrypt from "bcrypt"; // Library for hashing passwords
import passport from "passport"; // Authentication middleware
import { Strategy } from "passport-local"; // Local strategy for username/password authentication
import GoogleStrategy from "passport-google-oauth2"; // Google OAuth2 authentication
import session from "express-session"; // Middleware for managing user sessions
import env from "dotenv"; // Library to manage environment variables

// Initialize Express app
const app = express();
const port = 3000;
const saltRounds = 10; // Number of rounds for bcrypt hashing

env.config(); // Load environment variables from .env file

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret key for session encryption
    resave: false, // Prevents session from being saved back to store if unmodified
    saveUninitialized: true, // Forces a session that is new but not modified to be saved
  })
);

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.static("public")); // Serve static files (CSS, images, etc.)

// Initialize passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Set up PostgreSQL database connection
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect(); // Connect to the database

// Routes

// Home page route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Login page route
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Registration page route
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// Logout route
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Secrets page route (only accessible if authenticated)
app.get("/secrets", async (req, res) => {
  console.log(req.user);

  if (req.isAuthenticated()) {
    try {
      const result = await db.query(
        `SELECT secret FROM users WHERE email = $1`,
        [req.user.email]
      );
      console.log(result);
      const secret = result.rows[0].secret;

      // Render secrets page with user's secret or default message
      if (secret) {
        res.render("secrets.ejs", { secret: secret });
      } else {
        res.render("secrets.ejs", { secret: "Jack Bauer is my hero." });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/login"); // Redirect to login if not authenticated
  }
});

// Secret submission page (only accessible if authenticated)
app.get("/submit", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("submit.ejs");
  } else {
    res.redirect("/login");
  }
});

// Google OAuth authentication routes

// Redirect user to Google authentication page
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Handle Google OAuth callback after authentication
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

// Local authentication route for login
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

// Registration route
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    // Check if user already exists
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      req.redirect("/login"); // Redirect to login if user already exists
    } else {
      // Hash password and store in database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
          
          // Log the user in after registration
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/secrets");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// Handle secret submission and store in database
app.post("/submit", async function (req, res) {
  const submittedSecret = req.body.secret;
  console.log(req.user);

  try {
    await db.query(`UPDATE users SET secret = $1 WHERE email = $2`, [
      submittedSecret,
      req.user.email,
    ]);
    res.redirect("/secrets");
  } catch (err) {
    console.log(err);
  }
});

// Passport authentication setup

// Local strategy for authentication
passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        username,
      ]);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;

        // Compare entered password with hashed password
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

// Google OAuth authentication strategy
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);

        if (result.rows.length === 0) {
          // Register new Google user
          const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [profile.email, "google"]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]); // Login existing user
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, cb) => {
  cb(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
