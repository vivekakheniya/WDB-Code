//Basic Functions exercises are performed on the Karel IDE
function main(){
    //your code here
    Beeps();
    putBeeper();
 }
 function diagBeep(){
    putBeeper();
    move();
    turnLeft();
    move();
 }
 function Beeps(){
    diagBeep();
    turnRight();
    diagBeep();
    turnRight();
    diagBeep();
    turnRight();
    diagBeep();
 }