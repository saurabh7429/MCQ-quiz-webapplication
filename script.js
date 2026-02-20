/* ================================
   MCQ Quiz App - script.js (final)
   - loads questions.json
   - shuffles questions & options each start
   - one-by-one MCQ
   - selectable option buttons (disabled after select)
   - correct -> green, wrong -> red + show correct
   - Next button disabled until answered
   - live counters (correct/wrong)
   - progress bar shows answered% and green/red split
   - Restart + Reset
   - Dark/light theme (persist)
   - Fullscreen toggle
   - Vibrate on wrong (if supported)
   ================================= */

const $ = sel => document.querySelector(sel);
const $all = sel => Array.from(document.querySelectorAll(sel));

/* ====== Elements ====== */
const elQuestion = $('#question');
const elOptions = $('#options');
const elNext = $('#nextBtn');
const elRestart = $('#restartBtn');
const elReset = $('#resetBtn');
const orderToggle = $('#orderToggle');

const elCurrentQ = $('#currentQ');
const elTotalQ = $('#totalQ');
const elLiveCorrect = $('#liveCorrect');
const elLiveWrong = $('#liveWrong');

const elProgressFill = $('#progressFill');

const elScoreboard = $('#scoreboard');
const elScoreTotal = $('#scoreTotal');
const elScoreCorrect = $('#scoreCorrect');
const elScoreWrong = $('#scoreWrong');
const elScorePercent = $('#scorePercent');

const themeToggle = $('#themeToggle');
const fullscreenBtn = $('#fullscreenBtn');

/* ====== State ====== */
let allQuestions = [];   // raw JSON
let questions = [];      // shuffled working set
let idx = 0;
let correct = 0;
let wrong = 0;
let answeredFlag = false;
// default to linear (static) order unless user enabled shuffle
let orderMode = localStorage.getItem('mcq_order') || 'static';

/* ====== Helpers ====== */
// Fisher-Yates shuffle (non-destructive)
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function safeText(t) {
  // avoid HTML injection
  const div = document.createElement('div');
  div.innerText = String(t ?? '');
  return div.innerHTML;
}

/* ====== Load questions.json ====== */
async function loadQuestions() {
  try {
    const res = await fetch('questions.json');
    if (!res.ok) throw new Error('Failed to fetch questions.json (use a server).');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('questions.json is empty or invalid.');
    }
    allQuestions = data;
    initQuiz();
  } catch (err) {
    elQuestion.innerText = 'Error loading questions.json — run via Local Server.';
    console.error(err);
  }
}

/* ====== Init / Start ====== */
function initQuiz() {
  // prepare working set according to order mode and shuffle options only
  if (orderMode === 'random') {
    questions = shuffle(allQuestions).map(q => ({
      ...q,
      options: shuffle(q.options || [])
    }));
  } else {
    // static: keep original order, but shuffle options per question
    questions = allQuestions.map(q => ({
      ...q,
      options: shuffle(q.options || [])
    }));
  }

  idx = 0;
  correct = 0;
  wrong = 0;
  answeredFlag = false;

  // UI resets
  elScoreboard.classList.add('hidden');
  $('.quiz-area').style.display = 'block';
  $('.progress-container')?.classList.remove('hidden');

  elTotalQ.innerText = questions.length;
  updateLiveCounters();
  renderQuestion();
  updateProgressUI();
}

