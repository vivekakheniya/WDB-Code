import express from "express";
import bodyParser from "body-parser";
// import morgan from 'morgan';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
let bandName = "";
// See here we have reported some of the packagesthat is needed in this our development as I'm a beginner And I'm importingexpress since it will help us write this outside development codeand I've imported body passer as it is a middleware tooland the below two imports would help us to dynamically get as our file locationand below we have first use the body parts middlewareand below that we have created our own custom middleware which is the band namegenwhich would give usthe inputs in whichever way we wantthus first when the user sends data to the serverthe server would getthe file which is the index.html from the location and after that it will get processthrough the function band Namegen after that we call the user would get thefinal solution as per the processing by the bandname generator
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan("tiny"));
function bandNameGen(req, res, next) {
  console.log(req.body);
  //streen and petname Are the key values or the key namesof the html content that has been came from the client side or userthey basically the name attributeof the input tag
  bandName = req.body["streen"] + req.body["petname"];
  next();
}

app.use(bandNameGen);
app.get("/", (req, res) => {
  // res.send("Hello, world!");
  res.sendFile(__dirname + "/public/index.html");
});
app.post("/submit", (req, res) => {
  // console.log(req.body);
  res.send(`<h1>Your Band Name is: </h1><h2>${bandName}🙏🏼</h2>`);
});
app.listen(port, (req, res) => {
  console.log(`Listening on port ${port}`);
});
