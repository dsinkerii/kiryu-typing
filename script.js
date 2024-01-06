var newDiv = document.createElement("kiryuDiv");

const extensionId = chrome.runtime.id;
const videoUrl = chrome.runtime.getURL("videos/kiryu/kiryu-idle.mp4");
const videoUrlTypeLeft = chrome.runtime.getURL("videos/kiryu/kiryu-typing-left.mp4");
const videoUrlTypeRight = chrome.runtime.getURL("videos/kiryu/kiryu-typing-right.mp4");
const videoUrlSuccess = chrome.runtime.getURL("videos/kiryu/kiryu-success.mp4");
const videoUrlSuccessText = chrome.runtime.getURL("videos/text/successwithblur.webm");

var currentURL = window.location.href;

newDiv.innerHTML = `
<html>
<div id="kiryu">
    <video width="160" height="90" autoplay loop muted id="typing-video">
        <source src=` + videoUrl + ` type="video/mp4">
        Your browser does not support the video tag.
    </video>
    <video width="160" height="90" muted id="typing-video-left" style="position: absolute;left: 0;top: 0px;filter: opacity(0%);">
        <source src=` + videoUrlTypeLeft + ` type="video/mp4">
        Your browser does not support the video tag.
    </video>
    <video width="160" height="90" muted id="typing-video-right" style="position: absolute;left: 0;top: 0px;filter: opacity(0%);">
        <source src=` + videoUrlTypeRight + ` type="video/mp4">
        Your browser does not support the video tag.
    </video>
    <video width="160" height="90" muted id="typing-video-success" style="position: absolute;left: 0;top: 0px;filter: opacity(0%);">
        <source src=` + videoUrlSuccess + ` type="video/mp4">
        Your browser does not support the video tag.
    </video>
    <video width="160" height="90" muted id="text-video-success" style="position: absolute;left: 0px;top: 35px;filter: opacity(0%);z-index:990;">
        <source src=` + videoUrlSuccessText + ` type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>
</html>
<style>
    
#kiryu {
    position: ` + (currentURL == 'https://www.google.com/'|| currentURL == 'https://search.brave.com/' ? "absolute" : "fixed") + `;
    margin: ` + (currentURL.includes("http://127.0.0.1:8888/search") == true
    ? "200px" 
    : currentURL == 'https://www.google.com/' 
        ? "25%" 
        : "-50px") + `;
    top: `+ (currentURL.includes("http://127.0.0.1:8888/search") == true
    ? "-185px" 
    : currentURL == 'https://www.google.com/'
        ? "-100%" 
        : currentURL == 'https://search.brave.com/' 
            ? "35%"
            : "75px") + `;
    background-color: #505052;
    ` + (currentURL == 'https://search.brave.com/' ? "left: 50%;" : "\n") + `
}
</style>
`;

if(currentURL == 'https://www.google.com/'){
    var logoElement = document.getElementsByTagName("body")[0].getElementsByTagName("div")[16].getElementsByTagName("div")[0];
    logoElement.getElementsByTagName("img")[0].style.filter = "opacity(0%)";
    var Kiryuoff = document.createElement("kiryuOffset");
    Kiryuoff.appendChild(newDiv);
    logoElement.appendChild(Kiryuoff);
}
else if(currentURL.includes("www.google.com/search")){
    var logoElement = document.getElementById("logo");
    logoElement.appendChild(newDiv);
}else if(currentURL.includes("http://127.0.0.1:8888/search")){ // in case you use searxng like me
    var logoElement = document.getElementById("search_header");
    logoElement.appendChild(newDiv);
}
else if(currentURL == "https://search.brave.com/"){
    var logoElement = document.getElementById("logo");
    logoElement.getElementsByTagName("img")[0].style.filter = "opacity(0%)";
    logoElement.appendChild(newDiv);
}
else if(currentURL.includes("search.brave.com/search")){
    var logoElement = document.getElementsByClassName("nav-logo btn btn-link svelte-1og62gc")[0];
    logoElement.appendChild(newDiv);
}
//key presses

const curVid = document.getElementById("typing-video");
const curVidLeft = document.getElementById("typing-video-left");
const curVidRight = document.getElementById("typing-video-right");
const curVidSuccess = document.getElementById("typing-video-success");
const curVidTextSuccess = document.getElementById("text-video-success");

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};
var isPlaying = false;

var typing = false;

async function Success(event) {
    if(!isPlaying){
        isPlaying = true;
        curVidSuccess.style.filter = "opacity(100%)";
        curVidTextSuccess.style.filter = "opacity(100%)";
        curVidSuccess.currentTime = '0';
        curVidTextSuccess.currentTime = '0';
        curVidTextSuccess.play();
        curVidSuccess.play();
        await delay(2020);
        curVidSuccess.pause();
        curVidTextSuccess.pause();
        curVidTextSuccess.style.filter = "opacity(0%)";
        curVidSuccess.style.filter = "opacity(0%)";
        isPlaying = false;
    }
}

async function f(event) {
    if(!isPlaying){
        isPlaying = true;
        if(Math.floor(Math.random() * 2) == 0){
            curVidLeft.style.filter = "opacity(100%)";
            curVidLeft.currentTime = '0';
            curVidLeft.play();
            await delay(240);
            curVidLeft.pause();
            curVidLeft.style.filter = "opacity(0%)";
        }else{
            curVidRight.style.filter = "opacity(100%)";
            curVidRight.currentTime = '0';
            curVidRight.play();
            await delay(240);
            curVidRight.pause();
            curVidRight.style.filter = "opacity(0%)";
        }
    isPlaying = false;
    await delay(750);
    typing = false;
    await delay(750);
    if(!typing){
        Success(event);
    }
    }
  }
addEventListener("keydown", (event) => {
    if (event.isComposing || event.which === 229) {
      return;
    }
    if(event.key == "Enter"){
        Success(event);

    }else{
        typing = true;
        f(event);
    }
    /*
    curVid.pause();
    curVid.currentTime = '0';
    curVid.play();
    */


  });


