const API_URL = "https://opentdb.com/api.php?amount=10&type=multiple";

// Screens
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

// Elements
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers");
const progressBar = document.getElementById("progress-bar");
const progressCount = document.getElementById("progress-count");
const scoreText = document.getElementById("score-text");

// State
let questions = [];
let current = 0;
let score = 0;

// Fetch Questions
async function fetchQuestions() {
  questionText.textContent = "Loading questions... ⏳";
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    questions = data.results.map(q => ({
      question: decodeHTML(q.question),
      answers: shuffle([...q.incorrect_answers, q.correct_answer].map(decodeHTML)),
      correct: decodeHTML(q.correct_answer)
    }));
    current = 0;
    score = 0;
    showScreen("quiz");
    showQuestion();
  } catch (err) {
    questionText.textContent = "Error loading questions 😢";
  }
}

function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove("active"));
  if (screen === "start") startScreen.classList.add("active");
  if (screen === "quiz") quizScreen.classList.add("active");
  if (screen === "result") resultScreen.classList.add("active");
}

function showQuestion() {
  resetState();
  const q = questions[current];
  questionText.textContent = q.question;
  progressCount.textContent = `Question ${current + 1} of ${questions.length}`;
  progressBar.style.width = `${(current / questions.length) * 100}%`;

  q.answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.classList.add("answer");
    btn.textContent = ans;
    btn.onclick = () => selectAnswer(btn, q.correct);
    answersContainer.appendChild(btn);
  });
}

function resetState() {
  answersContainer.innerHTML = "";
  nextBtn.disabled = true;
}

function selectAnswer(button, correct) {
  const isCorrect = button.textContent === correct;
  if (isCorrect) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
  }
  Array.from(answersContainer.children).forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add("correct");
  });
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  progressBar.style.width = "100%";
  scoreText.textContent = `You scored ${score} / ${questions.length}! 🎉`;
  showScreen("result");
}

restartBtn.addEventListener("click", () => {
  fetchQuestions();
});

startBtn.addEventListener("click", () => {
  fetchQuestions();
});

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

showScreen("start");
