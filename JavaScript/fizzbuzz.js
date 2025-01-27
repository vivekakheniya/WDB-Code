let outp = [];
let count = 1;
function fizzbuzz(){
if(count%3 === 0 && count % 5 ===0){
    outp.push("FizzBuzz");
} else if(count % 3 ===0){
    outp.push("Fizz");
} else if (count % 5 === 0){
    outp.push("Buzz");
} else {
    outp.push(count);
}
    count++;
    console.log(outp);
}
