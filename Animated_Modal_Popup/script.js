// EmailJS init
emailjs.init("Ftu5wfqXi1mu5c0W-"); // Replace with your EmailJS public key

const section = document.querySelector("section"),
  hireBtn = section.querySelector("#hireBtn"),
  closeBtns = section.querySelectorAll("#close"),
  textArea = section.querySelector("textarea"),
  contactForm = document.getElementById("contactForm"),
  sendBtn = contactForm.querySelector(".send");

// Toast Function
function showToast(message, isSuccess = true) {
  const toast = document.createElement("div");
  toast.className = `toast ${isSuccess ? "success" : "error"}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("visible");
  }, 100);
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Typing Animation
const professionSpan = document.querySelectorAll(".profession");
let titles = ["Web Developer", "UI/UX Designer", "Frontend Engineer"];
let index = 0;
let charIndex = 0;
let typingForward = true;

function typeProfession() {
  let currentTitle = titles[index];
  if (typingForward) {
    charIndex++;
    if (charIndex > currentTitle.length) {
      typingForward = false;
      setTimeout(typeProfession, 1000);
      return;
    }
  } else {
    charIndex--;
    if (charIndex < 0) {
      typingForward = true;
      index = (index + 1) % titles.length;
    }
  }

  professionSpan.forEach((span) => {
    span.textContent = currentTitle.substring(0, charIndex);
  });
  setTimeout(typeProfession, 100);
}
typeProfession();

// Rate Limiting
let lastSentTime = 0;
const MIN_INTERVAL = 5000; // 5 seconds between sends

// Show popup
hireBtn.addEventListener("click", () => {
  section.classList.add("show");
});

// Close popup
closeBtns.forEach((cBtn) => {
  cBtn.addEventListener("click", () => {
    section.classList.remove("show");
    contactForm.reset();
    sendBtn.disabled = false;
    sendBtn.innerHTML = "Send";
  });
});

// Form Submission
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const now = Date.now();
  if (now - lastSentTime < MIN_INTERVAL) {
    showToast("Please wait before sending again.", false);
    return;
  }

  const message = textArea.value.trim();
  const errorMessageDiv = document.getElementById("errorMessage");

  // Hide previous error
  errorMessageDiv.style.display = "none";

  if (!message) {
    errorMessageDiv.style.display = "block";
    return;
  }

  // Show loading state
  sendBtn.disabled = true;
  sendBtn.innerHTML = `<i class='bx bx-loader bx-spin'></i> Sending`;

  emailjs
    .send("service_ecimxsl", "template_j66pigd", {
      message: message,
    })
    .then(() => {
      lastSentTime = Date.now();
      showToast("✅ Message sent successfully!");
      section.classList.remove("show");
      contactForm.reset();
    })
    .catch((error) => {
      showToast("❌ Failed to send message.", false);
      console.error("EmailJS error:", error);
    })
    .finally(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = "Send";
    });
});
