const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    // Ripple effect
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    ripple.style.left = `${e.offsetX}px`;
    ripple.style.top = `${e.offsetY}px`;
    tab.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    // Remove active from all
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));

    // Activate selected
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});
