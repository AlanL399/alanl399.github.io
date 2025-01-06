// Import cookie utilities
import { setCookie, getCookie } from './cookies.js';


// Stylesheet code
const stylesheetLink = document.getElementById("stylesheetLink");
const toggleStylesheetButton = document.getElementById("toggleStylesheetButton");

// Stylesheet configuration
const stylesheets = ['quignones_styles.css', 'quignones_plain_styles.css'];
const isSubPage = window.location.pathname.split('/').length > 3; // Check if we're in a subfolder
const stylesheetPrefix = isSubPage ? '../' : '';

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
	setCookie("activeStylesheetVariableQuignones", stylesheet, 365);
}

// Initialize stylesheet from cookie
const storedStylesheet = getCookie("activeStylesheetVariableQuignones");
if (stylesheets.includes(storedStylesheet)) {
	setStylesheet(storedStylesheet);
	currentIndex = stylesheets.indexOf(storedStylesheet);
}

toggleStylesheetButton.addEventListener("click", toggleStylesheet);

// Constants
const DEFAULT_FONT_SIZE = 18;
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// DOM Elements
const DOM = {
	fontSizeSlider: document.getElementById('fontSizeSlider'),
	resetFontButton: document.getElementById('resetFontButton'),
	datePicker: document.getElementById('datePicker'),
	sidebar: document.getElementById('mySidebar'),
	openBtn: document.getElementById('openbtn'),
	navbar: document.getElementById('floating-navbar'),
	psalmRows: {
		matins: {
			one: document.querySelector('.matins-psalm-one'),
			two: document.querySelector('.matins-psalm-two'),
			three: document.querySelector('.matins-psalm-three')
		},
		lauds: {
			one: document.querySelector('.lauds-psalm-one'),
			two: document.querySelector('.lauds-psalm-two'),
			three: document.querySelector('.lauds-psalm-three')
		},
		prime: {
			one: document.querySelector('.prime-psalm-one'),
			two: document.querySelector('.prime-psalm-two'),
			three: document.querySelector('.prime-psalm-three')
		},
		terce: {
			one: document.querySelector('.terce-psalm-one'),
			two: document.querySelector('.terce-psalm-two'),
			three: document.querySelector('.terce-psalm-three')
		},
		sext: {
			one: document.querySelector('.sext-psalm-one'),
			two: document.querySelector('.sext-psalm-two'),
			three: document.querySelector('.sext-psalm-three')
		},
		none: {
			one: document.querySelector('.none-psalm-one'),
			two: document.querySelector('.none-psalm-two'),
			three: document.querySelector('.none-psalm-three')
		},
		vespers: {
			one: document.querySelector('.vespers-psalm-one'),
			two: document.querySelector('.vespers-psalm-two'),
			three: document.querySelector('.vespers-psalm-three')
		},
		compline: {
			one: document.querySelector('.compline-psalm-one'),
			two: document.querySelector('.compline-psalm-two'),
			three: document.querySelector('.compline-psalm-three')
		},
		magnificat: document.querySelector('.magnificat'),
		nuncDimittis: document.querySelector('.nunc-dimittis'),
		benedictus: document.querySelector('.benedictus')
	}
};

// Gloria Patri text
const gloriaPatri = {
	latin: "<br>Glória Patri, et Fílio, et Spirítui Sancto.<br>Sicut erat in princípio, et nunc, et semper, et in sǽcula sæculórum. Amen.",
	english: "<br>Glory be to the Father, and to the Son, and to the Holy Ghost.<br>As it was in the beginning, is now, and ever shall be, world without end. Amen."
};

// Psalm loading functionality
async function loadPsalterData() {
	try {
		const response = await fetch('psalter.json');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error loading psalter data:', error);
		return null;
	}
}

function appendGloria(content, isColumn1) {
	return content + (isColumn1 ? gloriaPatri.latin : gloriaPatri.english);
}

function processAntiphon(antiphonString) {
	if (!antiphonString) return { ante: '', post: '' };

	const parts = antiphonString.split('*');
	if (parts.length !== 2) return { ante: antiphonString, post: antiphonString };

	let ante = parts[0].trim();
	// Remove comma if it's the last character and add period
	ante = ante.endsWith(',') ? ante.slice(0, -1) + '.' : ante + '.';

	// Full antiphon without the * and following space
	const post = parts.join('').replace('* ', '');

	return { ante, post };
}

