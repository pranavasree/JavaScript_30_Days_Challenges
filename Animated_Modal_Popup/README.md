# Animated Contact Modal with EmailJS Integration

This is a stylish animated contact form modal built with HTML, CSS, and JavaScript. It includes:

- Typing animation for the profession title
- Animated popup modal for messages
- Email sending via EmailJS
- Custom error validation (no native browser validation popups)
- Loading state for the send button
- Toast notifications
- Rate limiting to prevent spam
- Responsive and clean glassmorphic UI

---

## Features

- 🔥 Glassmorphism design
- 📧 Email sending with EmailJS
- ⚠️ Custom error message for empty message field
- ⏳ Send rate limiter (1 message every 30 seconds)
- ✅ Toast feedback for success and failure
- 📱 Fully responsive layout

---

## How to Use

1. Clone or download this repository.
2. Open `index.html` in your browser.
3. Click the "Message Me" button to open the contact form modal.
4. Enter your message and click "Send".

To make the form functional, you need to configure EmailJS:

### Setup EmailJS

1. Go to [EmailJS](https://www.emailjs.com/) and create an account.
2. Create a new email service.
3. Create an email template (`template_j66pigd`).
4. Replace the following in `script.js` with your actual IDs:
   - `service_ecimxsl` → Your EmailJS service ID
   - `template_j66pigd` → Your EmailJS template ID
   - Add your public key if using a secure version

---

## 📸 Preview

<image src="preview.gif" alt="Animated Popup Modal" width="100%" height="100%">

---

## Customization

- Update the typing animation texts in `script.js`.
- Style the modal and layout in `style.css`.
- Customize toast messages and error styles in CSS and JS.

---

## License

This project is open-source and free to use for personal or commercial projects.
