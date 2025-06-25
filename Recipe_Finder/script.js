// DOM Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");

// New DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const navTabs = document.querySelectorAll(".nav-tab");
const tabContents = document.querySelectorAll(".tab-content");
const favoritesContainer = document.getElementById("favorites-container");
const collectionsContainer = document.getElementById("collections-container");
const shoppingListContainer = document.getElementById(
  "shopping-list-container"
);
const favoriteBtn = document.getElementById("favorite-btn");
const randomRecipeBtn = document.getElementById("random-recipe-btn");
const ingredientSearchBtn = document.getElementById("ingredient-search-btn");
const nameSearchBtn = document.getElementById("name-search-btn");
const ingredientInput = document.getElementById("ingredient-input");
const ingredientSearchSubmit = document.getElementById(
  "ingredient-search-submit"
);
const ingredientSearchContainer = document.getElementById(
  "ingredient-search-container"
);
const categoryFilter = document.getElementById("category-filter");
const areaFilter = document.getElementById("area-filter");
const clearFiltersBtn = document.getElementById("clear-filters-btn");
const searchHistoryContainer = document.getElementById(
  "search-history-container"
);
const searchHistory = document.getElementById("search-history");
const clearHistoryBtn = document.getElementById("clear-history-btn");

// API URLs
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const SEARCH_URL = `${BASE_URL}search.php?s=`;
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;
const RANDOM_URL = `${BASE_URL}random.php`;
const CATEGORIES_URL = `${BASE_URL}categories.php`;
const AREAS_URL = `${BASE_URL}list.php?a=list`;
const FILTER_CATEGORY_URL = `${BASE_URL}filter.php?c=`;
const FILTER_AREA_URL = `${BASE_URL}filter.php?a=`;
const INGREDIENT_SEARCH_URL = `${BASE_URL}filter.php?i=`;

// Global State
let currentMeal = null;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let collections = JSON.parse(localStorage.getItem("collections")) || [];
let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
let searchHistoryData = JSON.parse(localStorage.getItem("searchHistory")) || [];
let ratings = JSON.parse(localStorage.getItem("ratings")) || {};
let currentSearchType = "name";
let timerInterval = null;
let timerSeconds = 0;

// Initialize App
document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  loadTheme();
  loadCategories();
  loadAreas();
  updateFavoritesDisplay();
  updateCollectionsDisplay();
  updateShoppingListDisplay();
  updateSearchHistoryDisplay();
  setupEventListeners();
}

function setupEventListeners() {
  // Original event listeners
  searchBtn.addEventListener("click", searchMeals);
  mealsContainer.addEventListener("click", handleMealClick);
  backBtn.addEventListener("click", () => mealDetails.classList.add("hidden"));
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchMeals();
  });

  // Theme toggle
  themeToggle.addEventListener("click", toggleTheme);

  // Navigation tabs
  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  // Search type toggle
  nameSearchBtn.addEventListener("click", () => switchSearchType("name"));
  ingredientSearchBtn.addEventListener("click", () =>
    switchSearchType("ingredients")
  );

  // Ingredient search
  ingredientSearchSubmit.addEventListener("click", searchByIngredients);
  ingredientInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchByIngredients();
  });

  // Random recipe
  randomRecipeBtn.addEventListener("click", getRandomRecipe);

  // Filters
  categoryFilter.addEventListener("change", applyFilters);
  areaFilter.addEventListener("change", applyFilters);
  clearFiltersBtn.addEventListener("click", clearFilters);

  // Search history
  clearHistoryBtn.addEventListener("click", clearSearchHistory);

  // Favorites
  document
    .getElementById("clear-favorites-btn")
    .addEventListener("click", clearAllFavorites);

  // Collections
  document
    .getElementById("create-collection-btn")
    .addEventListener("click", showCreateCollectionModal);
  document
    .getElementById("save-collection-btn")
    .addEventListener("click", saveCollection);
  document
    .getElementById("cancel-collection-btn")
    .addEventListener("click", hideCollectionModal);
  document
    .getElementById("close-collection-modal")
    .addEventListener("click", hideCollectionModal);

  // Shopping list
  document
    .getElementById("clear-shopping-list-btn")
    .addEventListener("click", clearShoppingList);
  document
    .getElementById("print-shopping-list-btn")
    .addEventListener("click", printShoppingList);

  // Recipe actions
  document
    .getElementById("add-to-collection-btn")
    .addEventListener("click", showAddToCollectionOptions);
  document
    .getElementById("share-recipe-btn")
    .addEventListener("click", showShareModal);
  document
    .getElementById("print-recipe-btn")
    .addEventListener("click", printRecipe);

  // Share modal
  document
    .getElementById("close-share-modal")
    .addEventListener("click", hideShareModal);
  document
    .getElementById("copy-link-btn")
    .addEventListener("click", copyRecipeLink);
  document.querySelectorAll(".share-btn[data-platform]").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      shareToSocialMedia(e.target.closest(".share-btn").dataset.platform)
    );
  });

  // Timer
  document
    .getElementById("start-timer-btn")
    .addEventListener("click", startTimer);
  document
    .getElementById("pause-timer-btn")
    .addEventListener("click", pauseTimer);
  document
    .getElementById("reset-timer-btn")
    .addEventListener("click", resetTimer);
  document
    .getElementById("close-timer-btn")
    .addEventListener("click", closeTimer);
}