async function loadPsalmsForDate(date) {
	try {
		const adjustedDate = new Date(date);
		adjustedDate.setDate(adjustedDate.getDate() + 1);
		const dayName = DAYS_OF_WEEK[adjustedDate.getDay()];
		
		console.log(`Loading psalms for ${dayName}`);

		const psalterData = await loadPsalterData();
		if (!psalterData || !psalterData[dayName]) {
			throw new Error(`No data available for ${dayName}`);
		}

		const dayData = psalterData[dayName];
		
		// Handle regular psalms
		Object.entries(DOM.psalmRows).forEach(([hour, psalms]) => {
			if (typeof psalms === 'object' && psalms !== null) {
				Object.entries(psalms).forEach(([key, row]) => {
					const psalmKey = `${hour}-psalm-${key}`;
					if (dayData[psalmKey]) {
						// Check if this is the third psalm of Lauds on Sunday
						const shouldSkipGloria = hour === 'lauds' && key === 'three' && dayName === 'Sunday';
						updatePsalmContent(row, dayData[psalmKey], shouldSkipGloria);
					}
				});
			}
		});

		// Handle antiphons for minor hours
		const hours = ['prime', 'terce', 'sext', 'none'];
		hours.forEach(hour => {
			const antiphonKey = `${hour}-antiphon`;
			if (dayData[antiphonKey]) {
				// Process Latin column
				const latinAntiphon = processAntiphon(dayData[antiphonKey].column1);
				// Process English column
				const englishAntiphon = processAntiphon(dayData[antiphonKey].column2);
				
				// Update ante elements
				const anteRow = document.querySelector(`.${hour}-antiphon-ante`);
				if (anteRow) {
					const columns = anteRow.getElementsByTagName('td');
					if (columns.length === 2) {
						columns[0].innerHTML = `<h3>Ant.</h3> ${latinAntiphon.ante}`;
						columns[1].innerHTML = `<h3>Ant.</h3> ${englishAntiphon.ante}`;
					}
				}
				
				// Update post elements
				const postRow = document.querySelector(`.${hour}-antiphon-post`);
				if (postRow) {
					const columns = postRow.getElementsByTagName('td');
					if (columns.length === 2) {
						columns[0].innerHTML = `<h3>Ant.</h3> ${latinAntiphon.post}`;
						columns[1].innerHTML = `<h3>Ant.</h3> ${englishAntiphon.post}`;
					}
				}
			}
		});

		// Handle canticles
		if (DOM.psalmRows.magnificat) {
			updateCanticleContent(DOM.psalmRows.magnificat);
		}
		if (DOM.psalmRows.nuncDimittis) {
			updateCanticleContent(DOM.psalmRows.nuncDimittis);
		}
		if (DOM.psalmRows.benedictus) {
			updateCanticleContent(DOM.psalmRows.benedictus);
		}

	} catch (error) {
		console.error('Error loading psalms:', error);
	}
}

function updatePsalmContent(row, psalmData, skipGloria = false) {
	if (!row) return;

	const columns = row.getElementsByTagName('td');
	if (columns.length !== 2) return;

	const defaultContent = '<h2>Content Unavailable</h2>';

	let column1Content = (psalmData && psalmData.column1) || defaultContent;
	let column2Content = (psalmData && psalmData.column2) || defaultContent;

	// Get the hour name from the row's class
	const hourClass = row.className;
	const hour = hourClass.split('-')[0]; // Gets 'matins', 'lauds', etc.

	// Check if Gloria should be disabled via cookie
	const isGloriaDisabled = getCookie(`${hour}-gloria-disable`) === 'true';

	// Only append Gloria if we shouldn't skip it and it's not disabled
	if (!skipGloria && !isGloriaDisabled) {
		column1Content = appendGloria(column1Content, true);
		column2Content = appendGloria(column2Content, false);
	}

	columns[0].innerHTML = column1Content;
	columns[1].innerHTML = column2Content;
}

function updateCanticleContent(row) {
	if (!row) return;

	const columns = row.getElementsByTagName('td');
	if (columns.length !== 2) return;

	// Get the canticle type from the row's class
	const canticleClass = row.className;
	const isGloriaDisabled = getCookie(`${canticleClass}-gloria-disable`) === 'true';

	// Get the existing content
	let column1Content = columns[0].innerHTML;
	let column2Content = columns[1].innerHTML;

	// Remove any existing Gloria Patri before adding a new one
	column1Content = column1Content.replace(gloriaPatri.latin, '');
	column2Content = column2Content.replace(gloriaPatri.english, '');

	// Add Gloria only if not disabled
	if (!isGloriaDisabled) {
		column1Content = appendGloria(column1Content, true);
		column2Content = appendGloria(column2Content, false);
	}

	columns[0].innerHTML = column1Content;
	columns[1].innerHTML = column2Content;
}

