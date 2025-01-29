const fs = require("fs");

// fs.writeFile("memory.txt", "Tere iski Vo", function(err){
//     if(err) throw err;
//     console.log("File saved successfully");
// });
fs.readFile("./memory.txt","utf-8", function(err, data){
    if(err) throw err;
    console.log(data);
})