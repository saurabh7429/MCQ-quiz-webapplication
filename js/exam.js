/* ============================================================================
   MCQ QUIZ - EXAM MODE LOGIC
   ============================================================================ */

// ============================================================================
// EXAM STATE MANAGEMENT
// ============================================================================

const examState = {
  isExamMode: false,
  timePerQuestion: 60, // seconds
  totalTimeRemaining: 0,
  timerInterval: null,
  tabSwitchCount: 0,
  maxTabSwitches: 3,
  isPageActive: true,
  isAutoSubmitted: false,
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const timerDisplay = document.getElementById('timerDisplay');
const timeRemaining = document.getElementById('timeRemaining');
const tabSwitchWarning = document.getElementById('tabSwitchWarning');
const warningMessage = document.getElementById('warningMessage');
const examAutoSubmit = document.getElementById('examAutoSubmit');

// ============================================================================
// EXAM INITIALIZATION
// ============================================================================

// Store the original initQuizMode function
const originalInitQuizMode = window.initQuizMode;

// Override initQuizMode to handle exam mode
window.initQuizMode = function(mode, questionCount = null) {
  if (mode === 'exam') {
    examState.isExamMode = true;
    examState.tabSwitchCount = 0;
    examState.isAutoSubmitted = false;
    
    // Call original function
    originalInitQuizMode.call(this, mode, questionCount);
    
    // Initialize exam features
    initExamFeatures();
  } else {
    examState.isExamMode = false;
    examState.tabSwitchCount = 0;
    
    // Call original function
    originalInitQuizMode.call(this, mode, questionCount);
  }
};

function initExamFeatures() {
  // Calculate total time
  examState.totalTimeRemaining = quizState.sessionQuestions.length * examState.timePerQuestion;
  
  // Start timer
  startExamTimer();
  
  // Setup anti-cheating measures
  setupAntiCheatMeasures();
  
  // Setup tab switch detection
  setupTabSwitchDetection();
}

// ============================================================================
// TIMER FUNCTIONALITY
// ============================================================================

function startExamTimer() {
  clearInterval(examState.timerInterval);
  
  examState.timerInterval = setInterval(() => {
    examState.totalTimeRemaining--;
    updateTimerDisplay();
    
    // Check if time is up
    if (examState.totalTimeRemaining <= 0) {
      clearInterval(examState.timerInterval);
      autoSubmitExam('Time is up! Your exam has been automatically submitted.');
    }
    
    // Show warning when less than 1 minute left
    if (examState.totalTimeRemaining <= 60 && examState.totalTimeRemaining > 0) {
      timeRemaining.parentElement.classList.add('warning');
    }
  }, 1000);
}

function updateTimerDisplay() {
  const hours = Math.floor(examState.totalTimeRemaining / 3600);
  const minutes = Math.floor((examState.totalTimeRemaining % 3600) / 60);
  const seconds = examState.totalTimeRemaining % 60;
  
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  timeRemaining.textContent = formattedTime;
}

function stopExamTimer() {
  clearInterval(examState.timerInterval);
}

// ============================================================================
// TAB SWITCH DETECTION
// ============================================================================

function setupTabSwitchDetection() {
  // Detect when user leaves the page/tab
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Also detect window/tab losing focus
  window.addEventListener('blur', handleWindowBlur);
  window.addEventListener('focus', handleWindowFocus);
}

function handleVisibilityChange() {
  if (document.hidden) {
    // User switched tabs
    examState.isPageActive = false;
    handleTabSwitch();
  } else {
    // User returned to tab
    examState.isPageActive = true;
  }
}

function handleWindowBlur() {
  if (examState.isExamMode && !examState.isAutoSubmitted) {
    handleTabSwitch();
  }
}

function handleWindowFocus() {
  // Optional: You could add logic here
}

function handleTabSwitch() {
  if (!examState.isExamMode || examState.isAutoSubmitted) return;
  
  examState.tabSwitchCount++;
  
  if (examState.tabSwitchCount >= examState.maxTabSwitches) {
    // Auto-submit exam
    autoSubmitExam('You exceeded the maximum tab switch warnings.');
  } else {
    // Show warning modal
    showTabSwitchWarning(examState.tabSwitchCount);
  }
}

function showTabSwitchWarning(count) {
  warningMessage.textContent = `You switched tabs during the exam. (Attempt ${count}/${examState.maxTabSwitches})`;
  tabSwitchWarning.classList.remove('hidden');
}

function dismissWarning() {
  tabSwitchWarning.classList.add('hidden');
}

// ============================================================================
// AUTO-SUBMIT EXAM
// ============================================================================

function autoSubmitExam(reason) {
  if (examState.isAutoSubmitted) return;
  
  examState.isAutoSubmitted = true;
  stopExamTimer();
  
  // If currently answering, submit the current answer
  if (quizState.currentQuestionIndex < quizState.sessionQuestions.length && !quizState.isAnswered) {
    // Mark remaining questions as unanswered (skip them)
    // This allows the exam to complete with current progress
  }
  
  // Auto-advance to results
  setTimeout(() => {
    showResults();
    examAutoSubmit.classList.add('hidden');
  }, 100);
}

// ============================================================================
// ANTI-CHEATING MEASURES
// ============================================================================

function setupAntiCheatMeasures() {
  // Disable right-click
  disableRightClick();
  
  // Disable copy-paste
  disableCopyPaste();
  
  // Disable long-press on mobile
  disableLongPress();
  
  // Disable developer tools (basic)
  disableDeveloperTools();
}

function disableRightClick() {
  document.addEventListener('contextmenu', (e) => {
    if (examState.isExamMode) {
      e.preventDefault();
      showAntiCheatAlert('Right-click is disabled during exam mode.');
      return false;
    }
  });
}

function disableCopyPaste() {
  const disableAction = (e) => {
    if (examState.isExamMode && (
      e.ctrlKey || e.metaKey || e.keyCode === 17 || e.keyCode === 91
    )) {
      // Ctrl+C, Ctrl+V, Ctrl+X
      if (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88) {
        e.preventDefault();
        showAntiCheatAlert('Copy and paste are disabled during exam mode.');
        return false;
      }
    }
  };
  
  document.addEventListener('keydown', disableAction);
  document.addEventListener('copy', (e) => {
    if (examState.isExamMode) {
      e.preventDefault();
      showAntiCheatAlert('Copy is disabled during exam mode.');
    }
  });
  document.addEventListener('paste', (e) => {
    if (examState.isExamMode) {
      e.preventDefault();
      showAntiCheatAlert('Paste is disabled during exam mode.');
    }
  });
  document.addEventListener('cut', (e) => {
    if (examState.isExamMode) {
      e.preventDefault();
      showAntiCheatAlert('Cut is disabled during exam mode.');
    }
  });
}

function disableLongPress() {
  let pressTimer;
  const minDuration = 300; // milliseconds
  
  document.addEventListener('touchstart', (e) => {
    if (examState.isExamMode) {
      pressTimer = setTimeout(() => {
        showAntiCheatAlert('Long-press is disabled during exam mode.');
      }, minDuration);
    }
  });
  
  document.addEventListener('touchend', () => {
    clearTimeout(pressTimer);
  });
  
  // Also prevent select/drag
  if (examState.isExamMode) {
    document.addEventListener('selectstart', (e) => {
      // Allow selection only within quiz containers
      const targetElement = e.target;
      const allowedClasses = ['question-text', 'option-btn', 'review-question'];
      
      let isAllowed = false;
      for (let className of allowedClasses) {
        if (targetElement.classList.contains(className) || 
            targetElement.closest('.' + className)) {
          isAllowed = true;
          break;
        }
      }
      
      if (!isAllowed) {
        e.preventDefault();
      }
    });
  }
}

function disableDeveloperTools() {
  // Detect F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
  document.addEventListener('keydown', (e) => {
    if (!examState.isExamMode) return;
    
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
      showAntiCheatAlert('Developer tools are disabled during exam mode.');
      return false;
    }
    
    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      showAntiCheatAlert('Developer tools are disabled during exam mode.');
      return false;
    }
    
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      showAntiCheatAlert('Developer tools are disabled during exam mode.');
      return false;
    }
    
    // Ctrl+Shift+C (Element Inspector)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
      e.preventDefault();
      showAntiCheatAlert('Developer tools are disabled during exam mode.');
      return false;
    }
  });
}