// Add these control functions
function disableGloriaPatri(elementId) {
	setCookie(`${elementId}-gloria-disable`, 'true', 365);
	loadPsalmsForDate(DOM.datePicker.value);
}

function enableGloriaPatri(elementId) {
	setCookie(`${elementId}-gloria-disable`, 'false', 365);
	loadPsalmsForDate(DOM.datePicker.value);
}

function setGloriaPatriState(elementId, enabled) {
	setCookie(`${elementId}-gloria-disable`, (!enabled).toString(), 365);
	loadPsalmsForDate(DOM.datePicker.value);
}

// Helper function to check Gloria Patri state
function isGloriaPatriDisabled(elementId) {
	return getCookie(`${elementId}-gloria-disable`) === 'true';
}

// Examples of usage:
// disableGloriaPatri('matins');  // Disable Gloria Patri for matins
// enableGloriaPatri('benedictus');  // Enable Gloria Patri for benedictus
// setGloriaPatriState('lauds', true);  // Disable Gloria Patri for lauds

// Navigation functions
function openNav() {
	if (DOM.sidebar) {
		DOM.sidebar.style.width = '30%';
		DOM.sidebar.style.border = '2px solid rgba(255, 255, 255, 0.5)';
	}
}

function closeNav() {
	if (DOM.sidebar) {
		DOM.sidebar.style.width = '0';
		DOM.sidebar.style.border = 'none';
	}
}

// Scroll handling for navbar
function handleScroll() {
	const navbar = DOM.navbar;
	if (!navbar) return;

	if (window.scrollY > 50) {
		navbar.classList.add('navbar-scrolled');
	} else {
		navbar.classList.remove('navbar-scrolled');
	}
}

// Font size management
function updateFontSize(size) {
	document.body.style.fontSize = `${size}px`;
	document.querySelectorAll('h2').forEach(h2 => {
		h2.style.fontSize = `${1.8 * size}px`;
	});
	document.querySelectorAll('h3').forEach(h3 => {
		h3.style.fontSize = `${size}px`;
	});
	document.querySelectorAll('h5').forEach(h5 => {
		h5.style.fontSize = `${0.85 * size}px`;
	});
	setCookie('fontSize', size, 365);
}

// Initialize date picker with current date
function initializeDatePicker() {
	if (DOM.datePicker) {
		const now = new Date();
		const today = now.toISOString().split('T')[0];
		DOM.datePicker.value = today;
		
		const psalmDate = new Date(now);
		psalmDate.setDate(psalmDate.getDate() - 1); // correct?
		// psalmDate.setDate(psalmDate.getDate() + 1);
		loadPsalmsForDate(psalmDate).catch(console.error);
	}
}

// Event Listeners
function setupEventListeners() {
	window.addEventListener('scroll', handleScroll);

	DOM.fontSizeSlider?.addEventListener('input', (e) => {
		const newSize = parseInt(e.target.value);
		if (!isNaN(newSize)) {
			updateFontSize(newSize);
		}
	});

	DOM.resetFontButton?.addEventListener('click', () => {
		if (DOM.fontSizeSlider) {
			DOM.fontSizeSlider.value = DEFAULT_FONT_SIZE.toString();
			updateFontSize(DEFAULT_FONT_SIZE);
		}
	});

	DOM.datePicker?.addEventListener('change', (e) => {
		const date = new Date(e.target.value);
		if (!isNaN(date.getTime())) {
			loadPsalmsForDate(date).catch(console.error);
		}
	});
}

// Initialize application
function initializeApp() {
	window.openNav = openNav;
	window.closeNav = closeNav;

	initializeDatePicker();
	setupEventListeners();
	handleScroll();

	const storedFontSize = getCookie('fontSize');
	if (storedFontSize && DOM.fontSizeSlider) {
		const fontSize = parseInt(storedFontSize);
		if (!isNaN(fontSize)) {
			DOM.fontSizeSlider.value = fontSize.toString();
			updateFontSize(fontSize);
		}
	}
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);