async function searchMeals() {
  const searchTerm = searchInput.value.trim();

  // handled the edge case
  if (!searchTerm) {
    errorContainer.textContent = "Please enter a search term";
    errorContainer.classList.remove("hidden");
    return;
  }

  try {
    resultHeading.textContent = `Searching for "${searchTerm}"...`;
    mealsContainer.innerHTML = "";
    errorContainer.classList.add("hidden");

    // fetch meals from API
    // www.themealdb.com/api/json/v1/1/search.php?s=chicken
    const response = await fetch(`${SEARCH_URL}${searchTerm}`);
    const data = await response.json();

    if (data.meals === null) {
      // no meals found
      resultHeading.textContent = ``;
      mealsContainer.innerHTML = "";
      errorContainer.textContent = `No recipes found for "${searchTerm}". Try another search term!`;
      errorContainer.classList.remove("hidden");
    } else {
      resultHeading.textContent = `Search results for "${searchTerm}":`;
      displayMeals(data.meals);
      searchInput.value = "";
    }
  } catch (error) {
    errorContainer.textContent =
      "Something went wrong. Please try again later.";
    errorContainer.classList.remove("hidden");
  }
}

// Theme Functions
function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i");
  icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

// Navigation Functions
function switchTab(tabName) {
  // Update active tab
  navTabs.forEach((tab) => tab.classList.remove("active"));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  // Update active content
  tabContents.forEach((content) => content.classList.add("hidden"));
  document.getElementById(`${tabName}-tab`).classList.remove("hidden");

  // Load content based on tab
  switch (tabName) {
    case "favorites":
      updateFavoritesDisplay();
      break;
    case "collections":
      updateCollectionsDisplay();
      break;
    case "shopping-list":
      updateShoppingListDisplay();
      break;
  }
}

// Search Functions
function switchSearchType(type) {
  currentSearchType = type;
  nameSearchBtn.classList.toggle("active", type === "name");
  ingredientSearchBtn.classList.toggle("active", type === "ingredients");

  if (type === "ingredients") {
    ingredientSearchContainer.classList.remove("hidden");
    document.querySelector(".search-container").style.display = "none";
  } else {
    ingredientSearchContainer.classList.add("hidden");
    document.querySelector(".search-container").style.display = "flex";
  }
}

async function searchByIngredients() {
  const ingredients = ingredientInput.value.trim();

  if (!ingredients) {
    showError("Please enter at least one ingredient");
    return;
  }

  try {
    resultHeading.textContent = `Searching recipes with ingredients: "${ingredients}"...`;
    mealsContainer.innerHTML = "";
    hideError();

    // Add to search history
    addToSearchHistory(`Ingredients: ${ingredients}`);

    // Use the first ingredient for the API call (TheMealDB limitation)
    const firstIngredient = ingredients.split(",")[0].trim();
    const response = await fetch(`${INGREDIENT_SEARCH_URL}${firstIngredient}`);
    const data = await response.json();

    if (data.meals === null) {
      resultHeading.textContent = ``;
      mealsContainer.innerHTML = "";
      showError(
        `No recipes found with "${ingredients}". Try different ingredients!`
      );
    } else {
      resultHeading.textContent = `Recipes with "${ingredients}":`;
      displayMeals(data.meals);
      ingredientInput.value = "";
    }
  } catch (error) {
    showError("Something went wrong. Please try again later.");
  }
}

