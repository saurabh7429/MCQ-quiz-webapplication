/* ============================================================================
   MCQ QUIZ - CORE QUIZ LOGIC
   ============================================================================ */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const quizState = {
  allQuestions: [],
  sessionQuestions: [],
  currentQuestionIndex: 0,
  selectedAnswer: null,
  responses: [],
  score: 0,
  quizMode: null, // 'all', 'select', 'exam'
  isAnswered: false,
  correctCount: 0,
  incorrectCount: 0,
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const setupScreen = document.getElementById('setupScreen');
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');

const selectQuestionsPanel = document.getElementById('selectQuestionsPanel');
const examQuestionsPanel = document.getElementById('examQuestionsPanel');

const quizTitle = document.getElementById('quizTitle');
const questionText = document.getElementById('questionText');
const questionNumber = document.getElementById('questionNumber');
const questionCategory = document.getElementById('questionCategory');
const optionsGrid = document.getElementById('optionsGrid');
const nextBtn = document.getElementById('nextBtn');
const feedbackMessage = document.getElementById('feedbackMessage');
const feedbackText = document.getElementById('feedbackText');

const questionCounter = document.getElementById('questionCounter');
const scoreDisplay = document.getElementById('scoreDisplay');
const progressCorrect = document.getElementById('progressCorrect');
const progressIncorrect = document.getElementById('progressIncorrect');

const learnQuestionText = document.getElementById('learnQuestionText');
const learnQuestionNumber = document.getElementById('learnQuestionNumber');
const learnQuestionCategory = document.getElementById('learnQuestionCategory');
const learnOptionsGrid = document.getElementById('learnOptionsGrid');
const learnQuestionCounter = document.getElementById('learnQuestionCounter');
const learnPrevBtn = document.getElementById('learnPrevBtn');
const learnNextBtn = document.getElementById('learnNextBtn');

const percentageScore = document.getElementById('percentageScore');
const scoreMessage = document.getElementById('scoreMessage');
const totalQuestionsDisplay = document.getElementById('totalQuestionsDisplay');
const correctCountDisplay = document.getElementById('correctCountDisplay');
const incorrectCountDisplay = document.getElementById('incorrectCountDisplay');
const accuracyDisplay = document.getElementById('accuracyDisplay');
const reviewContainer = document.getElementById('reviewContainer');

// ============================================================================
// LEARN MODE STATE
// ============================================================================

const learnState = {
  currentIndex: 0,
  sessionQuestions: [],
};

// ============================================================================
// INITIALIZATION
// ============================================================================

// Load questions from JSON file when the page loads
window.addEventListener('load', loadQuestionsFromFile);

function loadQuestionsFromFile() {
  fetch('./questions.json', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('Failed to load questions.json');
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Questions data is not an array');
      quizState.allQuestions = data.filter(q => 
        q.question && Array.isArray(q.options) && q.answer
      );
      console.log(`Loaded ${quizState.allQuestions.length} questions`);
    })
    .catch(error => {
      console.error('Error loading questions:', error);
      alert('Failed to load questions. Make sure questions.json exists and is valid. Serve the folder through a local server (not file://)');
    });
}

// ============================================================================
// SCREEN MANAGEMENT
// ============================================================================

function showScreen(screenName) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenName).classList.add('active');
}

function backToSetup() {
  quizState.currentQuestionIndex = 0;
  quizState.selectedAnswer = null;
  quizState.isAnswered = false;
  quizState.responses = [];
  quizState.score = 0;
  showScreen('setupScreen');
}

// ============================================================================
// MODE SELECTION AND SETUP
// ============================================================================

function showSelectMode() {
  selectQuestionsPanel.classList.remove('hidden');
}

function showExamMode() {
  examQuestionsPanel.classList.remove('hidden');
}

function backToModes() {
  selectQuestionsPanel.classList.add('hidden');
  examQuestionsPanel.classList.add('hidden');
}

