# 💳 Pricing Cards UI with Save Plan & 3D Hover Effects

This is a modern **Pricing Cards UI** built with HTML, CSS, and JavaScript featuring:

- ✨ Glassmorphism styling
- 🚀 Hover animations (3D flip effect)
- 💾 "Save Plan" functionality using localStorage

---

## 📦 Features

- **Responsive layout** for all devices
- **3D Hover Tilt** animation on cards
- **Save Plan to Cart** button stores plans in `localStorage`
- Duplicate saves are prevented
- Visual feedback through alerts

---

## 📁 File Structure

```
pricing-cards-app/
│
├── index.html          # Main HTML structure
├── style.css           # Glassmorphic styles & animations
└── script.js           # Save Plan logic & card interactions
```

---

## 🚀 How to Use

1. Clone or download this repository.
2. Open `index.html` in your browser.
3. Hover over cards to see the 3D effect.
4. Click "Save Plan" to add it to localStorage.

Use browser DevTools → Console to check stored plans:

```js
localStorage.getItem("savedPlans");
```

---

## 🧼 Clear Saved Plans

To remove all saved plans from storage:

```js
localStorage.removeItem("savedPlans");
```

---

## 🛠️ Technologies

- HTML5
- CSS3 (Glassmorphism, animations)
- JavaScript (DOM, localStorage)

---

## 📸 Preview

![Screenshot](preview.gif)

---

## 📃 License

MIT License. Feel free to use and modify!
