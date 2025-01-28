let crash = new Audio("./sounds/crash.mp3");
let kb = new Audio("./sounds/kick-bass.mp3");
let snare = new Audio("./sounds/snare.mp3");
let t1 = new Audio("./sounds/tom-1.mp3");
let t2 = new Audio("./sounds/tom-2.mp3");
let t3 = new Audio("./sounds/tom-3.mp3");
let t4 = new Audio("./sounds/tom-4.mp3");

//detecting button presss
for (let i = 0; i < document.querySelectorAll(".drum").length; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function () {
    let btnPress = this.innerHTML;
    makeSound(btnPress);
    buttonAnimation(btnPress);
  });
}
//Detecting keyboard press
document.addEventListener("keydown", function(event){
  makeSound(event.key);
  buttonAnimation(event.key);
})

function makeSound(key){
  switch (key) {
    case "w":
      t1.play();
      break;

    case "a":
      t2.play();
      break;

    case "s":
      t3.play();
      break;

    case "d":
      t4.play();
      break;

    case "j":
      snare.play();
      break;

    case "k":
      crash.play();
      break;

    case "l":
      kb.play();
      break;
  }
}

function buttonAnimation(currentKey){

  let activeButton = document.querySelector("."+currentKey);

  activeButton.classList.add("pressed");

  setTimeout(function(){
    activeButton.classList.remove("pressed");
  }, 100)
}