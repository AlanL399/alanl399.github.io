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
    setCookie("activeStylesheetVariable", stylesheet, 365);
}

// Initialize stylesheet from cookie
const storedStylesheet = getCookie("activeStylesheetVariable");
if (stylesheets.includes(storedStylesheet)) {
    setStylesheet(storedStylesheet);
    currentIndex = stylesheets.indexOf(storedStylesheet);
}


// DOM Elements
const DOM = {
    fontSizeSlider: document.getElementById('fontSizeSlider'),
    resetFontButton: document.getElementById('resetFontButton'),
    datePicker: document.getElementById('datePicker'),
    sidebar: document.getElementById('mySidebar'),
    openBtn: document.getElementById('openbtn'),
    navbar: document.getElementById('floating-navbar'),
    psalmRows: {
        one: document.querySelector('.matins-psalm-one'),
        two: document.querySelector('.matins-psalm-two'),
        three: document.querySelector('.matins-psalm-three')
    }
};

// Constants
const DEFAULT_FONT_SIZE = 18;
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

function updatePsalmContent(row, psalmData) {
    if (!row) return;

    const columns = row.getElementsByTagName('td');
    if (columns.length !== 2) return;

    const defaultContent = '<h2>Content Unavailable</h2>';
    
    columns[0].innerHTML = (psalmData && psalmData.column1) || defaultContent;
    columns[1].innerHTML = (psalmData && psalmData.column2) || defaultContent;
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

        Object.entries(DOM.psalmRows).forEach(([key, row]) => {
            const psalmKey = `matins-psalm-${key}`;
            if (dayData[psalmKey]) {
                updatePsalmContent(row, dayData[psalmKey]);
            }
        });
    } catch (error) {
        console.error('Error loading psalms:', error);
    }
}

// Initialize date picker with current date
function initializeDatePicker() {
    if (DOM.datePicker) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        DOM.datePicker.value = today;
        
        // Create a new date for psalm loading that's one day behind
        const psalmDate = new Date(now);
        psalmDate.setDate(psalmDate.getDate() - 1);
        loadPsalmsForDate(psalmDate).catch(console.error);
    }
}

toggleStylesheetButton.addEventListener("click", toggleStylesheet);

// Event Listeners
function setupEventListeners() {
    // Add scroll event listener for navbar
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