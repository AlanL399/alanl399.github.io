// Import the cookie-related functions from cookies.js
import { setCookie, getCookie } from './cookies.js';

// Get elements
const fontSizeSlider = document.getElementById("fontSizeSlider");
const bodyElement = document.body;
const h2Elements = document.querySelectorAll("h2");
const h3Elements = document.querySelectorAll("h3");
const h5Elements = document.querySelectorAll("h5");
const resetFontButton = document.getElementById("resetFontButton");

// const rows = document.querySelectorAll(".row1, .row2");
// const stylesheetLink = document.getElementById("stylesheetLink");
// const toggleStylesheetButton = document.getElementById("toggleStylesheetButton");
// const lightStylesheet = "_gothic_styles.css";
// const darkStylesheet = "_gothic_styles_dark.css";
// const cardsStylesheet = "_gothic_styles_cards.css";

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

// const stylesheets = [lightStylesheet, darkStylesheet, cardsStylesheet];
// let currentIndex = stylesheets.indexOf(stylesheetLink.href);

// function toggleStylesheet() {
	// currentIndex = (currentIndex + 1) % stylesheets.length;
	// const activeStylesheet = stylesheets[currentIndex];
	// setStylesheet(activeStylesheet);
// }

// Function to set the active stylesheet and store it in a cookie for 1 year
// function setStylesheet(stylesheet) {
  // stylesheetLink.href = stylesheet;
  // setCookie("activeStylesheetVariable", stylesheet, 365);
// }

// Check if the active stylesheet variable is stored in a cookie and apply it
// if (getCookie("activeStylesheetVariable") === lightStylesheet || getCookie("activeStylesheetVariable") === darkStylesheet || getCookie("activeStylesheetVariable") === cardsStylesheet) {
  // setStylesheet(getCookie("activeStylesheetVariable"));
// }

// Event listeners
fontSizeSlider.addEventListener("input", handleSliderInput);
// toggleStylesheetButton.addEventListener("click", toggleStylesheet);
resetFontButton.addEventListener("click", resetFontSize);


// Function to load data based on the selected date
export function loadData() {
    const dateInput = document.getElementById('datePicker');
    const selectedDate = new Date(dateInput.value);
		
    if (!isNaN(selectedDate)) {
        // Get the day of the week as a number (0-6, where 0 is Sunday)
        const dayOfWeekIndex = selectedDate.getUTCDay();
        // Array to map day number to day name
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = dayNames[dayOfWeekIndex];

        console.log(`Selected day: ${dayOfWeek}`);

        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const dataForDay = data[dayOfWeek] || [];
                const dataBody = document.getElementById('dataBody');
                dataBody.innerHTML = ''; // Clear previous data

                dataForDay.forEach(item => {
                    const row = document.createElement('tr');
                    const leftCell = document.createElement('td');
                    const rightCell = document.createElement('td');
                    
                    leftCell.textContent = item.left;
                    rightCell.textContent = item.right;
                    
                    row.appendChild(leftCell);
                    row.appendChild(rightCell);
                    dataBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error loading data:', error));
    } else {
        console.error('Invalid date selected');
    }
}

// Function to set the date picker to today's date and load data
function initializeDatePicker() {
    const dateInput = document.getElementById('datePicker');
    const today = new Date();
    // Set the date input to today's date
    dateInput.value = today.toISOString().split('T')[0];
    // Load data for today's date
    loadData();
}

// Set up the page to initialize with today's date and load data
document.addEventListener('DOMContentLoaded', initializeDatePicker);