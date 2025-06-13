const configtContainer = document.querySelector(".config-container");
const quiztContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQsnBtn = document.querySelector(".next-qsn-btn");
const qsnStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");

let correctAnswerCount = 0;
let currentQuestion = null;
let noQsns = 10;
let quizCategory = "programming";
const qsnsIndexHistory = [];
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;

//Display the quiz result and hide the quiz container
const showQuizResult = () => {
  quiztContainer.style.display = "none";
  resultContainer.style.display = "block";

  const rsultTxt = `You have answered <b>${correctAnswerCount}</b> out of <b>${noQsns}</b> questions. Great effort!`;
  document.querySelector(".result-message").innerHTML = rsultTxt;
};

// resets the timer
const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDisplay.textContent = `${currentTime}s`;
};

//Initialize and start timer for the current qsn
const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;
    if (currentTime <= 0) {
      clearInterval(timer);
      hilightCorrectAnswer();

      //changes the timer color when the time runsout
      quiztContainer.querySelector(".quiz-timer").style.background = "#c31402";

      //Disable all options after one option is selected
      answerOptions
        .querySelectorAll(".answer-option")
        .forEach((option) => (option.style.pointerEvents = "none"));
      nextQsnBtn.style.visibility = "visible";
    }
  }, 1000);
};

//Fetch random qsn based on selected category
const getRandomQuestion = () => {
  const categoryQuestions =
    questions.find(
      (cat) => cat.category.toLowerCase() === quizCategory.toLowerCase()
    ).questions || [];
  //show quiz compled if all qsns are visited
  if (qsnsIndexHistory.length >= Math.min(categoryQuestions.length, noQsns)) {
    return showQuizResult();
  }

  //Filter out already choosed qsn and choose a new one
  const availableQsns = categoryQuestions.filter(
    (_, index) => !qsnsIndexHistory.includes(index)
  );
  const randomQuestion =
    categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];

  qsnsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
  return randomQuestion;
};

//hilights the correct answer
const hilightCorrectAnswer = () => {
  const correctOption =
    answerOptions.querySelectorAll(".answer-option")[
      currentQuestion.correctAnswer
    ];
  correctOption.classList.add("correct");
  const iconHtml = `<span class="material-symbols-rounded">check_circle
</span>`;
  correctOption.insertAdjacentHTML("beforeend", iconHtml);
};

//handles the user answer selected
const handleAnswer = (option, answerIndex) => {
  clearInterval(timer);
  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "incorrect");

  !isCorrect ? hilightCorrectAnswer() : correctAnswerCount++;

  //insert icon based on correctness
  const iconHtml = `<span class="material-symbols-rounded">${
    isCorrect ? "check_circle" : "cancel"
  }
</span>`;
  option.insertAdjacentHTML("beforeend", iconHtml);

  //Disable all options after one option is selected
  answerOptions
    .querySelectorAll(".answer-option")
    .forEach((option) => (option.style.pointerEvents = "none"));
  nextQsnBtn.style.visibility = "visible";
};

//render the current question and options in the quiz
const renderQuestion = () => {
  currentQuestion = getRandomQuestion();

  if (!currentQuestion) return;
  resetTimer();
  startTimer();

  //update the UI
  answerOptions.innerHTML = "";
  nextQsnBtn.style.visibility = "hidden";
  quiztContainer.querySelector(".quiz-timer").style.background =
    "rgb(85, 110, 101)";
  document.querySelector(".question-text").textContent =
    currentQuestion.question;
  qsnStatus.innerHTML = `<b>${qsnsIndexHistory.length}</b> of <b>${noQsns}</b> Questions`;

  //craete option li elements and append them and add click event listener for answer
  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOptions.appendChild(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};

//Highlight the selected option on on-click for category or no. of qsns
document
  .querySelectorAll(".category-option, .question-option")
  .forEach((option) => {
    option.addEventListener("click", () => {
      option.parentNode.querySelector(".active").classList.remove("active");
      option.classList.add("active");
    });
  });

//start the quiz and render the random question
const starttQuiz = () => {
  configtContainer.style.display = "none";
  quiztContainer.style.display = "block";

  //Update the quiz category and no. of qsns
  noQsns = parseInt(
    configtContainer.querySelector(".question-option.active").textContent
  );
  quizCategory = configtContainer.querySelector(
    ".category-option.active"
  ).textContent;

  renderQuestion();
};

//resets the quiz and retrun to the config container
const resetQuiz = () => {
  correctAnswerCount = 0;
  resetTimer();
  qsnsIndexHistory.length = 0;
  configtContainer.style.display = "block";
  resultContainer.style.display = "none";
};

nextQsnBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", starttQuiz);
