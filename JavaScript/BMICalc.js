function bmiCalculator(w, h){
    let BMIval = w/Math.pow(h,2);
    return Math.round(BMIval);
}


/* If my weight is 65Kg and my height is 1.8m, I should be able to call your function like this:

var bmi = bmiCalculator(65, 1.8); 

bmi should equal 20 when it's rounded to the nearest whole number.

*/
var bmi = bmiCalculator(65, 1.8);
console.log(bmi);