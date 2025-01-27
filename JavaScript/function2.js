// function getMilk(money) {
//   console.log("leaveHouse");
//   console.log("moveRight");
//   console.log("moveRight");
//   console.log("moveUp");
//   console.log("moveUp");
//   console.log("moveUp");
//   console.log("moveUp");
//   console.log("moveRight");
//   console.log("moveRight");
//   var bottles = Math.floor(money / 1.5);
//   console.log("Get " + bottles + " of Milk");
//   console.log("moveLeft");
//   console.log("moveLeft");
//   console.log("moveDown");
//   console.log("moveDown");
//   console.log("moveDown");
//   console.log("moveDown");
//   console.log("moveLeft");
//   console.log("moveLeft");
//   console.log("enterHouse");
// }
// getMilk(13);

// console.log(Math.round(5/3));
function getMilk(money) {   
    console.log("leaveHouse");
    console.log("moveRight");
    console.log("moveRight");
    console.log("moveUp");
    console.log("moveUp");
    console.log("moveUp");
    console.log("moveUp");
    console.log("moveRight");
    console.log("moveRight");
      // var bottles = Math.floor(money/1.5);
      let numb = noOfBottle(money, 1.5);
      console.log("Get "+numb+" bottles of Milk");
    console.log("moveLeft");
    console.log("moveLeft");
    console.log("moveDown");
    console.log("moveDown");
    console.log("moveDown");
    console.log("moveDown");
    console.log("moveLeft");
    console.log("moveLeft");
    console.log("enterHouse");
      return calcChange(money, 1.5);
  }
  
  function noOfBottle(money, price){
      let bottles = Math.floor( money/price);
      return bottles;
  }
  function calcChange(Amount, price){
      let chng = Amount%price;
      return chng;
  }
  
  let change=getMilk(15);
  console.log(change);