/* ====== Render a question ====== */
function renderQuestion() {
  const q = questions[idx];
  if (!q) return showScoreboard();

  // question text
  elQuestion.innerHTML = safeText(q.question || 'No question');

  // options
  elOptions.innerHTML = '';
  q.options.forEach(opt => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'option';
    b.setAttribute('role', 'option');
    b.setAttribute('tabindex', '-1');
    b.innerHTML = safeText(opt);
    b.style.transform = 'scale(0.98)';
    b.style.opacity = '0';
    // small entrance
    setTimeout(() => {
      b.style.transition = 'transform .14s ease, opacity .18s ease';
      b.style.transform = 'scale(1)';
      b.style.opacity = '1';
    }, 40);

    b.addEventListener('click', () => chooseOption(b, opt));
    elOptions.appendChild(b);
  });

  // accessibility: mark options container and set first option tabbable
  elOptions.setAttribute('role', 'listbox');
  elOptions.setAttribute('aria-label', 'Answer options');
  const firstBtn = elOptions.querySelector('button');
  if (firstBtn) firstBtn.setAttribute('tabindex', '0');

  elCurrentQ.innerText = idx + 1;
  elNext.disabled = true;
  answeredFlag = false;
  // scroll into view on mobile
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
}

/* ====== When user chooses an option ====== */
function chooseOption(btn, selected) {
  if (answeredFlag) return;
  answeredFlag = true;

  // disable all option buttons
  const btns = $all('#options button');
  btns.forEach(b => b.disabled = true);
  // update aria-disabled
  btns.forEach(b => b.setAttribute('aria-disabled', 'true'));

  const correctAnswer = questions[idx].answer;

  if (selected === correctAnswer) {
    btn.classList.add('correct');
    btn.setAttribute('aria-selected', 'true');
    correct++;
    // tiny pop
    btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }], { duration: 200 });
  } else {
    btn.classList.add('wrong');
    btn.setAttribute('aria-selected', 'true');
    wrong++;
    // show correct
    const found = btns.find(b => b.innerText.trim() === String(correctAnswer).trim());
    if (found) found.classList.add('correct');
    // vibrate if supported
    if (navigator.vibrate) navigator.vibrate(160);
    // shake animation on wrong selected
    btn.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 });
  }

  updateLiveCounters();
  updateProgressUI();

  // enable next
  elNext.disabled = false;
}

/* ====== Order toggle (static vs random) ====== */
function loadOrderToggle() {
  if (!orderToggle) return;
  orderToggle.innerText = orderMode === 'random' ? 'Shuffle: On' : 'Shuffle: Off';
  orderToggle.setAttribute('aria-pressed', orderMode === 'random' ? 'true' : 'false');
  orderToggle.addEventListener('click', () => {
    orderMode = orderMode === 'random' ? 'static' : 'random';
    localStorage.setItem('mcq_order', orderMode);
    loadOrderToggle();
    // re-init quiz to apply new mode
    initQuiz();
  });
}

/* ====== Keyboard & focus management for options ====== */
function focusOptionAt(offset) {
  const opts = $all('#options button');
  if (opts.length === 0) return;
  const active = document.activeElement;
  let i = opts.indexOf(active);
  if (i === -1) i = 0;
  let ni = i + offset;
  if (ni < 0) ni = 0;
  if (ni >= opts.length) ni = opts.length - 1;
  opts.forEach((b, idx) => b.setAttribute('tabindex', idx === ni ? '0' : '-1'));
  opts[ni].focus();
}

document.addEventListener('keydown', (ev) => {
  const active = document.activeElement;
  if (!active) return;
  // only intercept when focus is inside options container
  if (!document.querySelector('#options')?.contains(active)) return;

  if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') {
    ev.preventDefault();
    focusOptionAt(1);
  } else if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') {
    ev.preventDefault();
    focusOptionAt(-1);
  } else if (ev.key === 'Home') {
    ev.preventDefault();
    const opts = $all('#options button');
    opts.forEach((b, idx) => b.setAttribute('tabindex', idx === 0 ? '0' : '-1'));
    opts[0].focus();
  } else if (ev.key === 'End') {
    ev.preventDefault();
    const opts = $all('#options button');
    const last = opts.length - 1;
    opts.forEach((b, idx) => b.setAttribute('tabindex', idx === last ? '0' : '-1'));
    opts[last].focus();
  } else if (ev.key === ' ' || ev.key === 'Enter') {
    // space or enter activates the focused option
    if (active && active.tagName === 'BUTTON' && active.closest('#options')) {
      ev.preventDefault();
      active.click();
    }
  }
});

