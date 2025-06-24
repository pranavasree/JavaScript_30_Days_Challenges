// DOM Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");
const categoryFilter = document.getElementById("category-filter");
const favoritesSection = document.getElementById("favorites-section");
const favoritesContainer = document.getElementById("favorites-container");
const cartSection = document.getElementById("cart-section");
const cartContainer = document.getElementById("cart-container");
const clearCart = document.getElementById("clear-cart");
const shoppingListSection = document.getElementById("shopping-list-section");
const shoppingList = document.getElementById("shopping-list");
const clearShoppingList = document.getElementById("clear-shopping-list");

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const SEARCH_URL = `${BASE_URL}search.php?s=`;
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;
const FILTER_URL = `${BASE_URL}filter.php?c=`;
const CATEGORIES_URL = `${BASE_URL}categories.php`;

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
let shoppingListItems = JSON.parse(localStorage.getItem("shoppingList")) || [];

searchBtn.addEventListener("click", searchMeals);
mealsContainer.addEventListener("click", handleMealClick);
backBtn.addEventListener("click", () => mealDetails.classList.add("hidden"));
categoryFilter.addEventListener("change", filterByCategory);
clearCart.addEventListener("click", clearCartHandler);
clearShoppingList.addEventListener("click", clearShoppingListHandler);

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchMeals();
});

// Service Worker for Offline Mode
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("Service Worker registered");
  });
}