function setQuestionCount(count) {
  if (count === null) {
    const customValue = parseInt(document.getElementById('customCount').value);
    if (isNaN(customValue) || customValue < 1) {
      alert('Please enter a valid number');
      return;
    }
    count = customValue;
  }
  
  const maxQuestions = quizState.allQuestions.length;
  if (count > maxQuestions) {
    alert(`Maximum ${maxQuestions} questions available`);
    return;
  }
  
  initQuizMode('select', count);
}

function setExamQuestionCount(count) {
  if (count === null) {
    const customValue = parseInt(document.getElementById('customExamCount').value);
    if (isNaN(customValue) || customValue < 1) {
      alert('Please enter a valid number');
      return;
    }
    count = customValue;
  }
  
  const maxQuestions = quizState.allQuestions.length;
  if (count > maxQuestions) {
    alert(`Maximum ${maxQuestions} questions available`);
    return;
  }
  
  initQuizMode('exam', count);
}

// ============================================================================
// QUIZ INITIALIZATION
// ============================================================================

function initQuizMode(mode, questionCount = null) {
  if (quizState.allQuestions.length === 0) {
    alert('No questions loaded. Please reload the page.');
    return;
  }

  quizState.quizMode = mode;
  quizState.currentQuestionIndex = 0;
  quizState.selectedAnswer = null;
  quizState.isAnswered = false;
  quizState.responses = [];
  quizState.score = 0;
  quizState.correctCount = 0;
  quizState.incorrectCount = 0;

  // Select questions based on mode
  if (mode === 'all') {
    quizState.sessionQuestions = [...quizState.allQuestions];
    quizTitle.textContent = 'Quiz - All Questions';
  } else if (mode === 'select') {
    const count = Math.min(questionCount, quizState.allQuestions.length);
    quizState.sessionQuestions = shuffleArray(quizState.allQuestions).slice(0, count);
    quizTitle.textContent = `Quiz - ${count} Questions`;
  } else if (mode === 'exam') {
    const count = Math.min(questionCount, quizState.allQuestions.length);
    quizState.sessionQuestions = shuffleArray(quizState.allQuestions).slice(0, count);
    quizTitle.textContent = `Exam - ${count} Questions`;
    document.getElementById('timerDisplay').classList.remove('hidden');
  }

  // Close selection panels
  selectQuestionsPanel.classList.add('hidden');
  examQuestionsPanel.classList.add('hidden');

  // Start quiz
  displayQuestion();
  showScreen('quizScreen');
}

// ============================================================================
// QUESTION DISPLAY AND MANAGEMENT
// ============================================================================

function displayQuestion() {
  const question = quizState.sessionQuestions[quizState.currentQuestionIndex];
  
  if (!question) {
    showResults();
    return;
  }

  // Reset state for new question
  quizState.selectedAnswer = null;
  quizState.isAnswered = false;
  nextBtn.classList.add('hidden');
  feedbackMessage.classList.add('hidden');
  feedbackText.innerHTML = '';

  // Update question display
  questionNumber.textContent = `Question ${quizState.currentQuestionIndex + 1}`;
  questionText.textContent = question.question;
  questionCategory.textContent = question.category || '';

  // Display options
  optionsGrid.innerHTML = '';
  question.options.forEach((option, index) => {
    const optionBtn = document.createElement('button');
    optionBtn.className = 'option-btn';
    optionBtn.textContent = option;
    optionBtn.setAttribute('data-index', index);
    optionBtn.onclick = () => selectOption(optionBtn, option);
    optionsGrid.appendChild(optionBtn);
  });

  // Update counter and progress
  updateProgress();
}

