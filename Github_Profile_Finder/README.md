# 🌐 Glassmorphic GitHub Profile Finder

A sleek, modern GitHub Profile Finder built with HTML, CSS, and JavaScript. This app uses the GitHub API to fetch and display user profile information in a stunning **glassmorphism-based** UI, enhanced with animations, effects, and interactive features.

![screenshot](preview.gif) <!-- Optional: Include a screenshot of your app -->

---

## ✨ Features

### 🔍 GitHub Profile Search

- Enter a GitHub username to instantly fetch and display user details.
- Profile information includes:
  - Avatar
  - Name
  - Bio
  - Location
  - Followers & Following
  - Public Repositories
  - Account creation date
  - Visit GitHub button

### 💎 Glassmorphic UI

- Stylish frosted-glass effect for all content containers.
- Soft gradients and shadows for a modern, minimal aesthetic.

### 🖼️ Responsive Design

- Mobile-first layout.
- Fully responsive and optimized for desktops, tablets, and mobile devices.

### 🎇 Background Animation

- Animated **network of nodes and connecting lines** as the background.
- Runs on `<canvas>`, styled behind the main UI without affecting interactions.
- Responsive to window size changes.

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3** (with Glassmorphism design)
- **JavaScript (Vanilla)**
- **GitHub API**
- **EmailJS** (for contact form integration)

---

## 🚧 Setup & Usage

1. Clone the repository:

```bash
git clone https://github.com/yourusername/github-profile-finder.git
cd github-profile-finder
```

2. Open `index.html` in your browser.

3. _(Optional)_ Configure your EmailJS settings:
   - Sign up at [emailjs.com](https://emailjs.com)
   - Replace the placeholders in the JS with your EmailJS `service ID`, `template ID`, and `public key`.

---

## 🔒 API Limitations

- GitHub API allows a limited number of unauthenticated requests per hour.
- For higher usage, consider authenticating with a GitHub token (not currently implemented).

---

## 🙌 Acknowledgements

- [GitHub REST API](https://docs.github.com/en/rest)
- [EmailJS](https://www.emailjs.com/)
- [CSS Glassmorphism Generator](https://hype4.academy/tools/glassmorphism-generator)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🧑‍💻 Author

**Pranava Sree Pottipati**
