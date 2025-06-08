const taskInput = document.getElementById("taskInput");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

const celebrationSound = new Audio("images/celebration.mp3");

let editTaskId = null;
let confettiShown = false;

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

addTask.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const dueDate = document.getElementById("dueDate").value;
  if (!taskText) return;

  const newTask = {
    id: Date.now(),
    description: taskText,
    dueDate,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();

  taskInput.value = "";
  document.getElementById("dueDate").value = "";
});

function renderTasks() {
  taskList.innerHTML = "";
  let completed = 0;

  tasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    if (task.dueDate) {
      const today = new Date().setHours(0, 0, 0, 0);
      const taskDue = new Date(task.dueDate).setHours(0, 0, 0, 0);
      if (taskDue < today && !task.completed) {
        li.classList.add("overdue");
        showOverdueAlert(task.description);
      }
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleComplete(task.id);

    const span = document.createElement("span");
    span.textContent = task.description;

    const dueSpan = document.createElement("span");
    dueSpan.classList.add("due-date");
    dueSpan.textContent = task.dueDate ? ` (Due: ${task.dueDate})` : "";
    span.appendChild(dueSpan);

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.onclick = () => openEditModal(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.append(editBtn, deleteBtn);
    li.append(checkbox, span, actions);
    taskList.appendChild(li);

    if (task.completed) completed++;
  });

  updateProgress(completed, tasks.length);
}

function toggleComplete(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function updateProgress(done, total) {
  progressText.textContent = `${done} / ${total}`;
  progressBar.style.width = `${(done / total) * 100 || 0}%`;

  if (total > 0 && done === total && !confettiShown) {
    launchConfetti();
    confettiShown = true;
  } else if (done !== total) {
    confettiShown = false;
  }
}

function showOverdueAlert(taskText) {
  const alert = document.createElement("div");
  alert.className = "gentle-alert";
  alert.innerHTML = `⚠️ Overdue Task: <strong>${taskText}</strong>`;
  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 4000);
}

// Modal logic
const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editTaskInput");
const editDueDate = document.getElementById("editDueDate");
const saveEdit = document.getElementById("saveEdit");
const cancelEdit = document.getElementById("cancelEdit");

function openEditModal(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    editTaskId = taskId;
    editInput.value = task.description;
    editDueDate.value = task.dueDate || "";
    editModal.style.display = "flex";
  }
}

saveEdit.addEventListener("click", () => {
  const updatedText = editInput.value.trim();
  const updatedDate = editDueDate.value;

  if (updatedText && editTaskId !== null) {
    const task = tasks.find((t) => t.id === editTaskId);
    if (task) {
      task.description = updatedText;
      task.dueDate = updatedDate;
      saveTasks();
    }
    closeModal();
  }
});

cancelEdit.addEventListener("click", closeModal);

function closeModal() {
  editModal.style.display = "none";
  editTaskId = null;
}

function launchConfetti() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;

  celebrationSound.play();

  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ff4b5c", "#ffe066", "#06d6a0", "#118ab2", "#f72585"],
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ff4b5c", "#ffe066", "#06d6a0", "#118ab2", "#f72585"],
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  })();
}

// Particles.js config
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
    opacity: { value: 0.2, random: true },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.1,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      random: true,
      straight: false,
      out_mode: "out",
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      resize: true,
    },
    modes: { repulse: { distance: 100 } },
  },
  retina_detect: true,
});
