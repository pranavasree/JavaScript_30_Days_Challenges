const converterForm = document.getElementById("converter-form");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");
const swapBtn = document.getElementById("swap-btn");
const loading = document.getElementById("loading");
const resultText = document.getElementById("result-text");
const ratesBody = document.getElementById("rates-body");
const historyList = document.getElementById("history-list");
const themeToggle = document.getElementById("theme-toggle");

// Common currency pairs for quick convert
const commonPairs = [
  { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" },
  { from: "EUR", to: "USD" },
  { from: "USD", to: "JPY" },
  { from: "USD", to: "INR" },
  { from: "GBP", to: "EUR" },
];

// Setup quick convert buttons
function setupQuickConvert() {
  const pairsContainer = document.getElementById("currency-pairs");
  pairsContainer.innerHTML = "";
  commonPairs.forEach((pair) => {
    const pairBtn = document.createElement("button");
    pairBtn.classList.add("pair-btn");
    pairBtn.type = "button";
    pairBtn.textContent = `${pair.from} → ${pair.to}`;
    pairBtn.addEventListener("click", () => {
      fromCurrency.value = pair.from;
      toCurrency.value = pair.to;
      if (amountInput.value) {
        convertCurrency(new Event("submit"));
      }
    });
    pairsContainer.appendChild(pairBtn);
  });
}

// Fetch available currencies
async function fetchCurrencies() {
  try {
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const data = await response.json();
    const currencyOptions = Object.keys(data.rates);

    // Clear existing options
    fromCurrency.innerHTML = "";
    toCurrency.innerHTML = "";

    currencyOptions.forEach((currency) => {
      const option1 = document.createElement("option");
      option1.value = currency;
      option1.textContent = currency;
      fromCurrency.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = currency;
      option2.textContent = currency;
      toCurrency.appendChild(option2);
    });

    // Set default values
    fromCurrency.value = "USD";
    toCurrency.value = "EUR";

    // Generate initial rates table
    generateRatesTable();

    // Display initial history
    displayConversionHistory();
  } catch (error) {
    console.error("Error fetching currencies:", error);
  }
}

// Convert currency
async function convertCurrency(e) {
  e.preventDefault();

  loading.classList.remove("hidden");
  resultText.textContent = "";

  const amount = parseFloat(amountInput.value);
  const fromCurrencyValue = fromCurrency.value;
  const toCurrencyValue = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    loading.classList.add("hidden");
    return;
  }

  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrencyValue}`
    );
    const data = await response.json();

    const rate = data.rates[toCurrencyValue];
    const convertedAmount = (amount * rate).toFixed(2);

    loading.classList.add("hidden");
    resultText.textContent = `${amount} ${fromCurrencyValue} = ${convertedAmount} ${toCurrencyValue}`;

    // Save conversion history
    saveConversion(fromCurrencyValue, toCurrencyValue, amount, convertedAmount);

    // Update rates table
    generateRatesTable();

    // Update history
    displayConversionHistory();
  } catch (error) {
    console.error("Error converting currency:", error);
    loading.classList.add("hidden");
    resultText.textContent =
      "Error: Could not convert currency. Please try again.";
  }
}

// Swap currencies
swapBtn.addEventListener("click", () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  if (amountInput.value) {
    convertCurrency(new Event("submit"));
  }
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  // Save preference to localStorage
  const isDarkMode = document.body.classList.contains("dark-theme");
  localStorage.setItem("darkMode", isDarkMode);
});

// Generate rates table
async function generateRatesTable() {
  const amount = parseFloat(amountInput.value) || 1;
  const fromCurrencyValue = fromCurrency.value || "USD";

  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrencyValue}`
    );
    const data = await response.json();

    // Clear previous data
    ratesBody.innerHTML = "";

    // Get major currencies
    const majorCurrencies = [
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CHF",
      "CNY",
      "INR",
      "BRL",
    ].filter((curr) => curr !== fromCurrencyValue);

    majorCurrencies.forEach((currency) => {
      const rate = data.rates[currency];
      const convertedAmount = (amount * rate).toFixed(2);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${currency}</td>
        <td>${rate ? rate.toFixed(4) : "-"}</td>
        <td>${rate ? convertedAmount : "-"}</td>
      `;

      ratesBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error generating rates table:", error);
    ratesBody.innerHTML =
      "<tr><td colspan='3'>Failed to load rates data</td></tr>";
  }
}

// Save conversion to history
function saveConversion(from, to, amount, result) {
  const history = JSON.parse(localStorage.getItem("conversionHistory") || "[]");

  // Add new conversion to history
  history.unshift({
    from,
    to,
    amount,
    result,
    date: new Date().toISOString(),
  });

  // Keep only last 10 conversions
  if (history.length > 10) {
    history.pop();
  }

  localStorage.setItem("conversionHistory", JSON.stringify(history));
}

// Display conversion history
function displayConversionHistory() {
  const history = JSON.parse(localStorage.getItem("conversionHistory") || "[]");

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<li>No conversion history yet</li>";
    return;
  }

  history.forEach((item) => {
    const li = document.createElement("li");
    const date = new Date(item.date);

    li.innerHTML = `
      <div>
        <strong>${item.amount} ${item.from} = ${item.result} ${item.to}</strong>
        <div class="history-date">${date.toLocaleString()}</div>
      </div>
      <button class="repeat-btn" data-from="${item.from}" data-to="${
      item.to
    }" data-amount="${item.amount}">↻</button>
    `;

    historyList.appendChild(li);
  });

  // Add event listeners to repeat buttons
  document.querySelectorAll(".repeat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      fromCurrency.value = btn.dataset.from;
      toCurrency.value = btn.dataset.to;
      amountInput.value = btn.dataset.amount;
      convertCurrency(new Event("submit"));
    });
  });
}

// Listen for form submit
converterForm.addEventListener("submit", convertCurrency);

// Listen for amount or currency change to update rates table
amountInput.addEventListener("input", generateRatesTable);
fromCurrency.addEventListener("change", generateRatesTable);

// Check for saved theme preference
window.addEventListener("DOMContentLoaded", () => {
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  if (savedDarkMode) {
    document.body.classList.add("dark-theme");
  }
});

// Initialize the app
window.addEventListener("load", () => {
  fetchCurrencies();
  setupQuickConvert();
});
