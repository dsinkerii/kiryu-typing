function padLogoForKiryu(logo) {
    logo.style.display = "inline-flex";
    logo.style.alignItems = "center";
    logo.style.justifyContent = "center";

    logo.style.minWidth = "160px";
    logo.style.minHeight = "90px";

    logo.style.padding = "10px";
    logo.style.boxSizing = "border-box";
}

var newDiv = document.createElement("kiryuDiv");
newDiv.id = "kiryuDiv";

const extensionId = chrome.runtime.id;
const videoUrl = chrome.runtime.getURL("videos/kiryu/kiryu-idle.mp4");
const videoUrlTypeLeft = chrome.runtime.getURL("videos/kiryu/kiryu-typing-left.mp4");
const videoUrlTypeRight = chrome.runtime.getURL("videos/kiryu/kiryu-typing-right.mp4");
const videoUrlSuccess = chrome.runtime.getURL("videos/kiryu/kiryu-success.mp4");
const videoUrlSuccessText = chrome.runtime.getURL("videos/text/successwithblur.webm");

var currentURL = window.location.href;

newDiv.innerHTML = `
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
<style>
#kiryu {
    position: relative;
    top: -50px;
    left: -50px;
    overflow: visible;
    background-color: #50505200;
    z-index: 10000000;
}
video {
    overflow: visible;
}
</style>
`;

let curVid = null;
let curVidLeft = null;
let curVidRight = null;
let curVidSuccess = null;
let curVidTextSuccess = null;

function initVideoRefs() {
    curVid = document.getElementById("typing-video");
    curVidLeft = document.getElementById("typing-video-left");
    curVidRight = document.getElementById("typing-video-right");
    curVidSuccess = document.getElementById("typing-video-success");
    curVidTextSuccess = document.getElementById("text-video-success");
}

function ensureVideoRefs() {
    if (!curVid || !curVidLeft || !curVidRight || !curVidSuccess || !curVidTextSuccess) {
        initVideoRefs();
    }
    return !!(curVid && curVidLeft && curVidRight && curVidSuccess && curVidTextSuccess);
}

function getLogoElement() {
    if (currentURL.includes("www.google.com/search")) {
        return document.querySelector("div.logo.Ib7Efc") || document.querySelector(".logo");
    }
    if (currentURL.includes("duckduckgo.com")) {
        return document.querySelector("#header-logo-wrapper");
    }
    if (currentURL.includes("www.bing.com")) {
        return document.querySelector("a.b_logoArea");
    }
    if (currentURL.includes("search.brave.com")) {
        return document.querySelector("a.nav-logo");
    }
    if (currentURL.includes("http://127.0.0.1:8888/search")) {
        return document.getElementById("search_header");
    }
        return null;
}
function placeKiryuOnLogo() {
    if (document.getElementById("kiryuDiv")) return true;

    const logo = getLogoElement();
    if (!logo) return false;
    if (currentURL.includes("duckduckgo.com")) {
        if (!document.body.dataset.kiryuShifted) {
            document.body.style.paddingLeft = "30px";
            document.body.style.boxSizing = "border-box";
            document.body.dataset.kiryuShifted = "1";
        }
        document.getElementsByClassName("site-wrapper")[0].style.overflow = "visible";
        const ddgLogo = document.querySelector("#header-logo-wrapper");
        if (ddgLogo) ddgLogo.style.overflow = "visible";
    }

    const logoPos = window.getComputedStyle(logo).position;
    if (logoPos === "static") logo.style.position = "relative";
    padLogoForKiryu(logo);

    let Kiryuoff = document.getElementById("kiryuOffset");
    if (!Kiryuoff) {
        Kiryuoff = document.createElement("kiryuOffset");
        Kiryuoff.id = "kiryuOffset";
        let offsetX = 50;
        let offsetY = 50;

        if (currentURL.includes("www.google.com/search")) { offsetX = 16; offsetY = 42; }
        else if (currentURL.includes("www.bing.com")) { offsetX = 60; offsetY = 50; }
        else if (currentURL.includes("duckduckgo.com")) { offsetX = 20; offsetY = 50; }
        else if (currentURL.includes("search.brave.com")) { offsetX = 50; offsetY = 50; }

        Kiryuoff.style.cssText =
            "position:absolute;" +
            "left:50%;top:50%;" +
            "transform:translate(-50%,-50%) translate(" + offsetX + "px," + offsetY + "px);" +
            "pointer-events:none;" +
            "z-index:10000000;";

    } else {
        while (Kiryuoff.firstChild) Kiryuoff.removeChild(Kiryuoff.firstChild);
    }

    Kiryuoff.appendChild(newDiv);
    logo.appendChild(Kiryuoff);

    if (currentURL.includes("www.google.com/search")) {
        var topbar = document.getElementById("searchform")?.childNodes?.[0];
        if (topbar) topbar.style = "margin-top: 0px;height: 99px;";
        var main = document.getElementById("main");
        if (main) main.style = "padding-top: 20px;";
    }

    initVideoRefs();
    return true;
}

setTimeout(placeKiryuOnLogo, 0);
document.addEventListener("DOMContentLoaded", () => {
    placeKiryuOnLogo();
    setTimeout(placeKiryuOnLogo, 250);
    setTimeout(placeKiryuOnLogo, 1000);
});

const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};

var isPlaying = false;
var typing = false;
let typingCooldown = null;

async function Success(event) {
    if (!ensureVideoRefs()) return;

    if (!isPlaying) {
        isPlaying = true;
        curVidSuccess.style.filter = "opacity(100%)";
        curVidTextSuccess.style.filter = "opacity(100%)";
        curVidSuccess.currentTime = "0";
        curVidTextSuccess.currentTime = "0";
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
    if (!ensureVideoRefs()) return;

    if (!isPlaying) {
    isPlaying = true;
    clearTimeout(typingCooldown);

    try {
        if (Math.floor(Math.random() * 2) == 0) {
            curVidLeft.style.filter = "opacity(100%)";
            curVidLeft.currentTime = "0";
            await curVidLeft.play();
            await delay(240);
            curVidLeft.pause();
            curVidLeft.style.filter = "opacity(0%)";
            typing = false;
        } else {
            curVidRight.style.filter = "opacity(100%)";
            curVidRight.currentTime = "0";
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

    typingCooldown = setTimeout(() => {
        if (!typing) {
            Success(event);
        }
    }, 1000);
    }
}

window.addEventListener("keydown", (event) => {
    if (!ensureVideoRefs()) return;

    if (event.isComposing || event.key == "Enter") {
        Success(event);
        return;
    } else {
        typing = true;
        f(event);
    }
}, true);
