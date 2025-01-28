let randomNum = Math.floor(Math.random() * 6) + 1;
let randomNum2 = Math.floor(Math.random() * 6) + 1;
// console.log(randomNum);

switch (randomNum) {
  case 1:
    document
      .getElementsByClassName("img1")[0]
      .setAttribute("src", "./images/dice1.png");
    break;

  case 2:
    document
      .getElementsByClassName("img1")[0]
      .setAttribute("src", "./images/dice2.png");
    break;

  case 3:
    document
      .getElementsByClassName("img1")[0]
      .setAttribute("src", "./images/dice3.png");
    break;

  case 4:
    document
      .getElementsByClassName("img1")[0]
      .setAttribute("src", "./images/dice4.png");
    break;

  case 5:
    document
      .getElementsByClassName("img1")[0]
      .setAttribute("src", "./images/dice5.png");
    break;

  case 6:
    document
      .getElementsByClassName("img1")[0]
      .setAttribute("src", "./images/dice6.png");
}
switch (randomNum2) {
  case 1:
    document
      .getElementsByClassName("img2")[0]
      .setAttribute("src", "./images/dice1.png");
    break;

  case 2:
    document
      .getElementsByClassName("img2")[0]
      .setAttribute("src", "./images/dice2.png");
    break;

  case 3:
    document
      .getElementsByClassName("img2")[0]
      .setAttribute("src", "./images/dice3.png");
    break;

  case 4:
    document
      .getElementsByClassName("img2")[0]
      .setAttribute("src", "./images/dice4.png");
    break;

  case 5:
    document
      .getElementsByClassName("img2")[0]
      .setAttribute("src", "./images/dice5.png");
    break;

  case 6:
    document
      .getElementsByClassName("img2")[0]
      .setAttribute("src", "./images/dice6.png");
}

if (randomNum > randomNum2) {
  document.firstElementChild.lastElementChild.querySelector("h1").innerHTML =
    "🚩 Player 1 Wins...";
} else if (randomNum === randomNum2) {
  document.firstElementChild.lastElementChild.querySelector("h1").innerHTML =
    "🚩 It's a Tie!";
} else {
  document.firstElementChild.lastElementChild.querySelector("h1").innerHTML =
    "Player 2 Wins...";
}
