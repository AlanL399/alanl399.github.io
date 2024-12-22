// Import the cookie-related functions from cookies.js
import { setCookie, getCookie } from './cookies.js';

// Get elements
const fontSizeSlider = document.getElementById("fontSizeSlider");
const bodyElement = document.body;
const h2Elements = document.querySelectorAll("h2");
const h3Elements = document.querySelectorAll("h3");
const h5Elements = document.querySelectorAll("h5");
const rows = document.querySelectorAll(".row1, .row2");
const stylesheetLink = document.getElementById("stylesheetLink");
const toggleStylesheetButton = document.getElementById("toggleStylesheetButton");
const resetFontButton = document.getElementById("resetFontButton");

// Stylesheet configuration
const stylesheets = ['_gothic_styles.css', '_gothic_styles_dark.css', '_gothic_styles_cards.css'];
const isSubPage = window.location.pathname.split('/').length > 3; // Check if we're in a subfolder
const stylesheetPrefix = isSubPage ? '../' : '';

// Function to apply the font size
function applyFontSize(size) {
    const scaleFactor = parseInt(size, 10) - 18;
    bodyElement.style.fontSize = `${size}px`;
    h3Elements.forEach((h3) => {
        h3.style.fontSize = `${size}px`;
    });
    h2Elements.forEach((h2) => {
        h2.style.fontSize = `${24 + 2 * scaleFactor}px`;
    });
    h5Elements.forEach((h5) => {
        h5.style.fontSize = `${12 + 2 * scaleFactor}px`;
    });
}

// Function to handle slider input
function handleSliderInput() {
    const newSize = fontSizeSlider.value;
    setCookie("fontSize", newSize, 365);
    applyFontSize(newSize);
}

// Function to reset font size
function resetFontSize() {
    const newSize = 18;
    setCookie("fontSize", newSize, 365);
    applyFontSize(newSize);
    fontSizeSlider.value = newSize;
}

// Get current stylesheet name without path
function getCurrentStylesheetName() {
    const href = stylesheetLink.href;
    return href.substring(href.lastIndexOf('/') + 1);
}

// Initialize current index based on actual stylesheet name
let currentIndex = stylesheets.indexOf(getCurrentStylesheetName());
if (currentIndex === -1) currentIndex = 0; // Default to first stylesheet if not found

function toggleStylesheet() {
    currentIndex = (currentIndex + 1) % stylesheets.length;
    const stylesheet = stylesheets[currentIndex];
    setStylesheet(stylesheet);
}

function setStylesheet(stylesheet) {
    const fullPath = stylesheetPrefix + stylesheet;
    stylesheetLink.href = fullPath;
    setCookie("activeStylesheetVariable", stylesheet, 365);
}

// Initialize stylesheet from cookie
const storedStylesheet = getCookie("activeStylesheetVariable");
if (stylesheets.includes(storedStylesheet)) {
    setStylesheet(storedStylesheet);
    currentIndex = stylesheets.indexOf(storedStylesheet);
}

// Initialize font size from cookie
const storedFontSize = getCookie("fontSize");
if (storedFontSize) {
    fontSizeSlider.value = storedFontSize;
    applyFontSize(storedFontSize);
}

// Event listeners
fontSizeSlider.addEventListener("input", handleSliderInput);
toggleStylesheetButton.addEventListener("click", toggleStylesheet);
resetFontButton.addEventListener("click", resetFontSize);

// Toggle psalms function
export function togglePsalms() {
    if (rows) {
        rows.forEach((row) => {
            row.style.display = (row.style.display === "none") ? "table-row" : "none";
        });
    }
}