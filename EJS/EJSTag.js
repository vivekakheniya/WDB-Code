import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const data = {
    title: "EJS Tags",
    seconds: new Date().getSeconds(),
    items: ["Apple", "Pear", "Orange"],
    htmlContent: "<em>This is some em text.</em>",
  };
  res.render("EJSTag.ejs", data);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
