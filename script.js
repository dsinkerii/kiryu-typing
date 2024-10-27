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
    position: relative;
    top: -50px;
    left: -50px;
    overflow: visible;
    background-color: #505052;
    z-index: 10000000;
}
video {
    overflow: visible;
}
</style>
`;

//nahhhhhhh
/*if(currentURL == 'https://www.google.com/'){
    var logoElement = document.getElementsByTagName("body")[0].getElementsByTagName("div")[16].getElementsByTagName("div")[0];
    logoElement.getElementsByTagName("img")[0].style.filter = "opacity(0%)";
    var Kiryuoff = document.createElement("kiryuOffset");
    Kiryuoff.appendChild(newDiv);
    logoElement.appendChild(Kiryuoff);
}*/
if (currentURL.includes("www.google.com/search")) {
    var logoElement = document.getElementById("logo").parentNode;
    logoElement.appendChild(newDiv);

    var topbar = document.getElementById("searchform").childNodes[0];
    topbar.style = "margin-top: 0px;height: 99px;"

    var main = document.getElementById("main");
    main.style = "padding-top: 20px;"

    //var searchbar = document.getElementById("logo").parentNode.parentNode.childNodes[1]; // should work for now i hope
    //searchbar.style = "top:20px"
}/*else if(currentURL.includes("http://127.0.0.1:8888/search")){ // in case you use searxng like me
    var logoElement = document.getElementById("search_header");
    logoElement.appendChild(newDiv);
}*/
else if (currentURL.includes("yandex.ru/search")) {
    var logoElement = document.getElementsByClassName("HeaderLogo HeaderDesktop-Logo")[0]; // wow ok
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
let typingCooldown = null;

async function Success(event) {
    if (!isPlaying) {
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
    if (!isPlaying) {
        isPlaying = true;
        clearTimeout(typingCooldown);
        
        try {
            if (Math.floor(Math.random() * 2) == 0) {
                curVidLeft.style.filter = "opacity(100%)";
                curVidLeft.currentTime = '0';
                await curVidLeft.play();
                await delay(240);
                curVidLeft.pause();
                curVidLeft.style.filter = "opacity(0%)";
                typing = false;
            } else {
                curVidRight.style.filter = "opacity(100%)";
                curVidRight.currentTime = '0';
                await curVidRight.play();
                await delay(240);
                curVidRight.pause();
                curVidRight.style.filter = "opacity(0%)";
                typing = false;
            }
        } catch (error) {
            console.error("Error in typing animation:", error);
        }
        
        isPlaying = false;
        
        // Set new cooldown
        typingCooldown = setTimeout(() => {
            if (!typing) {
                Success(event);
            }
        }, 1000);
    }
}

window.addEventListener("keydown", (event) => {
    if (event.isComposing || event.key == "Enter") {
        Success(event);
        return;
    }else{
        typing = true;
        f(event);
    }
}, true);

if (!curVid || !curVidLeft || !curVidRight || !curVidSuccess || !curVidTextSuccess) {
    console.error("One or more video elements not found");
}