function selectOption(buttonElement, optionText) {
  if (quizState.isAnswered) return;

  quizState.isAnswered = true;
  const question = quizState.sessionQuestions[quizState.currentQuestionIndex];
  const isCorrect = optionText === question.answer;

  // Update score
  if (isCorrect) {
    quizState.correctCount++;
    quizState.score++;
  } else {
    quizState.incorrectCount++;
  }

  // Record response
  quizState.responses.push({
    question: question.question,
    selectedAnswer: optionText,
    correctAnswer: question.answer,
    isCorrect: isCorrect,
  });

  // Highlight all options with correct answer in green, selected wrong in red
  const optionButtons = document.querySelectorAll('.option-btn');
  optionButtons.forEach(btn => {
    btn.disabled = true;
    
    if (btn.textContent === question.answer) {
      btn.classList.add('correct');
    } else if (btn === buttonElement && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });

  // Show feedback
  showFeedback(isCorrect, question.answer);
  
  // Update progress
  updateProgress();
  
  // Show next button
  nextBtn.classList.remove('hidden');
  nextBtn.textContent = 
    quizState.currentQuestionIndex === quizState.sessionQuestions.length - 1 
      ? 'View Results' 
      : 'Next Question';
}

function showFeedback(isCorrect, correctAnswer) {
  feedbackMessage.classList.remove('hidden', 'correct', 'incorrect');
  
  if (isCorrect) {
    feedbackMessage.classList.add('correct');
    feedbackText.textContent = '✓ Correct! Well done!';
  } else {
    feedbackMessage.classList.add('incorrect');
    feedbackText.textContent = `✗ Incorrect. The correct answer is: ${correctAnswer}`;
  }
}

function nextQuestion() {
  quizState.currentQuestionIndex++;
  
  if (quizState.currentQuestionIndex >= quizState.sessionQuestions.length) {
    showResults();
  } else {
    displayQuestion();
  }
}

function restartQuiz() {
  initQuizMode(quizState.quizMode, quizState.sessionQuestions.length);
}

function retakeWithDifferent() {
  initQuizMode(quizState.quizMode, quizState.sessionQuestions.length);
}

// ============================================================================
// PROGRESS AND SCORING
// ============================================================================

function updateProgress() {
  const total = quizState.sessionQuestions.length;
  const correct = quizState.correctCount;
  const incorrect = quizState.incorrectCount;
  const answered = correct + incorrect;

  // Update progress bar (2-color)
  const correctPercent = (correct / total) * 100;
  const incorrectPercent = (incorrect / total) * 100;

  progressCorrect.style.flex = `0 0 ${correctPercent}%`;
  progressIncorrect.style.flex = `0 0 ${incorrectPercent}%`;

  // Update text counters
  questionCounter.textContent = `${answered}/${total}`;
  scoreDisplay.textContent = `Score: ${quizState.score}/${total}`;
}

// ============================================================================
// RESULTS DISPLAY
// ============================================================================

function showResults() {
  const total = quizState.sessionQuestions.length;
  const correct = quizState.correctCount;
  const incorrect = quizState.incorrectCount;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Calculate score message
  let message = '';
  if (percentage === 100) {
    message = '🎉 Perfect Score! Excellent work!';
  } else if (percentage >= 80) {
    message = '🌟 Great job! You did very well!';
  } else if (percentage >= 60) {
    message = '👍 Good effort! Keep practicing!';
  } else if (percentage >= 40) {
    message = '💪 Keep practicing! You\'ll improve!';
  } else {
    message = '📚 Review the material and try again!';
  }

  // Update results display
  percentageScore.textContent = `${percentage}%`;
  scoreMessage.textContent = message;
  totalQuestionsDisplay.textContent = total;
  correctCountDisplay.textContent = correct;
  incorrectCountDisplay.textContent = incorrect;
  accuracyDisplay.textContent = `${percentage}%`;

  // Display review section
  displayReviewSection();

  showScreen('resultsScreen');
}

function displayReviewSection() {
  reviewContainer.innerHTML = '';

  quizState.responses.forEach((response, index) => {
    const reviewItem = document.createElement('div');
    reviewItem.className = `review-item ${response.isCorrect ? 'correct' : 'incorrect'}`;

    const header = document.createElement('div');
    header.className = 'review-item-header';

    const badge = document.createElement('span');
    badge.className = `review-badge ${response.isCorrect ? 'correct' : 'incorrect'}`;
    badge.textContent = response.isCorrect ? '✓ Correct' : '✗ Incorrect';

    const questionNum = document.createElement('span');
    questionNum.textContent = `Q${index + 1}`;

    header.appendChild(badge);
    header.appendChild(questionNum);

    const questionDiv = document.createElement('p');
    questionDiv.className = 'review-question';
    questionDiv.textContent = response.question;

    const answerDiv = document.createElement('div');
    
    if (!response.isCorrect) {
      const userAnswerP = document.createElement('p');
      userAnswerP.className = 'review-answer user-answer';
      userAnswerP.textContent = `Your answer: ${response.selectedAnswer}`;
      answerDiv.appendChild(userAnswerP);
    }

    const correctAnswerP = document.createElement('p');
    correctAnswerP.className = 'review-answer correct-answer';
    correctAnswerP.textContent = `Correct answer: ${response.correctAnswer}`;
    answerDiv.appendChild(correctAnswerP);

    reviewItem.appendChild(header);
    reviewItem.appendChild(questionDiv);
    reviewItem.appendChild(answerDiv);

    reviewContainer.appendChild(reviewItem);
  });
}

// ============================================================================
// EXIT AND NAVIGATION
// ============================================================================

function confirmExit() {
  if (confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
    backToSetup();
  }
}

function toggleFullscreen() {
  document.body.classList.toggle('fullscreen');
  
  if (document.body.classList.contains('fullscreen')) {
    document.documentElement.requestFullscreen?.().catch(err => {
      console.log('Fullscreen not available:', err);
    });
  } else {
    document.exitFullscreen?.().catch(err => {
      console.log('Exit fullscreen error:', err);
    });
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// LEARN MODE FUNCTIONS
// ============================================================================

function initLearnMode(count) {
  if (quizState.allQuestions.length === 0) {
    alert('No questions loaded. Please reload the page.');
    return;
  }

  learnState.currentIndex = 0;
  
  if (count === 'all') {
    learnState.sessionQuestions = [...quizState.allQuestions];
  } else {
    const maxQuestions = quizState.allQuestions.length;
    const actualCount = Math.min(count, maxQuestions);
    learnState.sessionQuestions = shuffleArray(quizState.allQuestions).slice(0, actualCount);
  }

  displayLearnQuestion();
  showScreen('learnScreen');
}

function displayLearnQuestion() {
  const question = learnState.sessionQuestions[learnState.currentIndex];
  
  if (!question) return;

  // Update question display
  learnQuestionNumber.textContent = `Question ${learnState.currentIndex + 1}`;
  learnQuestionText.textContent = question.question;
  learnQuestionCategory.textContent = question.category || '';

  // Display options with correct answer pre-selected (highlighted)
  learnOptionsGrid.innerHTML = '';
  question.options.forEach((option, index) => {
    const optionBtn = document.createElement('button');
    optionBtn.className = 'option-btn learn-option';
    if (option === question.answer) {
      optionBtn.classList.add('correct');
    }
    optionBtn.textContent = option;
    optionBtn.disabled = true; // Read-only
    learnOptionsGrid.appendChild(optionBtn);
  });

  // Update counter
  learnQuestionCounter.textContent = `${learnState.currentIndex + 1}/${learnState.sessionQuestions.length}`;

  // Update button visibility
  learnPrevBtn.disabled = learnState.currentIndex === 0;
  learnNextBtn.disabled = learnState.currentIndex === learnState.sessionQuestions.length - 1;
}

function nextLearnQuestion() {
  if (learnState.currentIndex < learnState.sessionQuestions.length - 1) {
    learnState.currentIndex++;
    displayLearnQuestion();
  }
}

function previousLearnQuestion() {
  if (learnState.currentIndex > 0) {
    learnState.currentIndex--;
    displayLearnQuestion();
  }
}
