let draggedCardId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadCardsFromStorage();
});

function dragStart(e) {
  draggedCardId = e.target.id;
  e.dataTransfer.setData("text/plain", draggedCardId);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e, targetId) {
  e.preventDefault();
  const card = document.getElementById(draggedCardId);
  document.getElementById(`cards-${targetId}`).appendChild(card);
  saveCardsToStorage();
  updateProgress();
}

function addCard(listId) {
  const container = document.getElementById(`cards-${listId}`);
  const cardId = "card-" + Date.now();
  const card = document.createElement("div");
  card.className = "card";
  card.id = cardId;
  card.draggable = true;
  card.innerHTML = `<input type="text" value="New Task" onblur="saveCardsToStorage()" />
                    <span class="delete-btn" onclick="deleteCard('${cardId}')">❌</span>`;

  card.addEventListener("dragstart", dragStart);
  container.appendChild(card);
  saveCardsToStorage();
  updateProgress();
}

function deleteCard(id) {
  const card = document.getElementById(id);
  if (card && card.parentNode) {
    card.parentNode.removeChild(card);
    saveCardsToStorage();
    updateProgress();
  }
}

function saveCardsToStorage() {
  const data = {};
  document.querySelectorAll(".list").forEach((list) => {
    const listId = list.id;
    const cards = Array.from(list.querySelectorAll(".card")).map((card) => {
      return {
        id: card.id,
        text: card.querySelector("input").value,
      };
    });
    data[listId] = cards;
  });
  localStorage.setItem("kanbanData", JSON.stringify(data));
}

function loadCardsFromStorage() {
  const data = JSON.parse(localStorage.getItem("kanbanData") || "{}");
  Object.keys(data).forEach((listId) => {
    const container = document.getElementById(`cards-${listId}`);
    container.innerHTML = "";
    data[listId].forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";
      card.id = item.id;
      card.draggable = true;
      card.innerHTML = `<input type="text" value="${item.text}" onblur="saveCardsToStorage()" />
                        <span class="delete-btn" onclick="deleteCard('${item.id}')">❌</span>`;
      card.addEventListener("dragstart", dragStart);
      container.appendChild(card);
    });
  });
  updateProgress();
}

function updateProgress() {
  const allCards = [
    ...document.querySelectorAll("#cards-list1 .card"),
    ...document.querySelectorAll("#cards-list2 .card"),
    ...document.querySelectorAll("#cards-list3 .card"),
  ];
  const total = allCards.length;
  const done = document.querySelectorAll("#cards-list3 .card").length;

  const percent = total === 0 ? 0 : (done / total) * 100;

  // Only update the "Done" list's progress bar to reflect this percentage
  document.getElementById("progress-done").style.width = `${percent}%`;

  // Optionally reset others
  document.getElementById("progress-todo").style.width = `0%`;
  document.getElementById("progress-progress").style.width = `0%`;
}

document.querySelectorAll(".list").forEach((list) => {
  list.addEventListener("dragover", dragOver);
  list.addEventListener("drop", (e) => drop(e, list.id));
});
