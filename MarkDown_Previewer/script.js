const markdownInput = document.getElementById("markdownInput");
const previewOutput = document.getElementById("previewOutput");

// Initial Markdown example
markdownInput.value =
  `# Welcome to Markdown Previewer\n\n` +
  `## Features\n` +
  `- Real-time preview\n` +
  `- Syntax highlighting for code\n` +
  `- Save/load Markdown\n` +
  `- Markdown toolbar\n\n` +
  `\`\`\`javascript\nconsole.log("Hello, World!");\n\`\`\`\n` +
  `**Bold**, *italic*, and [links](https://example.com) are supported!`;

// Load saved Markdown from localStorage
window.onload = () => {
  const savedMarkdown = localStorage.getItem("markdown");
  if (savedMarkdown) {
    markdownInput.value = savedMarkdown;
    renderPreview();
  } else {
    renderPreview();
  }
};

// Update preview on input
markdownInput.addEventListener("input", renderPreview);

function renderPreview() {
  const markdownText = markdownInput.value;
  previewOutput.innerHTML = marked.parse(markdownText);
  Prism.highlightAll(); // Highlight code blocks
}

// Toolbar Markdown insertion
function insertMarkdown(type) {
  const start = markdownInput.selectionStart;
  const end = markdownInput.selectionEnd;
  const selectedText = markdownInput.value.substring(start, end);

  let newText = "";
  switch (type) {
    case "bold":
      newText = `**${selectedText}**`;
      break;
    case "italic":
      newText = `*${selectedText}*`;
      break;
    case "header":
      newText = `# ${selectedText}`;
      break;
  }

  markdownInput.setRangeText(newText, start, end, "select");
  renderPreview();
}

// Save to localStorage
function saveToLocal() {
  localStorage.setItem("markdown", markdownInput.value);
  alert("Markdown saved!");
}

// Download as .md file
function downloadMarkdown() {
  const blob = new Blob([markdownInput.value], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "markdown.md";
  a.click();
  URL.revokeObjectURL(url);
}

// Load Markdown from file
function loadMarkdown(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      markdownInput.value = e.target.result;
      renderPreview();
    };
    reader.readAsText(file);
  }
}
