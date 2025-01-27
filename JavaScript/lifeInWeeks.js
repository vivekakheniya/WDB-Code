function lifeInWeeks(age) {
  /************Don't change the code above************/

  //Write your code here.
  var remDays = 90 * 365 - age * 365;
  var remWeek = 90 * 52 - age * 52;
  var remMon = 90 * 12 - age * 12;

  console.log(
    "You have " +
      remDays +
      " days, " +
      remWeek +
      " weeks, and " +
      remMon +
      " months left."
  );

  /*************Don't change the code below**********/
}
lifeInWeeks(25);
