/* 
This code implements a Family Travel Type Tracker using Express, PostgreSQL, and EJS templates. 

1. **Setup**: The server is set up using Express, with `bodyParser` for form handling and `pg` for database interaction. A PostgreSQL database named "Worlds" is connected.

2. **Data Structures**: 
   - `currentUserId` stores the ID of the currently selected user.
   - `users` is an array storing sample user data with names and preferred colors.

3. **Database Queries**:
   - `checkVisited()`: Fetches the list of countries visited by the current user from the `visited_countries` table.
   - `getCurrentUser()`: Retrieves all users from the database and finds the one matching `currentUserId`.

4. **Routes**:
   - `GET /`: Renders the homepage (`index.ejs`), displaying the visited countries, total count, user list, and the current user’s preferred color.
   - `POST /add`: Adds a new visited country for the current user if the input matches a country in the database.
   - `POST /user`: Handles user switching. If "new" is selected, it redirects to the user creation page (`new.ejs`).
   - `POST /new`: Creates a new user with a selected name and color, storing it in the database.

5. **Server Listening**: The app runs on port 3000, logging the local server address upon startup.

This project allows users to track their visited countries and associate them with a selected user, each with a unique ID and preferred color.
*/


import express from "express";

import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Worlds",
  password: "",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisisted() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1; ",
    [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getCurrentUser() {
  const result = await db.query("SELECT * FROM users");
  users = result.rows;
  return users.find((user) => user.id == currentUserId);
}

app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  const currentUser = await getCurrentUser();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUser.color,
  });
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const currentUser = await getCurrentUser();

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs");
  } else {
    currentUserId = req.body.user;
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  const name = req.body.name;
  const color = req.body.color;

  const result = await db.query(
    "INSERT INTO users (name, color) VALUES($1, $2) RETURNING *;",
    [name, color]
  );

  const id = result.rows[0].id;
  currentUserId = id;

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
