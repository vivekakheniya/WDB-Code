// $("h1").css("color", "blue");

$(document).keydown(function(e){
    $("h1").text(e.key);
});


$(document).on("click", function(){
    $("h1").css("color", "green");
})