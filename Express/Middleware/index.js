import express from "express";
import bodyParser from "body-parser";

//Below three lines would give us the dynamic pathofourresponse when we have to provideor we need to we need the original path of the file see when we run the nodeor server on our local machine we know the original path but when we upload it there on some cloud platform we don't have the directory thus below three lines would give us the directory dynamically whenever we upload or update our code
import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.get('/', (req, res) =>{
    // console.log(__dirname + "/public/index.html");
    res.sendFile(__dirname + "/public/index.html");
});
app.use(bodyParser.urlencoded({extended: true}));
app.post("/submit", (req, res) =>{
    console.log(req.body);
})
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})