/* ====== Next question handler ====== */
elNext.addEventListener('click', () => {
  idx++;
  if (idx < questions.length) {
    renderQuestion();
  } else {
    showScoreboard();
  }
});

/* ====== Progress UI (answered %, and green/red split inside filled area) ====== */
function updateProgressUI() {
  const total = questions.length || 1;
  const answered = correct + wrong;
  const answeredPct = Math.round((answered / total) * 100);
  // fill width = answered percent
  elProgressFill.style.width = `${answeredPct}%`;
  elProgressFill.style.transition = 'width 320ms ease';

  // inside fill show split: compute proportions within answered area
  if (answered === 0) {
    elProgressFill.style.background = 'var(--primary)';
  } else {
    const greenPortion = Math.round((correct / answered) * 100); // % of filled area
    // gradient left = greenPortion% green, remainder red
    elProgressFill.style.background = `linear-gradient(90deg, var(--correct) 0% ${greenPortion}%, var(--wrong) ${greenPortion}% 100%)`;
  }
}

/* ====== Live counters UI ====== */
function updateLiveCounters() {
  elLiveCorrect.innerText = correct;
  elLiveWrong.innerText = wrong;
}

/* ====== Scoreboard (end) ====== */
function showScoreboard() {
  $('.quiz-area').style.display = 'none';
  elScoreboard.classList.remove('hidden');

  const total = questions.length;
  const pct = total ? Math.round((correct / total) * 100) : 0;

  elScoreTotal.innerText = total;
  elScoreCorrect.innerText = correct;
  elScoreWrong.innerText = wrong;
  elScorePercent.innerText = pct + '%';

  // make progress show full and split final
  elProgressFill.style.width = '100%';
  if (total > 0) {
    const greenPortion = Math.round((correct / total) * 100);
    elProgressFill.style.background = `linear-gradient(90deg, var(--correct) 0% ${greenPortion}%, var(--wrong) ${greenPortion}% 100%)`;
  }
  // scroll scoreboard into view for mobile
  setTimeout(() => elScoreboard.scrollIntoView({ behavior: 'smooth' }), 120);
}

/* ====== Restart vs Reset ====== */
/* Restart: start again with same shuffled order (we'll reshuffle for extra randomness) */
elRestart.addEventListener('click', () => {
  questions = shuffle(questions);
  idx = 0;
  correct = 0;
  wrong = 0;
  elScoreboard.classList.add('hidden');
  $('.quiz-area').style.display = 'block';
  renderQuestion();
  updateLiveCounters();
  updateProgressUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Reset: full reset to a brand new shuffle from original file */
elReset.addEventListener('click', () => {
  // quick UX confirm
  if (!confirm('Reset quiz: shuffle everything and clear your progress?')) return;
  initQuiz(); // load from allQuestions (which we keep)
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ====== Theme toggle (persist) ====== */
function loadTheme() {
  const t = localStorage.getItem('mcq_theme') || 'light';
  if (t === 'dark') document.documentElement.classList.add('dark');
  themeToggle.innerText = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('mcq_theme', isDark ? 'dark' : 'light');
  themeToggle.innerText = isDark ? '☀️' : '🌙';
});

/* ====== Fullscreen toggle ====== */
let isFs = false;
fullscreenBtn.addEventListener('click', async () => {
  try {
    if (!isFs) {
      await document.documentElement.requestFullscreen();
      isFs = true;
      fullscreenBtn.innerText = '🡽';
    } else {
      await document.exitFullscreen();
      isFs = false;
      fullscreenBtn.innerText = '⛶';
    }
  } catch (e) {
    console.warn('Fullscreen error', e);
  }
});

/* ====== Keyboard: Enter for next when enabled ====== */
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter' && !elNext.disabled) elNext.click();
});

/* ====== Init on DOM ready ====== */
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  loadOrderToggle();
  loadQuestions();
});
