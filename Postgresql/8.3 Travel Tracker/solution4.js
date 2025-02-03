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

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
// GET home page
app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  res.render("index.ejs", { countries: countries, total: countries.length });
});

//INSERT new country
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    // Use exact match instead of LIKE to avoid partial matches
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) = $1;",
      [input.toLowerCase()]
    );

    if (result.rows.length === 0) {
      console.log("No matching country found.");
      return res.render("index.ejs", {
        countries: await checkVisisted(),
        total: (await checkVisisted()).length,
        error: "Country name does not exist, try again.",
      });
    }

    const countryCode = result.rows[0].country_code;
    console.log("Adding country:", countryCode);

    try {
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [countryCode]
      );
      res.redirect("/");
    } catch (err) {
      console.error("Duplicate entry error:", err);
      res.render("index.ejs", {
        countries: await checkVisisted(),
        total: (await checkVisisted()).length,
        error: "Country has already been added, try again.",
      });
    }
  } catch (err) {
    console.error("Database query error:", err);
    res.render("index.ejs", {
      countries: await checkVisisted(),
      total: (await checkVisisted()).length,
      error: "An unexpected error occurred, try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