function showAntiCheatAlert(message) {
  // Show a subtle alert without interrupting the exam
  console.warn('Exam Mode Security Notice:', message);
  
  // You can enhance this with a toast notification
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #a84034;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 999;
    animation: slideUp 0.3s ease-out;
    font-size: 0.9rem;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================================================
// CLEANUP ON EXIT
// ============================================================================

window.addEventListener('beforeunload', (e) => {
  if (examState.isExamMode && !examState.isAutoSubmitted && 
      quizState.currentQuestionIndex < quizState.sessionQuestions.length) {
    e.preventDefault();
    e.returnValue = 'Your exam is not complete. Are you sure you want to leave?';
  }
});

// Cleanup when switching back to normal quiz mode
const originalBackToSetup = window.backToSetup;
window.backToSetup = function() {
  if (examState.isExamMode) {
    stopExamTimer();
    examState.isExamMode = false;
    examState.tabSwitchCount = 0;
    
    // Remove event listeners for exam mode
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleWindowBlur);
    window.removeEventListener('focus', handleWindowFocus);
    
    // Hide timer display
    document.getElementById('timerDisplay').classList.add('hidden');
  }
  
  originalBackToSetup.call(this);
};

// ============================================================================
// OVERRIDE QUIZ NAVIGATION FOR EXAM MODE
// ============================================================================

const originalSubmitAnswer = window.submitAnswer;
window.submitAnswer = function() {
  originalSubmitAnswer.call(this);
};

const originalNextQuestion = window.nextQuestion;
window.nextQuestion = function() {
  if (examState.isExamMode) {
    // Check time remaining
    if (examState.totalTimeRemaining <= 0) {
      autoSubmitExam('Time is up!');
      return;
    }
  }
  
  originalNextQuestion.call(this);
};

// ============================================================================
// RESULTS OVERRIDE FOR EXAM MODE
// ============================================================================

const originalShowResults = window.showResults;
window.showResults = function() {
  if (examState.isExamMode) {
    stopExamTimer();
    document.getElementById('timerDisplay').classList.add('hidden');
  }
  
  originalShowResults.call(this);
};
