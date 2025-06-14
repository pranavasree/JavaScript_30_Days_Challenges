const toggleCheckbox = document.getElementById("toggleCheckbox");
const favicon = document.getElementById("favicon");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const lightPreview = document.getElementById("lightPreview");
const darkPreview = document.getElementById("darkPreview");

function setTheme(mode) {
  const isDark = mode === "dark";
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("theme", mode);
  toggleCheckbox.checked = isDark;
  favicon.href = isDark ? "favicon-dark.ico" : "favicon-light.ico";
  document.body.style.opacity = 0.5;
  setTimeout(() => {
    document.body.style.opacity = 1;
  }, 300);
}

function autoToggleTheme() {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6 ? "dark" : "light";
}

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme(autoToggleTheme());
  }
});

toggleCheckbox.addEventListener("change", () => {
  const newTheme = toggleCheckbox.checked ? "dark" : "light";
  setTheme(newTheme);
});

lightPreview.addEventListener("click", () => setTheme("light"));
darkPreview.addEventListener("click", () => setTheme("dark"));
