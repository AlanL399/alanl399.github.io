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
const lightStylesheet = "_gothic_styles.css";
const darkStylesheet = "_gothic_styles_dark.css";

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
	setCookie("fontSize", newSize, 365); // Store the font size in a cookie for 1 year
	applyFontSize(newSize);
}

// Function to reset font size
function resetFontSize() {
	const newSize = 18;
	setCookie("fontSize", newSize, 365);
	applyFontSize(newSize);
	fontSizeSlider.value = newSize;
}

// Check if the font size is stored in a cookie
const storedFontSize = getCookie("fontSize");
if (storedFontSize) {
	fontSizeSlider.value = storedFontSize;
	applyFontSize(storedFontSize);
}

function toggleStylesheet() {
  const activeStylesheet = stylesheetLink.href.includes(lightStylesheet) ? darkStylesheet : lightStylesheet;
  setStylesheet(activeStylesheet);
}

// Function to set the active stylesheet and store it in a cookie for 1 year
function setStylesheet(stylesheet) {
  stylesheetLink.href = stylesheet;
  setCookie("activeStylesheetVariable", stylesheet, 365);
}

// Check if the active stylesheet variable is stored in a cookie and apply it
if (getCookie("activeStylesheetVariable") === lightStylesheet || getCookie("activeStylesheetVariable") === darkStylesheet) {
  setStylesheet(getCookie("activeStylesheetVariable"));
}

// Event listeners
fontSizeSlider.addEventListener("input", handleSliderInput);
toggleStylesheetButton.addEventListener("click", toggleStylesheet);
resetFontButton.addEventListener("click", resetFontSize);

// Function to toggle psalms display
export function togglePsalms() {
	rows.forEach((row) => {
		row.style.display = (row.style.display === "none") ? "table-row" : "none";
	});
}