// Enhanced Tic Tac Toe Game with AI
class TicTacToeGame {
  constructor() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.gameMode = null;
    this.gameActive = false;
    this.scores = { X: 0, O: 0, draws: 0 };
    this.gameStats = this.loadStats();

    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    this.initializeElements();
    this.setupEventListeners();
    this.updateStats();
    this.loadTheme();
  }

  initializeElements() {
    // Game mode elements
    this.gameModeSelection = document.getElementById("gameModeSelection");
    this.gameSection = document.getElementById("gameSection");
    this.modeButtons = document.querySelectorAll(".mode-btn");

    // Game board elements
    this.gameBoard = document.getElementById("gameBoard");
    this.cells = document.querySelectorAll(".cell");
    this.winningLine = document.getElementById("winningLine");

    // Player info elements
    this.playerX = document.getElementById("playerX");
    this.playerO = document.getElementById("playerO");
    this.currentTurn = document.getElementById("currentTurn");
    this.gameModeDisplay = document.getElementById("gameModeDisplay");
    this.scoreX = document.getElementById("scoreX");
    this.scoreO = document.getElementById("scoreO");

    // Control buttons
    this.restartBtn = document.getElementById("restartBtn");
    this.newGameBtn = document.getElementById("newGameBtn");
    this.statsBtn = document.getElementById("statsBtn");
    this.themeToggle = document.getElementById("themeToggle");

    // Modals
    this.statsModal = document.getElementById("statsModal");
    this.resultModal = document.getElementById("resultModal");
    this.closeStatsModal = document.getElementById("closeStatsModal");
    this.resetStatsBtn = document.getElementById("resetStatsBtn");
    this.playAgainBtn = document.getElementById("playAgainBtn");
    this.changeModeBtn = document.getElementById("changeModeBtn");

    // Result modal elements
    this.resultIcon = document.getElementById("resultIcon");
    this.resultText = document.getElementById("resultText");

    // Stats elements
    this.totalGames = document.getElementById("totalGames");
    this.playerXWins = document.getElementById("playerXWins");
    this.playerOWins = document.getElementById("playerOWins");
    this.draws = document.getElementById("draws");
  }

  setupEventListeners() {
    // Mode selection
    this.modeButtons.forEach((btn) => {
      btn.addEventListener("click", () =>
        this.selectGameMode(btn.dataset.mode)
      );
    });

    // Game board
    this.cells.forEach((cell, index) => {
      cell.addEventListener("click", () => this.makeMove(index));
    });

    // Control buttons
    this.restartBtn.addEventListener("click", () => this.restartGame());
    this.newGameBtn.addEventListener("click", () => this.showModeSelection());
    this.statsBtn.addEventListener("click", () => this.showStats());
    this.themeToggle.addEventListener("click", () => this.toggleTheme());

    // Modal controls
    this.closeStatsModal.addEventListener("click", () => this.hideStats());
    this.resetStatsBtn.addEventListener("click", () => this.resetStats());
    this.playAgainBtn.addEventListener("click", () => this.playAgain());
    this.changeModeBtn.addEventListener("click", () => this.changeMode());

    // Close modals on outside click
    this.statsModal.addEventListener("click", (e) => {
      if (e.target === this.statsModal) this.hideStats();
    });
    this.resultModal.addEventListener("click", (e) => {
      if (e.target === this.resultModal) this.hideResult();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  selectGameMode(mode) {
    this.gameMode = mode;
    this.gameModeSelection.style.display = "none";
    this.gameSection.style.display = "block";

    // Update game mode display
    const modeNames = {
      pvp: "Player vs Player",
      "ai-easy": "vs AI (Easy)",
      "ai-hard": "vs AI (Hard)",
    };
    this.gameModeDisplay.textContent = modeNames[mode];

    // Update player names
    if (mode.startsWith("ai")) {
      this.playerO.querySelector(".player-name").textContent = "AI";
    } else {
      this.playerO.querySelector(".player-name").textContent = "Player O";
    }

    this.startGame();
  }

  startGame() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.gameActive = true;
    this.updateBoard();
    this.updatePlayerTurn();
    this.hideWinningLine();
  }

  makeMove(index) {
    if (
      !this.gameActive ||
      this.board[index] !== "" ||
      (this.currentPlayer === "O" && this.gameMode.startsWith("ai"))
    ) {
      return;
    }

    this.board[index] = this.currentPlayer;
    this.updateBoard();

    if (this.checkWinner()) {
      this.endGame();
      return;
    }

    if (this.checkDraw()) {
      this.endGame(true);
      return;
    }

    this.switchPlayer();

    // AI move
    if (this.currentPlayer === "O" && this.gameMode.startsWith("ai")) {
      setTimeout(() => this.makeAIMove(), 500);
    }
  }

  makeAIMove() {
    if (!this.gameActive) return;

    let move;
    if (this.gameMode === "ai-easy") {
      move = this.getRandomMove();
    } else {
      move = this.getBestMove();
    }

    if (move !== -1) {
      this.board[move] = "O";
      this.updateBoard();

      if (this.checkWinner()) {
        this.endGame();
        return;
      }

      if (this.checkDraw()) {
        this.endGame(true);
        return;
      }

      this.switchPlayer();
    }
  }

  getRandomMove() {
    const availableMoves = this.board
      .map((cell, index) => (cell === "" ? index : null))
      .filter((val) => val !== null);

    return availableMoves.length > 0
      ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
      : -1;
  }

  getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (this.board[i] === "") {
        this.board[i] = "O";
        let score = this.minimax(this.board, 0, false);
        this.board[i] = "";

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }

  minimax(board, depth, isMaximizing) {
    const winner = this.checkWinnerForBoard(board);

    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (this.checkDrawForBoard(board)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = "O";
          let score = this.minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = "X";
          let score = this.minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  checkWinner() {
    return this.checkWinnerForBoard(this.board);
  }

  checkWinnerForBoard(board) {
    for (let combination of this.winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  checkDraw() {
    return this.checkDrawForBoard(this.board);
  }

  checkDrawForBoard(board) {
    return (
      board.every((cell) => cell !== "") && !this.checkWinnerForBoard(board)
    );
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    this.updatePlayerTurn();
  }

  updateBoard() {
    this.cells.forEach((cell, index) => {
      const value = this.board[index];
      cell.innerHTML = "";
      cell.classList.remove("disabled");

      if (value) {
        const symbol = document.createElement("i");
        symbol.className =
          value === "X" ? "fas fa-times symbol x" : "fas fa-circle symbol o";
        cell.appendChild(symbol);
        cell.classList.add("disabled");
      }
    });
  }

  updatePlayerTurn() {
    this.playerX.classList.toggle("active", this.currentPlayer === "X");
    this.playerO.classList.toggle("active", this.currentPlayer === "O");

    let turnText = `${
      this.currentPlayer === "X"
        ? "Player X"
        : this.gameMode.startsWith("ai")
        ? "AI"
        : "Player O"
    }'s Turn`;
    this.currentTurn.textContent = turnText;
  }

  endGame(isDraw = false) {
    this.gameActive = false;

    if (!isDraw) {
      const winner = this.checkWinner();
      this.scores[winner]++;
      this.updateScores();
      this.showWinningLine();
      this.updateGameStats(winner);
    } else {
      this.scores.draws++;
      this.updateGameStats("draw");
    }

    this.saveStats();
    setTimeout(() => this.showResult(isDraw), 1000);
  }

  showWinningLine() {
    for (let combination of this.winningCombinations) {
      const [a, b, c] = combination;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.drawWinningLine(combination);
        break;
      }
    }
  }

  drawWinningLine(combination) {
    const [a, b, c] = combination;
    const cellA = this.cells[a].getBoundingClientRect();
    const cellC = this.cells[c].getBoundingClientRect();
    const boardRect = this.gameBoard.getBoundingClientRect();

    const startX = cellA.left + cellA.width / 2 - boardRect.left;
    const startY = cellA.top + cellA.height / 2 - boardRect.top;
    const endX = cellC.left + cellC.width / 2 - boardRect.left;
    const endY = cellC.top + cellC.height / 2 - boardRect.top;

    const length = Math.sqrt(
      Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );
    const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;

    this.winningLine.style.width = `${length}px`;
    this.winningLine.style.height = "4px";
    this.winningLine.style.left = `${startX}px`;
    this.winningLine.style.top = `${startY}px`;
    this.winningLine.style.transform = `rotate(${angle}deg)`;
    this.winningLine.style.transformOrigin = "0 50%";
    this.winningLine.classList.add("show");
  }

  hideWinningLine() {
    this.winningLine.classList.remove("show");
  }

  updateScores() {
    this.scoreX.textContent = this.scores.X;
    this.scoreO.textContent = this.scores.O;
  }

  showResult(isDraw) {
    const winner = this.checkWinner();

    if (isDraw) {
      this.resultIcon.innerHTML = '<i class="fas fa-handshake"></i>';
      this.resultIcon.className = "result-icon draw";
      this.resultText.textContent = "It's a Draw!";
    } else {
      this.resultIcon.innerHTML = '<i class="fas fa-trophy"></i>';
      this.resultIcon.className = "result-icon win";

      if (winner === "X") {
        this.resultText.textContent = "Player X Wins!";
      } else {
        this.resultText.textContent = this.gameMode.startsWith("ai")
          ? "AI Wins!"
          : "Player O Wins!";
      }
    }

    this.resultModal.classList.add("show");
  }

  hideResult() {
    this.resultModal.classList.remove("show");
  }

  restartGame() {
    this.startGame();
  }

  playAgain() {
    this.hideResult();
    this.restartGame();
  }

  changeMode() {
    this.hideResult();
    this.showModeSelection();
  }

  showModeSelection() {
    this.gameSection.style.display = "none";
    this.gameModeSelection.style.display = "block";
    this.scores = { X: 0, O: 0, draws: 0 };
    this.updateScores();
  }

  showStats() {
    this.updateStats();
    this.statsModal.classList.add("show");
  }

  hideStats() {
    this.statsModal.classList.remove("show");
  }

  updateStats() {
    this.totalGames.textContent = this.gameStats.totalGames;
    this.playerXWins.textContent = this.gameStats.playerXWins;
    this.playerOWins.textContent = this.gameStats.playerOWins;
    this.draws.textContent = this.gameStats.draws;
  }

  updateGameStats(result) {
    this.gameStats.totalGames++;
    if (result === "X") {
      this.gameStats.playerXWins++;
    } else if (result === "O") {
      this.gameStats.playerOWins++;
    } else {
      this.gameStats.draws++;
    }
  }

  resetStats() {
    if (confirm("Are you sure you want to reset all statistics?")) {
      this.gameStats = {
        totalGames: 0,
        playerXWins: 0,
        playerOWins: 0,
        draws: 0,
      };
      this.saveStats();
      this.updateStats();
    }
  }

  loadStats() {
    const saved = localStorage.getItem("ticTacToeStats");
    return saved
      ? JSON.parse(saved)
      : { totalGames: 0, playerXWins: 0, playerOWins: 0, draws: 0 };
  }

  saveStats() {
    localStorage.setItem("ticTacToeStats", JSON.stringify(this.gameStats));
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("ticTacToeTheme", newTheme);

    const icon = this.themeToggle.querySelector("i");
    icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  loadTheme() {
    const savedTheme = localStorage.getItem("ticTacToeTheme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const icon = this.themeToggle.querySelector("i");
    icon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  handleKeyboard(e) {
    if (!this.gameActive) return;

    // Number keys 1-9 for cell selection
    const key = parseInt(e.key);
    if (key >= 1 && key <= 9) {
      const index = key - 1;
      this.makeMove(index);
    }

    // R for restart
    if (e.key.toLowerCase() === "r") {
      this.restartGame();
    }

    // S for stats
    if (e.key.toLowerCase() === "s") {
      this.showStats();
    }

    // Escape to close modals
    if (e.key === "Escape") {
      this.hideStats();
      this.hideResult();
    }
  }
}

// Initialize the game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.ticTacToeGame = new TicTacToeGame();
});

// Add some utility functions for enhanced user experience
function addCellHoverEffect() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("mouseenter", function () {
      if (
        !this.classList.contains("disabled") &&
        window.ticTacToeGame.gameActive
      ) {
        this.style.transform = "scale(1.05)";
      }
    });

    cell.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
}

// Add sound effects (optional - requires audio files)
function playSound(type) {
  // Uncomment and add audio files for sound effects
  /*
    const audio = new Audio(`sounds/${type}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed:', e));
    */
}

// Add particle effects for wins (optional enhancement)
function createWinParticles() {
  // This could be enhanced with a particle library like particles.js
  const colors = ["#667eea", "#764ba2", "#f093fb"];

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const particle = document.createElement("div");
      particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${
                  colors[Math.floor(Math.random() * colors.length)]
                };
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                animation: particle-fall 3s ease-out forwards;
            `;

      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 3000);
    }, i * 50);
  }
}

// Add CSS for particle animation
const style = document.createElement("style");
style.textContent = `
    @keyframes particle-fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
