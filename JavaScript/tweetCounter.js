var tweet = prompt("Compose your tweet: ");
var tweetLen = tweet.length;
if(tweetLen>280){
    alert("You have exceeded the word limit. Here is your allowed tweet: "+ tweet.slice(0, 280));
} else{
    alert("Your entered tweet is: "+tweet);
}