import express from "express";
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    //console.log(req); // To see what the browser is requestingour serverand this would get us a lot of informationbut we can shorten it by giving another command which just gives us the main main headings
    //console.log(req.rawHeaders); //This was give us only the mainman Headings which we needto understand that what a request is.

    res.send("Hello, duniya!");
    // res.send("This response is sent by the node server!"); // This would not workas .get method only allows one send method
})

app.get("/About", (req, res) => {
    res.send("<h1>About Me: </h1> <p>Vivek Akheniya +91 - 79878 - 65462</p>")
})

app.listen(port, () => {
    console.log(`listening on port: ${port}`);  
});