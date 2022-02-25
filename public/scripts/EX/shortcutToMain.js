// shortcut to main section (index page)

// DOM elements
const shortcut = document.getElementById("shortcut");
const headerDom = document.getElementById("header");

// visibility delay
function visibilityDelay() {
    shortcut.style.top = "20px";
    setTimeout(closeShortcut, 6000);
}

// close shortcut of index page
function closeShortcut() {
    shortcut.style.top = "-200px";
}

// Scroll down event
window.addEventListener("scroll", (event) => {
    event.preventDefault();
    event.stopPropagation();
    visibilityDelay();
    if (window.scrollY >= 20) {
        headerDom.classList.add("shadow");
    } else {
        headerDom.classList.remove("shadow");
    }
})