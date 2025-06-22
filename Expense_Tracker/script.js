const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");
const dateEl = document.getElementById("date");
const filterTypeEl = document.getElementById("filter-type");
const sortByEl = document.getElementById("sort-by");
const searchEl = document.getElementById("search");
const budgetEl = document.getElementById("budget");
const budgetProgressEl = document.getElementById("budget-progress");
const exportBtn = document.getElementById("export-btn");
const darkModeToggle = document.getElementById("dark-mode-toggle");
let chart;

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budget = parseFloat(localStorage.getItem("budget")) || 0;

transactionFormEl.addEventListener("submit", addTransaction);
filterTypeEl.addEventListener("change", () =>
  updateTransactionList(searchEl.value, filterTypeEl.value, sortByEl.value)
);
sortByEl.addEventListener("change", () =>
  updateTransactionList(searchEl.value, filterTypeEl.value, sortByEl.value)
);
searchEl.addEventListener("input", () =>
  updateTransactionList(searchEl.value, filterTypeEl.value, sortByEl.value)
);
exportBtn.addEventListener("click", exportToCSV);
budgetEl.addEventListener("input", updateBudget);
darkModeToggle.addEventListener("change", toggleDarkMode);

function addTransaction(e) {
  e.preventDefault();
  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);
  const category = categoryEl.value;
  const date = dateEl.value;
  transactions.push({ id: Date.now(), description, amount, category, date });
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateTransactionList();
  updateSummary();
  updateChart();
  transactionFormEl.reset();
}

function updateTransactionList(
  search = "",
  filter = "all",
  sort = "date-desc"
) {
  transactionListEl.innerHTML = "";
  let filteredTransactions = [...transactions];

  if (search) {
    filteredTransactions = filteredTransactions.filter(
      (t) =>
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filter === "income")
    filteredTransactions = filteredTransactions.filter((t) => t.amount > 0);
  if (filter === "expense")
    filteredTransactions = filteredTransactions.filter((t) => t.amount < 0);

  if (sort === "date-asc")
    filteredTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
  else if (sort === "amount-desc")
    filteredTransactions.sort((a, b) => b.amount - a.amount);
  else if (sort === "amount-asc")
    filteredTransactions.sort((a, b) => a.amount - b.amount);
  else filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  filteredTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add(
    "transaction",
    transaction.amount > 0 ? "income" : "expense"
  );
  li.innerHTML = `
    <span>${transaction.description} <span class="category">[${
    transaction.category
  }]</span> <span class="date">${transaction.date}</span></span>
    <span>
      ${formatCurrency(transaction.amount)}
      <button class="delete-btn" onclick="removeTransaction(${
        transaction.id
      })">x</button>
    </span>
  `;
  return li;
}

function updateSummary() {
  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);
  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expenses);
  updateBudgetProgress();
}

function updateBudget() {
  budget = parseFloat(budgetEl.value) || 0;
  localStorage.setItem("budget", budget);
  updateBudgetProgress();
}

function updateBudgetProgress() {
  const expenses = Math.abs(
    transactions
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0)
  );
  const progress = budget ? (expenses / budget) * 100 : 0;
  budgetProgressEl.style.width = `${Math.min(progress, 100)}%`;
}

function updateChart() {
  const ctx = document.getElementById("category-chart").getContext("2d");
  const categories = {};
  transactions.forEach((t) => {
    const key = t.category || "Uncategorized";
    categories[key] = (categories[key] || 0) + Math.abs(t.amount);
  });
  const colors = {
    Food: "#14b8a6",
    Rent: "#f97316",
    Salary: "#7c3aed",
    Transport: "#3b82f6",
    Entertainment: "#a78bfa",
    Other: "#6b7280",
  };
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: Object.keys(categories).map(
            (key) => colors[key] || `#${Math.random().toString(16).slice(2, 8)}`
          ),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
    },
  });
}

function formatCurrency(number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
}

function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateTransactionList(searchEl.value, filterTypeEl.value, sortByEl.value);
  updateSummary();
  updateChart();
}

function exportToCSV() {
  const csv = ["Description,Amount,Category,Date"];
  transactions.forEach((t) => {
    csv.push(`${t.description},${t.amount},${t.category},${t.date}`);
  });
  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
}

// Initial render
if (localStorage.getItem("theme") === "dark")
  document.body.classList.add("dark-mode");
budgetEl.value = budget;
updateTransactionList();
updateSummary();
updateChart();
