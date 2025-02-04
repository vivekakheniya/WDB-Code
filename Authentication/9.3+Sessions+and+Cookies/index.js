import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";

/*
1. **Initialize Express App**
   1.1 Import required modules (`express`, `body-parser`, `pg`, `bcrypt`, `passport`, etc.) 
   1.2 Create an Express app instance (`const app = express();`) 
   1.3 Define port number (`const port = 3000;`) 
   1.4 Set `saltRounds` for password hashing 
   1.5 Load environment variables using `dotenv`
*/
const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

/*
2. **Middleware Setup**
   2.1 Configure Express sessions (`app.use(session({...}))`) 
       - Stores session data for authentication 
   2.2 Use `bodyParser` for parsing request bodies (`app.use(bodyParser.urlencoded(...))`) 
   2.3 Serve static files from the "public" folder (`app.use(express.static("public"))`) 
   2.4 Initialize Passport.js (`app.use(passport.initialize())`) 
   2.5 Use Passport to manage user sessions (`app.use(passport.session())`) 
*/
app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

/*
3. **Connect to PostgreSQL Database**
   3.1 Create a PostgreSQL client (`const db = new pg.Client({...})`) 
   3.2 Connect to the database (`db.connect();`) 
*/
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "123456",
  port: 5432,
});
db.connect();

/*
4. **Define Routes**
   4.1 GET `/` - Render the home page (`res.render("home.ejs");`) 
   4.2 GET `/login` - Render login page (`res.render("login.ejs");`) 
   4.3 GET `/register` - Render register page (`res.render("register.ejs");`) 
   4.4 GET `/logout` - Logout user and redirect to home (`req.logout()`) 
   4.5 GET `/secrets` - Check authentication, render secrets page if authenticated, otherwise redirect to login
*/
app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets.ejs");
  } else {
    res.redirect("/login");
  }
});

/*
5. **User Authentication Routes**
   5.1 POST `/login` - Authenticate user using Passport (`passport.authenticate("local", {...})`) 
       - Redirect to `/secrets` on success, `/login` on failure 
   5.2 POST `/register` - Register a new user 
       5.2.1 Extract `email` and `password` from request body 
       5.2.2 Check if the email already exists in the database 
       5.2.3 If email exists, redirect to `/login` 
       5.2.4 If email does not exist, hash the password using `bcrypt.hash()` 
       5.2.5 Insert new user with hashed password into the database 
       5.2.6 Automatically log in the newly registered user (`req.login(user, ...)`)
*/
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      req.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
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

/*
6. **Passport.js Configuration**
   6.1 Define Passport local strategy 
   6.2 Verify user credentials using `bcrypt.compare()` 
   6.3 Serialize user to store in session 
   6.4 Deserialize user from session 
*/
passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
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

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

/*
7. **Start the Server**
   7.1 Listen on the defined port (`app.listen(...)`) 
*/
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