async function getRandomRecipe() {
  try {
    resultHeading.textContent = "Getting a surprise recipe for you...";
    mealsContainer.innerHTML = "";
    hideError();

    const response = await fetch(RANDOM_URL);
    const data = await response.json();

    if (data.meals && data.meals[0]) {
      resultHeading.textContent = "Surprise Recipe:";
      displayMeals(data.meals);
    } else {
      showError("Could not get a random recipe. Please try again.");
    }
  } catch (error) {
    showError("Something went wrong. Please try again later.");
  }
}

// Error handling functions
function showError(message) {
  errorContainer.textContent = message;
  errorContainer.classList.remove("hidden");
}

function hideError() {
  errorContainer.classList.add("hidden");
}

// Update the original searchMeals to use new error functions
async function searchMealsUpdated() {
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    showError("Please enter a search term");
    return;
  }

  try {
    resultHeading.textContent = `Searching for "${searchTerm}"...`;
    mealsContainer.innerHTML = "";
    hideError();

    // Add to search history
    addToSearchHistory(searchTerm);

    const response = await fetch(`${SEARCH_URL}${searchTerm}`);
    const data = await response.json();

    if (data.meals === null) {
      resultHeading.textContent = ``;
      mealsContainer.innerHTML = "";
      showError(
        `No recipes found for "${searchTerm}". Try another search term!`
      );
    } else {
      resultHeading.textContent = `Search results for "${searchTerm}":`;
      displayMeals(data.meals);
      searchInput.value = "";
    }
  } catch (error) {
    showError("Something went wrong. Please try again later.");
  }
}

function displayMeals(meals) {
  mealsContainer.innerHTML = "";

  // loop through meals and create a card for each meal
  meals.forEach((meal) => {
    mealsContainer.innerHTML += `
      <div class="meal" data-meal-id="${meal.idMeal}">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="meal-info">
          <h3 class="meal-title">${meal.strMeal}</h3>
          ${
            meal.strCategory
              ? `<div class="meal-category">${meal.strCategory}</div>`
              : ""
          }
        </div>
      </div>
    `;
  });
}

async function handleMealClick(e) {
  const mealEl = e.target.closest(".meal");
  if (!mealEl) return;

  const mealId = mealEl.getAttribute("data-meal-id");

  try {
    const response = await fetch(`${LOOKUP_URL}${mealId}`);
    const data = await response.json();

    if (data.meals && data.meals[0]) {
      const meal = data.meals[0];
      currentMeal = meal; // Store current meal for other functions

      const ingredients = [];

      for (let i = 1; i <= 20; i++) {
        if (
          meal[`strIngredient${i}`] &&
          meal[`strIngredient${i}`].trim() !== ""
        ) {
          ingredients.push({
            ingredient: meal[`strIngredient${i}`],
            measure: meal[`strMeasure${i}`],
          });
        }
      }

      // Get current rating
      const currentRating = getRating(meal.idMeal);

      // display meal details
      mealDetailsContent.innerHTML = `
           <img src="${meal.strMealThumb}" alt="${
        meal.strMeal
      }" class="meal-details-img">
           <h2 class="meal-details-title">${meal.strMeal}</h2>
           <div class="meal-details-category">
             <span>${meal.strCategory || "Uncategorized"}</span>
           </div>

           <div class="meal-rating">
             <h3>Rate this recipe:</h3>
             <div class="rating-container" id="rating-${meal.idMeal}"></div>
           </div>

           <div class="meal-details-instructions">
             <h3>Instructions</h3>
             <p>${meal.strInstructions}</p>
           </div>
           <div class="meal-details-ingredients">
             <h3>Ingredients</h3>
             <ul class="ingredients-list">
               ${ingredients
                 .map(
                   (item) => `
                 <li><i class="fas fa-check-circle"></i> ${item.measure} ${item.ingredient}</li>
               `
                 )
                 .join("")}
             </ul>
             <button onclick="addToShoppingList(${JSON.stringify(
               ingredients
             ).replace(/"/g, "&quot;")})" class="action-btn shopping-btn">
               <i class="fas fa-cart-plus"></i> Add to Shopping List
             </button>
           </div>

           <div class="meal-actions">
             <button onclick="document.getElementById('cooking-timer').classList.remove('hidden')" class="action-btn timer-btn">
               <i class="fas fa-clock"></i> Start Timer
             </button>
           </div>

           ${
             meal.strYoutube
               ? `
             <a href="${meal.strYoutube}" target="_blank" class="youtube-link">
               <i class="fab fa-youtube"></i> Watch Video
             </a>
           `
               : ""
           }
         `;

      // Add rating stars
      const ratingContainer = document.getElementById(`rating-${meal.idMeal}`);
      const ratingStars = createRatingStars(meal.idMeal, currentRating);
      ratingContainer.appendChild(ratingStars);

      // Update favorite button
      updateFavoriteButton(meal);

      // Set up favorite button click handler
      favoriteBtn.onclick = () => toggleFavorite(meal);

      mealDetails.classList.remove("hidden");
      mealDetails.scrollIntoView({ behavior: "smooth" });
    }
  } catch (error) {
    showError("Could not load recipe details. Please try again later.");
  }
}

