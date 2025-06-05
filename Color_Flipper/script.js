function showSection(type) {
  document.getElementById("colorPickerSection").style.display =
    type === "color" ? "block" : "none";
  document.getElementById("imagePickerSection").style.display =
    type === "image" ? "block" : "none";
}

let currentColor = "#000000";
const MAX_SAVED_COLORS = 5;
const savedColorsKey = "savedColors";

const colorInput = document.getElementById("colorInput");
const hexOutput = document.getElementById("hexOutput");
const rgbOutput = document.getElementById("rgbOutput");
const selectedColorBox = document.getElementById("selectedColorBox");
const savedColorsContainer = document.querySelector(".saved-colors");
const colorNameOutput = document.getElementById("colorNameOutput");

// Basic color name lookup
const colorNames = {
  "#000000": "Black",
  "#ffffff": "White",
  "#ff0000": "Red",
  "#00ff00": "Lime",
  "#0000ff": "Blue",
  "#ffff00": "Yellow",
  "#00ffff": "Cyan",
  "#ff00ff": "Magenta",
  "#c0c0c0": "Silver",
  "#808080": "Gray",
  "#800000": "Maroon",
  "#808000": "Olive",
  "#008000": "Green",
  "#800080": "Purple",
  "#008080": "Teal",
  "#000080": "Navy",
  "#f0f8ff": "Alice Blue",
  "#fa8072": "Salmon",
  "#ff4500": "Orange Red",
  "#add8e6": "Light Blue",
  "#87ceeb": "Sky Blue",
  "#dc143c": "Crimson",
};

function getColorName(hex) {
  hex = hex.toLowerCase();

  if (colorNames[hex]) return colorNames[hex];

  if (typeof colorNamesList === "undefined") {
    console.warn("colorNamesList is not loaded");
    return "Unknown Color";
  }

  const r1 = parseInt(hex.slice(1, 3), 16);
  const g1 = parseInt(hex.slice(3, 5), 16);
  const b1 = parseInt(hex.slice(5, 7), 16);

  let closest = null;
  let smallestDistance = Infinity;

  colorNamesList.forEach((color) => {
    const r2 = parseInt(color.hex.slice(1, 3), 16);
    const g2 = parseInt(color.hex.slice(3, 5), 16);
    const b2 = parseInt(color.hex.slice(5, 7), 16);

    const distance = Math.sqrt(
      Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
    );

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closest = color;
    }
  });

  return closest ? closest.name : "Unknown Color";
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function updateColorDisplay(hex) {
  hexOutput.textContent = hex;
  selectedColorBox.style.backgroundColor = hex;
  const rgb = hexToRgb(hex);
  rgbOutput.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  if (colorNameOutput) {
    colorNameOutput.textContent = getColorName(hex);
  }
}

colorInput.addEventListener("input", () => {
  currentColor = colorInput.value;
  updateColorDisplay(currentColor);
});

function renderSavedColors() {
  savedColorsContainer.innerHTML = "";
  const colors = getSavedColors();

  colors.forEach((color, index) => {
    const bar = document.createElement("div");
    bar.className = "color-bar";
    bar.style.backgroundColor = color;

    bar.addEventListener("dblclick", () => {
      currentColor = color;
      updateColorDisplay(currentColor);
    });

    bar.addEventListener("click", () => {
      if (color === currentColor || getSavedColors().includes(currentColor)) {
        showToast("Duplicate color not allowed!");
        return;
      }
      const colors = getSavedColors();
      colors[index] = currentColor;
      saveColors(colors);
      renderSavedColors();
    });

    savedColorsContainer.appendChild(bar);
  });
}

function getSavedColors() {
  return JSON.parse(localStorage.getItem(savedColorsKey)) || [];
}

function saveColors(colors) {
  localStorage.setItem(savedColorsKey, JSON.stringify(colors));
}

function trySaveColor() {
  let colors = getSavedColors();
  if (colors.includes(currentColor)) {
    showToast("Duplicate color not allowed!");
    return;
  }

  if (colors.length < MAX_SAVED_COLORS) {
    colors.push(currentColor);
  } else {
    colors = colors.slice(1).concat(currentColor);
  }

  saveColors(colors);
  renderSavedColors();
}

savedColorsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("color-bar")) return;
  trySaveColor();
});

renderSavedColors();

// Image Picker
const imageUpload = document.getElementById("imageUpload");
const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");
const imgHexOutput = document.getElementById("imgHexOutput");
const imgRgbOutput = document.getElementById("imgRgbOutput");
const imgColorPreview = document.getElementById("imgColorPreview");

imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (evt) {
    const img = new Image();
    img.onload = function () {
      const containerWidth = canvas.parentElement.clientWidth - 40;
      const scale = Math.min(containerWidth / img.width, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b] = pixel;

  const hex = rgbToHex(r, g, b);
  currentColor = hex;
  imgRgbOutput.textContent = `rgb(${r}, ${g}, ${b})`;
  imgHexOutput.textContent = hex;
  imgColorPreview.style.backgroundColor = hex;
  updateColorDisplay(hex);
});
