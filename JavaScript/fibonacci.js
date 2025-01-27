let fib = [];
let first = 0;
let second = 1;
let third;
function fibonacciSeq(n) {
    fib.push(first);
    if(n===1){
        return fib;
    }
    fib.push(second);
    if(n===2){
        return fib;
    }
    for(let i = 2; i<n; i++){
        third = first + second;
        fib.push(third);
        first = second;
        second = third;
    }
    return fib;
}

let ans = fibonacciSeq(2);
console.log(ans);
