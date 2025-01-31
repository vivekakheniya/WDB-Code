import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  // console.log(req.body["fName"]);
  res.render('index.ejs');
});

app.post("/submit", (req, res) => {
  const numLett = req.body["fName"].length + req.body["lName"].length;
  // console.log(numLett);
  res.render("index.ejs", { numLett: numLett })
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
