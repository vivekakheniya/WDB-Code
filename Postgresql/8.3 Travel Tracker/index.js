import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Worlds",
  password: "",
  port: 5432,
});

const app = express();
const port = 3000;
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisited() {
  const result = await db.query("SELECT country_code FROM visited_countries");

  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

app.get("/", async (req, res) => {
  //Write your code here.
  // const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = await checkVisited();
  // result.rows.forEach((country) => {
  // countries.push(country.country_code);
  // });
  // console.log(result.rows);
  res.render("index.ejs", { countries: countries, total: countries.length });
  // db.end();
});

app.post("/add", async (req, res) => {
  //This post method would checkfor the input given by the userfirst it would store that country name which user had entered into the input variable and after that we would like to get the result that whether any kind of that country nameis there in the databaseso in the result variable we would store that country code which matchesthe users containing which he had enterednow the next thingis if there is any countrylike the user had entered the result would contain a row which would have the details about that particular country like its name code etcand there will check through any statementthatif there are any rows which got returned by the database or not and after that we will create a data variable which wouldstore all of the data of that rowand there will create another variable called Country Code which would store the particular country's codeafter that we will run another querywhich we will use to insert that particular country user had entered into the table called visited countriesand afterwards we will redirect the user toan home page
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [countryCode]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await checkVisited();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
    }
  } catch (err) {
    console.log(err);
    const countries = await checkVisited();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
