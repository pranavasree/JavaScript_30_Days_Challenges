document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent parent accordion toggles

      const item = header.closest(".accordion-item");
      const container = item.parentElement;
      const isActive = item.classList.contains("active");

      // Collapse only siblings in the same container
      Array.from(container.children).forEach((sibling) => {
        if (sibling !== item && sibling.classList.contains("accordion-item")) {
          sibling.classList.remove("active");
          const icon = sibling.querySelector(".icon");
          if (icon) icon.innerHTML = "&#9662;";
        }
      });

      // Toggle current
      item.classList.toggle("active", !isActive);
      header.querySelector(".icon").innerHTML = !isActive
        ? "&#9652;"
        : "&#9662;";

      // Auto-collapse this specific accordion after 10s
      if (!isActive) {
        setTimeout(() => {
          if (item.classList.contains("active")) {
            item.classList.remove("active");
            const icon = item.querySelector(".icon");
            if (icon) icon.innerHTML = "&#9662;";
          }
        }, 10000);
      }
    });
  });
});
