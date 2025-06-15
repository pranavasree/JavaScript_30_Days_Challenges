const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    // Remove selected and popular class from all cards
    cards.forEach((c) => {
      c.classList.remove("selected", "popular");
      const badge = c.querySelector(".popular-badge");
      if (badge) badge.style.display = "none"; // Hide badge
    });

    // Add selected class to clicked card
    card.classList.add("selected");

    // Optional: Re-show "Most Popular" badge if it's the Pro plan
    if (card.querySelector("h3").textContent.trim() === "Pro") {
      card.classList.add("popular");
      const badge = card.querySelector(".popular-badge");
      if (badge) badge.style.display = "block";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".card .btn");

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const planName = card.querySelector("h3").textContent;
      const price = card.querySelector(".amount").textContent;
      const features = Array.from(card.querySelectorAll(".features li")).map(
        (li) => li.textContent.trim()
      );

      const savedPlans = JSON.parse(localStorage.getItem("savedPlans")) || [];

      // Prevent duplicates
      if (!savedPlans.some((plan) => plan.name === planName)) {
        savedPlans.push({
          name: planName,
          price,
          features,
        });

        localStorage.setItem("savedPlans", JSON.stringify(savedPlans));
        alert(`"${planName}" plan saved!`);
      } else {
        alert(`"${planName}" is already in your saved plans.`);
      }
    });
  });
});

console.log(JSON.parse(localStorage.getItem("savedPlans")));