// Fix the original searchMeals function to use new error handling
async function searchMeals() {
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    showError("Please enter a search term");
    return;
  }

  try {
    resultHeading.textContent = `Searching for "${searchTerm}"...`;
    mealsContainer.innerHTML = "";
    hideError();

    // Add to search history
    addToSearchHistory(searchTerm);

    const response = await fetch(`${SEARCH_URL}${searchTerm}`);
    const data = await response.json();

    if (data.meals === null) {
      resultHeading.textContent = ``;
      mealsContainer.innerHTML = "";
      showError(
        `No recipes found for "${searchTerm}". Try another search term!`
      );
    } else {
      resultHeading.textContent = `Search results for "${searchTerm}":`;
      displayMeals(data.meals);
      searchInput.value = "";
    }
  } catch (error) {
    showError("Something went wrong. Please try again later.");
  }
}

// Filter Functions
async function loadCategories() {
  try {
    const response = await fetch(CATEGORIES_URL);
    const data = await response.json();

    if (data.categories) {
      data.categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.strCategory;
        option.textContent = category.strCategory;
        categoryFilter.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

async function loadAreas() {
  try {
    const response = await fetch(AREAS_URL);
    const data = await response.json();

    if (data.meals) {
      data.meals.forEach((area) => {
        const option = document.createElement("option");
        option.value = area.strArea;
        option.textContent = area.strArea;
        areaFilter.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error loading areas:", error);
  }
}

async function applyFilters() {
  const category = categoryFilter.value;
  const area = areaFilter.value;

  if (!category && !area) return;

  try {
    resultHeading.textContent = "Filtering recipes...";
    mealsContainer.innerHTML = "";
    hideError();

    let url = "";
    let filterText = "";

    if (category && area) {
      // If both filters are selected, prioritize category
      url = `${FILTER_CATEGORY_URL}${category}`;
      filterText = `Category: ${category}`;
    } else if (category) {
      url = `${FILTER_CATEGORY_URL}${category}`;
      filterText = `Category: ${category}`;
    } else if (area) {
      url = `${FILTER_AREA_URL}${area}`;
      filterText = `Area: ${area}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.meals === null) {
      resultHeading.textContent = ``;
      mealsContainer.innerHTML = "";
      showError(`No recipes found for ${filterText}.`);
    } else {
      resultHeading.textContent = `Recipes filtered by ${filterText}:`;
      displayMeals(data.meals);
    }
  } catch (error) {
    showError("Something went wrong while filtering. Please try again later.");
  }
}

function clearFilters() {
  categoryFilter.value = "";
  areaFilter.value = "";
  resultHeading.textContent = "";
  mealsContainer.innerHTML = "";
  hideError();
}

// Search History Functions
function addToSearchHistory(searchTerm) {
  // Remove if already exists
  searchHistoryData = searchHistoryData.filter((item) => item !== searchTerm);

  // Add to beginning
  searchHistoryData.unshift(searchTerm);

  // Keep only last 10 searches
  if (searchHistoryData.length > 10) {
    searchHistoryData = searchHistoryData.slice(0, 10);
  }

  localStorage.setItem("searchHistory", JSON.stringify(searchHistoryData));
  updateSearchHistoryDisplay();
}

function updateSearchHistoryDisplay() {
  if (searchHistoryData.length === 0) {
    searchHistoryContainer.classList.add("hidden");
    return;
  }

  searchHistoryContainer.classList.remove("hidden");
  searchHistory.innerHTML = "";

  searchHistoryData.forEach((term) => {
    const historyItem = document.createElement("button");
    historyItem.className = "history-item";
    historyItem.textContent = term;
    historyItem.addEventListener("click", () => {
      if (term.startsWith("Ingredients:")) {
        switchSearchType("ingredients");
        ingredientInput.value = term.replace("Ingredients: ", "");
        searchByIngredients();
      } else {
        switchSearchType("name");
        searchInput.value = term;
        searchMeals();
      }
    });
    searchHistory.appendChild(historyItem);
  });
}

function clearSearchHistory() {
  searchHistoryData = [];
  localStorage.removeItem("searchHistory");
  updateSearchHistoryDisplay();
}

// Favorites Functions
function toggleFavorite(meal) {
  const existingIndex = favorites.findIndex(
    (fav) => fav.idMeal === meal.idMeal
  );

  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
    showNotification("Removed from favorites");
  } else {
    favorites.push(meal);
    showNotification("Added to favorites");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoriteButton(meal);
  updateFavoritesDisplay();
}

function updateFavoriteButton(meal) {
  if (!favoriteBtn) return;

  const isFavorite = favorites.some((fav) => fav.idMeal === meal.idMeal);
  const icon = favoriteBtn.querySelector("i");

  if (isFavorite) {
    icon.className = "fas fa-heart";
    favoriteBtn.innerHTML =
      '<i class="fas fa-heart"></i> Remove from Favorites';
  } else {
    icon.className = "far fa-heart";
    favoriteBtn.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
  }
}

function updateFavoritesDisplay() {
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "";
    document.getElementById("no-favorites").classList.remove("hidden");
    return;
  }

  document.getElementById("no-favorites").classList.add("hidden");
  favoritesContainer.innerHTML = "";

  favorites.forEach((meal) => {
    const mealCard = createMealCard(meal, true);
    favoritesContainer.appendChild(mealCard);
  });
}

function clearAllFavorites() {
  if (confirm("Are you sure you want to clear all favorites?")) {
    favorites = [];
    localStorage.removeItem("favorites");
    updateFavoritesDisplay();
    showNotification("All favorites cleared");
  }
}

// Collections Functions
function showCreateCollectionModal() {
  document.getElementById("collection-modal-title").textContent =
    "Create New Collection";
  document.getElementById("collection-name-input").value = "";
  document.getElementById("collection-description-input").value = "";
  document.getElementById("collection-modal").classList.remove("hidden");
}

function hideCollectionModal() {
  document.getElementById("collection-modal").classList.add("hidden");
}

function saveCollection() {
  const name = document.getElementById("collection-name-input").value.trim();
  const description = document
    .getElementById("collection-description-input")
    .value.trim();

  if (!name) {
    alert("Please enter a collection name");
    return;
  }

  const newCollection = {
    id: Date.now().toString(),
    name,
    description,
    recipes: [],
    createdAt: new Date().toISOString(),
  };

  collections.push(newCollection);
  localStorage.setItem("collections", JSON.stringify(collections));
  updateCollectionsDisplay();
  hideCollectionModal();
  showNotification("Collection created successfully");
}

function updateCollectionsDisplay() {
  if (collections.length === 0) {
    collectionsContainer.innerHTML = "";
    document.getElementById("no-collections").classList.remove("hidden");
    return;
  }

  document.getElementById("no-collections").classList.add("hidden");
  collectionsContainer.innerHTML = "";

  collections.forEach((collection) => {
    const collectionCard = document.createElement("div");
    collectionCard.className = "collection-card";
    collectionCard.innerHTML = `
      <div class="collection-header">
        <h3>${collection.name}</h3>
        <div class="collection-actions">
          <button onclick="viewCollection('${
            collection.id
          }')" class="action-btn small">
            <i class="fas fa-eye"></i> View
          </button>
          <button onclick="deleteCollection('${
            collection.id
          }')" class="action-btn small danger">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
      <p class="collection-description">${
        collection.description || "No description"
      }</p>
      <div class="collection-stats">
        <span><i class="fas fa-utensils"></i> ${
          collection.recipes.length
        } recipes</span>
        <span><i class="fas fa-calendar"></i> ${new Date(
          collection.createdAt
        ).toLocaleDateString()}</span>
      </div>
    `;
    collectionsContainer.appendChild(collectionCard);
  });
}

function showAddToCollectionOptions() {
  if (!currentMeal) return;

  if (collections.length === 0) {
    alert("No collections available. Create a collection first!");
    return;
  }

  const options = collections
    .map(
      (collection) =>
        `<option value="${collection.id}">${collection.name}</option>`
    )
    .join("");

  const select = document.createElement("select");
  select.innerHTML = `<option value="">Select a collection...</option>${options}`;
  select.style.margin = "10px 0";

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Add to Collection</h3>
        <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
      </div>
      <div class="modal-body">
        ${select.outerHTML}
      </div>
      <div class="modal-footer">
        <button onclick="addToSelectedCollection(this)" class="action-btn">Add</button>
        <button onclick="this.closest('.modal').remove()" class="action-btn secondary">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function addToSelectedCollection(button) {
  const modal = button.closest(".modal");
  const select = modal.querySelector("select");
  const collectionId = select.value;

  if (!collectionId) {
    alert("Please select a collection");
    return;
  }

  const collection = collections.find((c) => c.id === collectionId);
  if (!collection) return;

  // Check if recipe already exists in collection
  if (
    collection.recipes.some((recipe) => recipe.idMeal === currentMeal.idMeal)
  ) {
    alert("Recipe already exists in this collection");
    return;
  }

  collection.recipes.push(currentMeal);
  localStorage.setItem("collections", JSON.stringify(collections));
  updateCollectionsDisplay();
  modal.remove();
  showNotification(`Added to ${collection.name}`);
}

function viewCollection(collectionId) {
  const collection = collections.find((c) => c.id === collectionId);
  if (!collection) return;

  resultHeading.textContent = `Collection: ${collection.name}`;
  mealsContainer.innerHTML = "";

  if (collection.recipes.length === 0) {
    mealsContainer.innerHTML =
      '<p class="empty-message">No recipes in this collection yet.</p>';
    return;
  }

  collection.recipes.forEach((meal) => {
    const mealCard = createMealCard(meal, false);
    mealsContainer.appendChild(mealCard);
  });

  // Switch to search tab to show results
  switchTab("search");
}

function deleteCollection(collectionId) {
  if (confirm("Are you sure you want to delete this collection?")) {
    collections = collections.filter((c) => c.id !== collectionId);
    localStorage.setItem("collections", JSON.stringify(collections));
    updateCollectionsDisplay();
    showNotification("Collection deleted");
  }
}

// Shopping List Functions
function addToShoppingList(ingredients) {
  ingredients.forEach((ingredient) => {
    const existingItem = shoppingList.find(
      (item) =>
        item.ingredient.toLowerCase() === ingredient.ingredient.toLowerCase()
    );

    if (!existingItem) {
      shoppingList.push({
        id: Date.now() + Math.random(),
        ingredient: ingredient.ingredient,
        measure: ingredient.measure,
        checked: false,
      });
    }
  });

  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  updateShoppingListDisplay();
  showNotification("Ingredients added to shopping list");
}

function updateShoppingListDisplay() {
  if (shoppingList.length === 0) {
    shoppingListContainer.innerHTML = "";
    document.getElementById("no-shopping-items").classList.remove("hidden");
    return;
  }

  document.getElementById("no-shopping-items").classList.add("hidden");
  shoppingListContainer.innerHTML = "";

  shoppingList.forEach((item) => {
    const listItem = document.createElement("div");
    listItem.className = `shopping-item ${item.checked ? "checked" : ""}`;
    listItem.innerHTML = `
      <label class="shopping-item-label">
        <input type="checkbox" ${item.checked ? "checked" : ""}
               onchange="toggleShoppingItem('${item.id}')">
        <span class="shopping-item-text">${item.measure} ${
      item.ingredient
    }</span>
      </label>
      <button onclick="removeShoppingItem('${item.id}')" class="remove-btn">
        <i class="fas fa-times"></i>
      </button>
    `;
    shoppingListContainer.appendChild(listItem);
  });
}

function toggleShoppingItem(itemId) {
  const item = shoppingList.find((item) => item.id == itemId);
  if (item) {
    item.checked = !item.checked;
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    updateShoppingListDisplay();
  }
}

function removeShoppingItem(itemId) {
  shoppingList = shoppingList.filter((item) => item.id != itemId);
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  updateShoppingListDisplay();
}

function clearShoppingList() {
  if (confirm("Are you sure you want to clear the shopping list?")) {
    shoppingList = [];
    localStorage.removeItem("shoppingList");
    updateShoppingListDisplay();
    showNotification("Shopping list cleared");
  }
}

function printShoppingList() {
  if (shoppingList.length === 0) {
    alert("Shopping list is empty");
    return;
  }

  const printWindow = window.open("", "_blank");
  const printContent = `
    <html>
      <head>
        <title>Shopping List</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #ff7e5f; }
          .item { margin: 10px 0; padding: 5px; }
          .checked { text-decoration: line-through; opacity: 0.6; }
        </style>
      </head>
      <body>
        <h1>Shopping List</h1>
        <div>
          ${shoppingList
            .map(
              (item) =>
                `<div class="item ${item.checked ? "checked" : ""}">${
                  item.measure
                } ${item.ingredient}</div>`
            )
            .join("")}
        </div>
        <p><em>Generated on ${new Date().toLocaleDateString()}</em></p>
      </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
}

// Share and Print Functions
function showShareModal() {
  if (!currentMeal) return;

  const shareUrl = `${window.location.origin}${window.location.pathname}?recipe=${currentMeal.idMeal}`;
  document.getElementById("share-url").value = shareUrl;
  document.getElementById("share-modal").classList.remove("hidden");
}

function hideShareModal() {
  document.getElementById("share-modal").classList.add("hidden");
}

function shareToSocialMedia(platform) {
  if (!currentMeal) return;

  const recipeTitle = currentMeal.strMeal;
  const shareUrl = `${window.location.origin}${window.location.pathname}?recipe=${currentMeal.idMeal}`;
  const shareText = `Check out this delicious recipe: ${recipeTitle}`;

  let url = "";
  switch (platform) {
    case "facebook":
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`;
      break;
    case "twitter":
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`;
      break;
    case "whatsapp":
      url = `https://wa.me/?text=${encodeURIComponent(
        shareText + " " + shareUrl
      )}`;
      break;
  }

  if (url) {
    window.open(url, "_blank", "width=600,height=400");
  }
}

function copyRecipeLink() {
  const shareUrl = document.getElementById("share-url");
  shareUrl.select();
  shareUrl.setSelectionRange(0, 99999);

  try {
    document.execCommand("copy");
    showNotification("Link copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy link:", err);
    showNotification("Failed to copy link");
  }
}

function printRecipe() {
  if (!currentMeal) return;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (
      currentMeal[`strIngredient${i}`] &&
      currentMeal[`strIngredient${i}`].trim() !== ""
    ) {
      ingredients.push({
        ingredient: currentMeal[`strIngredient${i}`],
        measure: currentMeal[`strMeasure${i}`],
      });
    }
  }

  const printWindow = window.open("", "_blank");
  const printContent = `
    <html>
      <head>
        <title>${currentMeal.strMeal} - Recipe</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
          h1 { color: #ff7e5f; border-bottom: 2px solid #ff7e5f; padding-bottom: 10px; }
          h2 { color: #333; margin-top: 30px; }
          .recipe-image { max-width: 300px; border-radius: 8px; margin: 20px 0; }
          .ingredients { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
          .ingredient { padding: 5px; background: #f8f9fa; border-radius: 4px; }
          .instructions { margin-top: 20px; }
          .category { background: #ff7e5f; color: white; padding: 5px 10px; border-radius: 20px; display: inline-block; margin: 10px 0; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1>${currentMeal.strMeal}</h1>
        <img src="${currentMeal.strMealThumb}" alt="${
    currentMeal.strMeal
  }" class="recipe-image">
        <div class="category">${
          currentMeal.strCategory || "Uncategorized"
        }</div>

        <h2>Ingredients</h2>
        <div class="ingredients">
          ${ingredients
            .map(
              (item) =>
                `<div class="ingredient">${item.measure} ${item.ingredient}</div>`
            )
            .join("")}
        </div>

        <h2>Instructions</h2>
        <div class="instructions">
          ${currentMeal.strInstructions.replace(/\n/g, "<br>")}
        </div>

        <p><em>Recipe from Recipe Finder App - Generated on ${new Date().toLocaleDateString()}</em></p>
      </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
}

// Timer Functions
function startTimer() {
  const minutes = parseInt(document.getElementById("timer-input").value);
  if (!minutes || minutes <= 0) {
    alert("Please enter a valid number of minutes");
    return;
  }

  timerSeconds = minutes * 60;
  document.getElementById("cooking-timer").classList.remove("hidden");
  document.getElementById("start-timer-btn").classList.add("hidden");
  document.getElementById("pause-timer-btn").classList.remove("hidden");

  timerInterval = setInterval(() => {
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      alert("Timer finished! Your cooking time is up!");
      resetTimer();
      return;
    }

    timerSeconds--;
    updateTimerDisplay();
  }, 1000);

  updateTimerDisplay();
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById("start-timer-btn").classList.remove("hidden");
    document.getElementById("pause-timer-btn").classList.add("hidden");
    document.getElementById("start-timer-btn").textContent = "Resume";
  }
}

function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  timerSeconds = 0;
  updateTimerDisplay();
  document.getElementById("start-timer-btn").classList.remove("hidden");
  document.getElementById("pause-timer-btn").classList.add("hidden");
  document.getElementById("start-timer-btn").textContent = "Start";
  document.getElementById("timer-input").value = "";
}

function closeTimer() {
  resetTimer();
  document.getElementById("cooking-timer").classList.add("hidden");
}

function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  document.getElementById("timer-minutes").textContent = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("timer-seconds").textContent = seconds
    .toString()
    .padStart(2, "0");
}

// Utility Functions
function createMealCard(meal, showRemoveButton = false) {
  const mealCard = document.createElement("div");
  mealCard.className = "meal";
  mealCard.setAttribute("data-meal-id", meal.idMeal);

  mealCard.innerHTML = `
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <div class="meal-info">
      <h3 class="meal-title">${meal.strMeal}</h3>
      ${
        meal.strCategory
          ? `<div class="meal-category">${meal.strCategory}</div>`
          : ""
      }
      ${
        showRemoveButton
          ? `
        <button onclick="removeFromFavorites('${meal.idMeal}')" class="remove-favorite-btn">
          <i class="fas fa-heart-broken"></i> Remove
        </button>
      `
          : ""
      }
    </div>
  `;

  return mealCard;
}

function removeFromFavorites(mealId) {
  favorites = favorites.filter((fav) => fav.idMeal !== mealId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesDisplay();
  showNotification("Removed from favorites");
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  // Add to page
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add("show"), 100);

  // Hide and remove notification
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Rating Functions
function addRatingToMeal(mealId, rating) {
  ratings[mealId] = rating;
  localStorage.setItem("ratings", JSON.stringify(ratings));
}

function getRating(mealId) {
  return ratings[mealId] || 0;
}

function createRatingStars(mealId, currentRating = 0) {
  const starsContainer = document.createElement("div");
  starsContainer.className = "rating-stars";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = `star ${i <= currentRating ? "filled" : ""}`;
    star.innerHTML = "★";
    star.addEventListener("click", () => {
      addRatingToMeal(mealId, i);
      updateStarDisplay(starsContainer, i);
      showNotification(`Rated ${i} star${i > 1 ? "s" : ""}`);
    });
    starsContainer.appendChild(star);
  }

  return starsContainer;
}

function updateStarDisplay(container, rating) {
  const stars = container.querySelectorAll(".star");
  stars.forEach((star, index) => {
    star.classList.toggle("filled", index < rating);
  });
}
