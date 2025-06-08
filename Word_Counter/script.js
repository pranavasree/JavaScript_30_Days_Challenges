// Element References
const editor = document.getElementById("textInput");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const pasteBtn = document.getElementById("pasteBtn");

const fontSize = document.getElementById("fontSize");
const fontStyle = document.getElementById("fontStyle");
const spellToggle = document.getElementById("spellToggle");

const speakBtn = document.getElementById("speakBtn");

const timerMinutes = document.getElementById("timerMinutes");
const timerSeconds = document.getElementById("timerSeconds");
const startBtn = document.getElementById("startPomodoro");
const pauseBtn = document.getElementById("pausePomodoro");
const resetBtn = document.getElementById("resetPomodoro");

let pomodoroSeconds = 1500;
let pomodoroInterval = null;
let pomodoroStartWordCount = 0;

function updateTimerDisplay() {
  const mins = Math.floor(pomodoroSeconds / 60);
  const secs = pomodoroSeconds % 60;
  timerMinutes.textContent = String(mins).padStart(2, "0");
  timerSeconds.textContent = String(secs).padStart(2, "0");
}

function updateStats(text) {
  const wordsArr = text.trim().split(/\s+/).filter(Boolean);
  const words = wordsArr.length;
  const characters = text.length;
  const sentences = (text.match(/[.!?]/g) || []).length;
  const paragraphs = text.split(/\n+/).filter((p) => p.trim()).length;
  const readingTime = Math.ceil(words / 200);

  const vowels = (text.match(/[aeiouAEIOU]/g) || []).length;
  const consonants = (text.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;

  const wordLengths = wordsArr.map((w) => w.length);
  const avgWordLength = wordLengths.length
    ? (wordLengths.reduce((a, b) => a + b, 0) / wordLengths.length).toFixed(2)
    : 0;
  const longestWord = wordsArr.reduce(
    (a, b) => (b.length > a.length ? b : a),
    ""
  );
  const shortestWord = wordsArr.reduce(
    (a, b) => (b.length < a.length ? b : a),
    longestWord
  );

  const freqMap = {};
  wordsArr.forEach((w) => {
    const lw = w.toLowerCase();
    freqMap[lw] = (freqMap[lw] || 0) + 1;
  });
  const commonWord =
    Object.entries(freqMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  document.getElementById("wordCount").textContent = words;
  document.getElementById("charCount").textContent = characters;
  document.getElementById("sentenceCount").textContent = sentences;
  document.getElementById("paragraphCount").textContent = paragraphs;
  document.getElementById("readingTime").textContent = `${readingTime} min`;
  document.getElementById("vowelCount").textContent = vowels;
  document.getElementById("consonantCount").textContent = consonants;
  document.getElementById("avgWordLength").textContent = avgWordLength;
  document.getElementById("longestWord").textContent = longestWord || "-";
  document.getElementById("shortestWord").textContent = shortestWord || "-";
  document.getElementById("commonWord").textContent = commonWord;
}

editor.addEventListener("input", () => {
  const text = editor.value;
  updateStats(text);
  updateChart(text);
  updateTypingSpeed();
  trackWritingStreak();
});

fontSize.addEventListener("change", () => {
  editor.style.fontSize = fontSize.value;
});

fontStyle.addEventListener("change", () => {
  editor.style.fontFamily = fontStyle.value;
});

spellToggle.addEventListener("change", () => {
  editor.setAttribute("spellcheck", spellToggle.checked);
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(editor.value).then(() => alert("Copied!"));
});

pasteBtn.addEventListener("click", async () => {
  try {
    const permission = await navigator.permissions.query({
      name: "clipboard-read",
    });
    if (permission.state === "granted" || permission.state === "prompt") {
      const text = await navigator.clipboard.readText();
      editor.value = text;
      updateStats(text);
      updateChart(text);
    } else {
      alert("Clipboard access denied. Please paste manually (Ctrl+V).");
    }
  } catch (err) {
    alert("Clipboard access is not available. Please paste manually (Ctrl+V).");
  }
});

clearBtn.addEventListener("click", () => {
  editor.value = "";
  updateStats("");
  updateChart("");
});

startBtn.addEventListener("click", () => {
  if (pomodoroInterval) return;

  pomodoroStartWordCount = editor.value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  typingStartTime = Date.now(); // reset typing speed baseline
  pomodoroInterval = setInterval(() => {
    pomodoroSeconds--;
    updateTimerDisplay();
    if (pomodoroSeconds <= 0) {
      clearInterval(pomodoroInterval);
      pomodoroInterval = null;

      const currentWords = editor.value
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      const wordsWritten = currentWords - pomodoroStartWordCount;
      alert(`Pomodoro complete! 🥳 You wrote ${wordsWritten} words.`);
    }
  }, 1000);
});

pauseBtn.addEventListener("click", () => {
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
});

resetBtn.addEventListener("click", () => {
  pomodoroSeconds = 1500;
  updateTimerDisplay();
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
});

speakBtn.addEventListener("click", () => {
  const utterance = new SpeechSynthesisUtterance(editor.value);
  speechSynthesis.speak(utterance);
});

// Chart.js
const ctx = document.getElementById("charChart").getContext("2d");
let chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Character Frequency",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  },
});

function updateChart(text) {
  const freq = {};
  for (let char of text) {
    if (/[a-zA-Z]/.test(char)) {
      char = char.toLowerCase();
      freq[char] = (freq[char] || 0) + 1;
    }
  }
  const labels = Object.keys(freq).sort();
  const data = labels.map((l) => freq[l]);

  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}

// Typing Speed
let typingStartTime = null;
function updateTypingSpeed() {
  const now = Date.now();
  if (!typingStartTime) typingStartTime = now;

  const elapsedMinutes = (now - typingStartTime) / 1000 / 60;
  const wordCount = editor.value.trim().split(/\s+/).filter(Boolean).length;
  const wpm = elapsedMinutes > 0 ? Math.round(wordCount / elapsedMinutes) : 0;

  document.getElementById("typingSpeed").textContent = `${wpm} WPM`;
}

// Writing Streak
function trackWritingStreak() {
  const today = new Date().toISOString().split("T")[0];
  const lastDate = localStorage.getItem("lastWriteDate");
  let streak = parseInt(localStorage.getItem("writingStreak") || "0");

  if (lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastDate === yesterdayStr) {
      streak += 1;
    } else {
      streak = 1;
    }

    localStorage.setItem("lastWriteDate", today);
    localStorage.setItem("writingStreak", streak);
  }

  document.getElementById("writingStreak").textContent = `${streak} days`;
}

// Init
updateStats("");
updateTimerDisplay();
updateChart("");
trackWritingStreak();
updateTypingSpeed();
