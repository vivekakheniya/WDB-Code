import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.

/**
 * This Express.js application fetches random or filtered activity suggestions 
 * using the Bored API. The GET request ("/") retrieves a completely random 
 * activity, while the POST request ("/") allows users to enter preferences 
 * (type of activity and number of participants) and get a matching suggestion. 
 * If no activities match, an error message is displayed. The results are 
 * rendered using EJS templates (index.ejs for the homepage and solution.ejs 
 * for filtered results). This app uses Axios for API requests and handles 
 * errors gracefully to ensure a smooth user experience.
 */
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
//     axios.get() returns a response object, which contains metadata like status code, headers, and the actual data received from the API.
// We store this entire response in response so we can access different properties if needed (e.g., response.status).
// We extract response.data into result, because in most cases, we only need the data from the response rather than the entire object.
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const type = req.body.type;
    const participants = req.body.participants;
    const response = await axios.get(
      `https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`
    );
    const result = response.data;
    console.log(result);
    res.render("solution.ejs", {
      data: result[Math.floor(Math.random() * result.length)],
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("solution.ejs", {
      error: "No activities that match your criteria.",
    });
  }
});
  // Step 2: Play around with the drop downs and see what gets logged.
  // Use axios to make an API request to the /filter endpoint. Making
  // sure you're passing both the type and participants queries.
  // Render the index.ejs file with a single *random* activity that comes back
  // from the API request.
  // Step 3: If you get a 404 error (resource not found) from the API request.
  // Pass an error to the index.ejs to tell the user:
  // "No activities that match your criteria."


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