async function loadCategories() {
  try {
    const response = await fetch(CATEGORIES_URL);
    const data = await response.json();
    console.log("Categories data:", data);
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

async function searchMeals() {
  const searchTerm = searchInput.value.trim();
  const category = categoryFilter.value;

  if (!searchTerm && !category) {
    errorContainer.textContent =
      "Please enter a search term or select a category";
    errorContainer.classList.remove("hidden");
    return;
  }

  try {
    resultHeading.textContent = `Searching for "${searchTerm || category}"...`;
    mealsContainer.innerHTML = "";
    errorContainer.classList.add("hidden");

    const url = category
      ? `${FILTER_URL}${encodeURIComponent(category)}`
      : `${SEARCH_URL}${encodeURIComponent(searchTerm)}`;
    console.log("API URL:", url);
    const response = await fetch(url);
    const data = await response.json();
    console.log("API Response:", data);

    if (!data.meals || data.meals.length === 0) {
      resultHeading.textContent = "";
      mealsContainer.innerHTML = "";
      errorContainer.textContent = `No recipes found for "${
        searchTerm || category
      }". Try another search term or category!`;
      errorContainer.classList.remove("hidden");
    } else {
      resultHeading.textContent = `Search results for "${
        searchTerm || category
      }":`;
      displayMeals(data.meals);
      searchInput.value = "";
      categoryFilter.value = ""; // Reset category filter after search
    }
  } catch (error) {
    errorContainer.textContent =
      "Something went wrong. Please try again later.";
    errorContainer.classList.remove("hidden");
    console.error("Search error:", error);
  }
}

function displayMeals(meals) {
  mealsContainer.innerHTML = "";
  meals.forEach((meal) => {
    const isFavorite = favorites.includes(meal.idMeal);
    const isInCart = cartItems.includes(meal.idMeal);
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
                <button class="favorite-btn" data-meal-id="${meal.idMeal}">
                    ${
                      isFavorite
                        ? '<i class="fas fa-heart"></i>'
                        : '<i class="far fa-heart"></i>'
                    }
                </button>
                <button class="add-to-cart-btn" data-meal-id="${meal.idMeal}">
                    ${
                      isInCart
                        ? '<i class="fas fa-shopping-cart"></i>'
                        : '<i class="far fa-shopping-cart"></i>'
                    }
                </button>
            </div>
        `;
  });
  updateFavoritesDisplay();
  updateCartDisplay();
}

async function handleMealClick(e) {
  const mealEl = e.target.closest(".meal");
  if (mealEl) {
    const mealId = mealEl.getAttribute("data-meal-id");
    try {
      const response = await fetch(`${LOOKUP_URL}${mealId}`);
      const data = await response.json();

      if (data.meals && data.meals[0]) {
        const meal = data.meals[0];
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          if (
            meal[`strIngredient${i}`] &&
            meal[`strIngredient${i}`].trim() !== ""
          ) {
            ingredients.push({
              ingredient: meal[`strIngredient${i}`],
              measure: meal[`strMeasure${i}`] || "",
            });
          }
        }

        // Nutrition (simplified estimate)
        const calories = ingredients.length * 50; // Rough estimate
        const protein = ingredients.length * 2; // Rough estimate

        mealDetailsContent.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${
          meal.strMeal
        }" class="meal-details-img">
                    <h2 class="meal-details-title">${meal.strMeal}</h2>
                    <div class="meal-details-category">
                        <span>${meal.strCategory || "Uncategorized"}</span>
                    </div>
                    <div class="meal-details-instructions">
                        <h3>Instructions</h3>
                        <p>${meal.strInstructions}</p>
                    </div>
                    <div class="meal-details-nutrition">
                        <h3>Nutrition (Estimated)</h3>
                        <p>Calories: ${calories} kcal | Protein: ${protein}g</p>
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
                    <div class="rating">
                        <input type="radio" id="star5" name="rating-${mealId}" value="5">
                        <label for="star5" title="5 stars"><i class="fas fa-star"></i></label>
                        <input type="radio" id="star4" name="rating-${mealId}" value="4">
                        <label for="star4" title="4 stars"><i class="fas fa-star"></i></label>
                        <input type="radio" id="star3" name="rating-${mealId}" value="3">
                        <label for="star3" title="3 stars"><i class="fas fa-star"></i></label>
                        <input type="radio" id="star2" name="rating-${mealId}" value="2">
                        <label for="star2" title="2 stars"><i class="fas fa-star"></i></label>
                        <input type="radio" id="star1" name="rating-${mealId}" value="1">
                        <label for="star1" title="1 star"><i class="fas fa-star"></i></label>
                    </div>
                    <button class="add-to-shopping-list" data-meal-id="${mealId}">Add to Shopping List</button>
                `;

        const ratingInputs = mealDetailsContent.querySelectorAll(
          `input[name="rating-${mealId}"]`
        );
        ratingInputs.forEach((input) => {
          input.addEventListener("change", () =>
            saveRating(mealId, input.value)
          );
        });

        const addToShoppingListBtn = mealDetailsContent.querySelector(
          ".add-to-shopping-list"
        );
        addToShoppingListBtn.addEventListener("click", () =>
          addToShoppingList(mealId)
        );

        mealDetails.classList.remove("hidden");
        mealDetails.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      errorContainer.textContent =
        "Could not load recipe details. Please try again later.";
      errorContainer.classList.remove("hidden");
    }
  } else if (e.target.classList.contains("favorite-btn")) {
    const mealId = e.target.getAttribute("data-meal-id");
    toggleFavorite(mealId);
  } else if (e.target.classList.contains("add-to-cart-btn")) {
    const mealId = e.target.getAttribute("data-meal-id");
    toggleCartItem(mealId);
  }
}

function toggleFavorite(mealId) {
  if (favorites.includes(mealId)) {
    favorites = favorites.filter((id) => id !== mealId);
  } else {
    favorites.push(mealId);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayMeals(getCurrentMeals());
  updateFavoritesDisplay();
}

function updateFavoritesDisplay() {
  if (favorites.length > 0) {
    favoritesSection.classList.remove("hidden");
    fetchFavoriteMeals();
  } else {
    favoritesSection.classList.add("hidden");
  }
}

async function fetchFavoriteMeals() {
  const favoriteMeals = [];
  for (const id of favorites) {
    const response = await fetch(`${LOOKUP_URL}${id}`);
    const data = await response.json();
    if (data.meals) favoriteMeals.push(data.meals[0]);
  }
  displayMealsInContainer(favoriteMeals, favoritesContainer);
}

function displayMealsInContainer(meals, container) {
  container.innerHTML = "";
  meals.forEach((meal) => {
    container.innerHTML += `
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

function saveRating(mealId, rating) {
  let ratings = JSON.parse(localStorage.getItem("ratings")) || {};
  ratings[mealId] = rating;
  localStorage.setItem("ratings", JSON.stringify(ratings));
}

function addToShoppingList(mealId) {
  fetch(`${LOOKUP_URL}${mealId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.meals) {
        const meal = data.meals[0];
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          if (
            meal[`strIngredient${i}`] &&
            meal[`strIngredient${i}`].trim() !== ""
          ) {
            ingredients.push(
              `${meal[`strMeasure${i}`] || ""} ${meal[`strIngredient${i}`]}`
            );
          }
        }
        shoppingListItems = [
          ...new Set([...shoppingListItems, ...ingredients]),
        ];
        localStorage.setItem("shoppingList", JSON.stringify(shoppingListItems));
        updateShoppingList();
      }
    });
}

function updateShoppingList() {
  if (shoppingListItems.length > 0) {
    shoppingListSection.classList.remove("hidden");
    shoppingList.innerHTML = shoppingListItems
      .map((item) => `<li>${item}</li>`)
      .join("");
  } else {
    shoppingListSection.classList.add("hidden");
  }
}

function clearShoppingListHandler() {
  shoppingListItems = [];
  localStorage.setItem("shoppingList", JSON.stringify(shoppingListItems));
  updateShoppingList();
}

function toggleCartItem(mealId) {
  if (cartItems.includes(mealId)) {
    cartItems = cartItems.filter((id) => id !== mealId);
  } else {
    cartItems.push(mealId);
  }
  localStorage.setItem("cart", JSON.stringify(cartItems));
  displayMeals(getCurrentMeals());
  updateCartDisplay();
}

function updateCartDisplay() {
  if (cartItems.length > 0) {
    cartSection.classList.remove("hidden");
    fetchCartMeals();
  } else {
    cartSection.classList.add("hidden");
  }
}

async function fetchCartMeals() {
  const cartMeals = [];
  for (const id of cartItems) {
    const response = await fetch(`${LOOKUP_URL}${id}`);
    const data = await response.json();
    if (data.meals) cartMeals.push(data.meals[0]);
  }
  displayMealsInContainer(cartMeals, cartContainer);
}

function clearCartHandler() {
  cartItems = [];
  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateCartDisplay();
}

function filterByCategory() {
  const category = categoryFilter.value;
  console.log("Selected category:", category);
  if (category) {
    fetch(`${FILTER_URL}${encodeURIComponent(category)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Filter response:", data);
        if (data.meals && data.meals.length > 0) {
          resultHeading.textContent = `Results for category "${category}":`;
          displayMeals(data.meals);
          searchInput.value = ""; // Clear search input when filtering by category
        } else {
          resultHeading.textContent = "";
          mealsContainer.innerHTML = "";
          errorContainer.textContent = `No recipes found for category "${category}".`;
          errorContainer.classList.remove("hidden");
        }
      })
      .catch((error) => {
        errorContainer.textContent =
          "Failed to load category recipes. Please try again.";
        errorContainer.classList.remove("hidden");
        console.error("Filter error:", error);
      });
  } else {
    searchMeals(); // Revert to search if no category selected
  }
}

function getCurrentMeals() {
  // Placeholder to get current displayed meals (simplified)
  return Array.from(mealsContainer.children).map((meal) => ({
    idMeal: meal.getAttribute("data-meal-id"),
    strMealThumb: meal.querySelector("img").src,
    strMeal: meal.querySelector(".meal-title").textContent,
    strCategory: meal.querySelector(".meal-category")?.textContent,
  }));
}

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  updateFavoritesDisplay();
  updateCartDisplay();
  updateShoppingList();
});
