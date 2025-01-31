import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const today = new Date();
  const day = today.getDay();

  let type = "A weekday";
  let adv = "It's Time to Work Hard...";

  if(day === 0 || day === 6){
    type = "A weekend";
    adv = "It's Time to have fun...";
  }
  res.render("index.ejs", {
    dayType: type,
    advice: adv,
  });
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
