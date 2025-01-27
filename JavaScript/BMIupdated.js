function bmiCalculator (weight, height) {
    let BMI = (weight/Math.pow(height,2)).toFixed(1);
    if(BMI<18.5){
        return `Your BMI is ${BMI},so you are underweight.`;
    }
    else if(BMI>18.5 && BMI<24.9){
        return `Your BMI is ${BMI},so you have a normal weight.`;
    } else {
        return `Your BMI is ${BMI},so you are overweight.`;
    }
}

console.log(bmiCalculator(65,1.8));