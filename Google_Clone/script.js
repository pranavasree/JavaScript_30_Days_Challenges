// DOM Elements
const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector(".search-form");
const googleSearchBtn = document.querySelector(".google-search-btn");
const luckySearchBtn = document.querySelector(".lucky-search-btn");
const voiceSearchBtn = document.querySelector('[aria-label="Search by voice"]');
const imageSearchBtn = document.querySelector('[aria-label="Search by image"]');

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  focusSearchInput();
});

// Event Listeners
function initializeEventListeners() {
  // Form submission
  searchForm.addEventListener("submit", handleFormSubmit);

  // Button clicks
  googleSearchBtn.addEventListener("click", handleGoogleSearch);
  luckySearchBtn.addEventListener("click", handleLuckySearch);

  // Voice and image search (placeholder functionality)
  voiceSearchBtn.addEventListener("click", handleVoiceSearch);
  imageSearchBtn.addEventListener("click", handleImageSearch);

  // Input focus effects
  searchInput.addEventListener("focus", handleInputFocus);
  searchInput.addEventListener("blur", handleInputBlur);
}

// Search Functions
function handleFormSubmit(event) {
  event.preventDefault();
  performGoogleSearch();
}

function handleGoogleSearch(event) {
  event.preventDefault();
  performGoogleSearch();
}

function handleLuckySearch(event) {
  event.preventDefault();
  performLuckySearch();
}

function performGoogleSearch() {
  const query = searchInput.value.trim();

  if (query) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}`;
    window.open(searchUrl, "_blank");
  } else {
    searchInput.focus();
  }
}

function performLuckySearch() {
  const query = searchInput.value.trim();

  if (query) {
    const luckyUrl = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}&btnI=1`;
    window.open(luckyUrl, "_blank");
  } else {
    searchInput.focus();
  }
}

// Placeholder functions for voice and image search
function handleVoiceSearch() {
  alert("Voice search functionality would be implemented here");
}

function handleImageSearch() {
  alert("Image search functionality would be implemented here");
}

// UI Enhancement Functions
function handleInputFocus() {
  searchInput.parentElement.classList.add("focused");
}

function handleInputBlur() {
  searchInput.parentElement.classList.remove("focused");
}

function focusSearchInput() {
  // Auto-focus search input when page loads
  setTimeout(() => {
    searchInput.focus();
  }, 100);
}

// Keyboard shortcuts
document.addEventListener("keydown", function (event) {
  // Focus search input when user starts typing (if not already focused)
  if (event.key.length === 1 && document.activeElement !== searchInput) {
    searchInput.focus();
  }

  // Clear search with Escape key
  if (event.key === "Escape") {
    searchInput.value = "";
    searchInput.focus();
  }
});
