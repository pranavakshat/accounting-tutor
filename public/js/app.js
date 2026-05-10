// ============================================================
// Accounting Exam Prep — Main Application Controller
// ============================================================

var CHAPTERS = [
  { id: 'ch1',  module: 'CH1',  num: 1  },
  { id: 'ch6',  module: 'CH6',  num: 6  },
  { id: 'ch7',  module: 'CH7',  num: 7  },
  { id: 'ch8',  module: 'CH8',  num: 8  },
  { id: 'ch9',  module: 'CH9',  num: 9  },
  { id: 'ch10', module: 'CH10', num: 10 }
];

// ---- State ----
var currentChapterId = null;
var currentQuestionSet = null;   // result of chapter.generate()
var currentQIdx = 0;             // index into questions[]
var currentStepIdx = 0;          // step within current question
var wrongAttempts = {};          // "qIdx_stepIdx" -> count
var completedAnswers = [];       // { title, result } for answer sheet
var testState = null;            // active test session

// ---- Helpers ----
function $(id) { return document.getElementById(id); }

function showView(id) {
  document.querySelectorAll('.view').forEach(function(v) { v.style.display = 'none'; });
  $(id).style.display = 'block';
}

function setActiveNav(chapterId) {
  document.querySelectorAll('.nav-ch').forEach(function(el) { el.classList.remove('active'); });
  if (chapterId) {
    var el = document.querySelector('[data-navch="' + chapterId + '"]');
    if (el) el.classList.add('active');
  }
}

function chapterModule(chId) {
  var ch = CHAPTERS.find(function(c) { return c.id === chId; });
  return ch ? window[ch.module] : null;
}

// ---- Dashboard ----
function renderDashboard() {
  showView('view-dashboard');
  setActiveNav(null);

  // Overall progress
  var pct = Progress.getOverallPct();
  $('dash-overall-pct').textContent = pct + '%';
  $('dash-overall-bar').style.width = pct + '%';

  // Chapter cards
  var grid = $('dash-chapter-grid');
  grid.innerHTML = '';
  CHAPTERS.forEach(function(ch) {
    var mod = window[ch.module];
    if (!mod) return;
    var data = Progress.getChapterData(ch.id);
    var chPct = data.total === 0 ? 0 : Math.round((data.completed / data.total) * 100);
    var card = document.createElement('div');
    card.className = 'chapter-card';
    card.innerHTML =
      '<div class="chapter-card-header">' +
        '<span class="chapter-num">Ch ' + ch.num + '</span>' +
        '<span class="chapter-pct">' + chPct + '%</span>' +
      '</div>' +
      '<div class="chapter-title">' + mod.title + '</div>' +
      '<div class="chapter-desc">' + mod.description + '</div>' +
      '<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:' + chPct + '%"></div></div>' +
      '<div class="chapter-progress-label">' + data.completed + ' / ' + data.total + ' questions mastered</div>' +
      '<button class="btn-practice" data-ch="' + ch.id + '">Practice</button>';
    grid.appendChild(card);
  });

  document.querySelectorAll('.btn-practice').forEach(function(btn) {
    btn.addEventListener('click', function() {
      startChapter(btn.dataset.ch);
    });
  });
}

// ---- Chapter Practice ----
function startChapter(chId) {
  var mod = chapterModule(chId);
  if (!mod) return;

  currentChapterId = chId;
  currentQuestionSet = mod.generate();
  currentQIdx = 0;
  currentStepIdx = 0;
  wrongAttempts = {};
  completedAnswers = [];

  setActiveNav(chId);
  showView('view-chapter');

  $('ch-title').textContent = mod.title;
  $('ch-desc').textContent = mod.description;

  // Formulas
  var fList = $('ch-formulas-list');
  fList.innerHTML = mod.formulas.map(function(f) { return '<li>' + f + '</li>'; }).join('');

  // Data table
  renderDataTable();

  // Render first question
  renderCurrentQuestion();
  updateAnswerSheet();
  updateChapterProgress();
}

function renderDataTable() {
  var dt = $('ch-data-table');
  if (!currentQuestionSet.dataTable || currentQuestionSet.dataTable.length === 0) {
    $('ch-data-section').style.display = 'none';
    return;
  }
  $('ch-data-section').style.display = 'block';
  dt.innerHTML = currentQuestionSet.dataTable.map(function(row) {
    return '<tr><td class="data-label">' + row[0] + '</td><td class="data-value">' + row[1] + '</td></tr>';
  }).join('');
}

function updateChapterProgress() {
  var qs = currentQuestionSet.questions;
  var totalSteps = qs.reduce(function(acc, q) { return acc + q.steps.length; }, 0);
  var doneSteps = completedAnswers.length;
  var pct = totalSteps === 0 ? 0 : Math.round((doneSteps / totalSteps) * 100);
  $('ch-progress-label').textContent = 'Step ' + doneSteps + ' of ' + totalSteps;
  $('ch-progress-bar').style.width = pct + '%';
}

function renderCurrentQuestion() {
  var qs = currentQuestionSet.questions;
  if (currentQIdx >= qs.length) {
    showChapterComplete();
    return;
  }

  var q = qs[currentQIdx];
  var area = $('ch-question-area');
  area.innerHTML = '';

  // Question title
  var qtitle = document.createElement('div');
  qtitle.className = 'q-title';
  qtitle.textContent = q.title;
  area.appendChild(qtitle);

  // Render steps — only up to and including currentStepIdx
  q.steps.forEach(function(step, si) {
    var stepEl = document.createElement('div');
    stepEl.className = 'step-block';
    stepEl.id = 'step-' + currentQIdx + '-' + si;

    if (si < currentStepIdx) {
      // Completed step — show summary
      stepEl.classList.add('step-done');
      stepEl.innerHTML =
        '<div class="step-done-label">&#10003; ' + step.result + '</div>';
    } else if (si === currentStepIdx) {
      // Active step
      renderActiveStep(stepEl, step, currentQIdx, si);
    } else {
      // Locked step
      stepEl.classList.add('step-locked');
      stepEl.innerHTML = '<div class="step-locked-label">Step ' + (si + 1) + ' — complete previous step first</div>';
    }

    area.appendChild(stepEl);
  });

  // Scroll to active step
  var activeStep = document.getElementById('step-' + currentQIdx + '-' + currentStepIdx);
  if (activeStep) {
    setTimeout(function() { activeStep.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
  }
}

function renderActiveStep(stepEl, step, qIdx, stepIdx) {
  var attemptKey = qIdx + '_' + stepIdx;
  if (!wrongAttempts[attemptKey]) wrongAttempts[attemptKey] = 0;

  // Instruction
  var inst = document.createElement('div');
  inst.className = 'step-inst';
  inst.textContent = step.inst;
  stepEl.appendChild(inst);

  // Hint buttons row
  var hintRow = document.createElement('div');
  hintRow.className = 'hint-row';

  var hintBtn = document.createElement('button');
  hintBtn.className = 'btn-hint';
  hintBtn.innerHTML = '&#128269; Formula hint';
  hintBtn.addEventListener('click', function() {
    var existing = stepEl.querySelector('.hint-formula');
    if (existing) { existing.remove(); return; }
    var hEl = document.createElement('div');
    hEl.className = 'hint-formula';
    hEl.innerHTML = '<strong>Formula:</strong> ' + step.formula;
    stepEl.insertBefore(hEl, stepEl.querySelector('.answer-buttons'));
  });

  var numBtn = document.createElement('button');
  numBtn.className = 'btn-hint btn-hint-num';
  numBtn.innerHTML = '&#128290; Number hint';
  numBtn.addEventListener('click', function() {
    var existing = stepEl.querySelector('.hint-numbers');
    if (existing) { existing.remove(); return; }
    var hEl = document.createElement('div');
    hEl.className = 'hint-numbers';
    hEl.innerHTML = '<strong>Numbers to use:</strong> ' + step.numbers;
    stepEl.insertBefore(hEl, stepEl.querySelector('.answer-buttons'));
  });

  hintRow.appendChild(hintBtn);
  hintRow.appendChild(numBtn);
  stepEl.appendChild(hintRow);

  // Answer buttons
  var btnWrap = document.createElement('div');
  btnWrap.className = 'answer-buttons';

  step.choices.forEach(function(choice, ci) {
    var btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = choice;
    btn.addEventListener('click', function() {
      handleAnswer(btn, ci === step.correct, qIdx, stepIdx, step, stepEl, btnWrap);
    });
    btnWrap.appendChild(btn);
  });

  stepEl.appendChild(btnWrap);

  // Feedback area
  var feedbackEl = document.createElement('div');
  feedbackEl.className = 'feedback-area';
  feedbackEl.id = 'feedback-' + qIdx + '-' + stepIdx;
  stepEl.appendChild(feedbackEl);
}

function handleAnswer(btn, isCorrect, qIdx, stepIdx, step, stepEl, btnWrap) {
  var attemptKey = qIdx + '_' + stepIdx;
  if (!wrongAttempts[attemptKey]) wrongAttempts[attemptKey] = 0;

  // Disable all buttons during feedback
  btnWrap.querySelectorAll('.answer-btn').forEach(function(b) { b.disabled = true; });

  if (isCorrect) {
    btn.classList.add('answer-correct');
    showFeedback(stepEl, '&#10003; ' + step.exp, 'success');
    wrongAttempts[attemptKey] = 0;

    // Track progress
    completedAnswers.push({ title: step.result || step.inst.substring(0, 50), result: step.result });
    Progress.markCorrect(currentChapterId, qIdx);
    updateAnswerSheet();
    updateChapterProgress();

    setTimeout(function() { advanceStep(); }, 1200);
  } else {
    wrongAttempts[attemptKey]++;
    btn.classList.add('answer-wrong');
    Progress.markAttempt(currentChapterId, qIdx);

    if (wrongAttempts[attemptKey] >= 2) {
      showBreakdown(stepEl, step);
      setTimeout(function() { resetButtons(btnWrap); }, 1600);
    } else {
      showFeedback(stepEl, 'Not quite — try again.', 'error');
      setTimeout(function() { resetButtons(btnWrap); }, 1000);
    }
  }
}

function showFeedback(stepEl, msg, type) {
  var fb = stepEl.querySelector('.feedback-area');
  if (!fb) return;
  fb.innerHTML = '<div class="feedback-' + type + '">' + msg + '</div>';
}

function showBreakdown(stepEl, step) {
  // Remove any existing breakdown
  var existing = stepEl.querySelector('.step-breakdown');
  if (existing) existing.remove();

  var bd = document.createElement('div');
  bd.className = 'step-breakdown';
  bd.innerHTML =
    '<p class="breakdown-title">Here\'s how to solve this:</p>' +
    '<p><strong>Formula:</strong> ' + step.formula + '</p>' +
    '<p><strong>Numbers to use:</strong> ' + step.numbers + '</p>' +
    '<p><strong>Calculation:</strong> ' + step.exp + '</p>';
  stepEl.appendChild(bd);
}

function resetButtons(btnWrap) {
  btnWrap.querySelectorAll('.answer-btn').forEach(function(b) {
    b.disabled = false;
    b.classList.remove('answer-correct', 'answer-wrong');
  });
  // Clear feedback text but keep breakdown
  var fb = btnWrap.parentElement && btnWrap.parentElement.querySelector('.feedback-area');
  if (fb) fb.innerHTML = '';
}

function advanceStep() {
  var qs = currentQuestionSet.questions;
  var q = qs[currentQIdx];
  currentStepIdx++;

  if (currentStepIdx >= q.steps.length) {
    // Move to next question
    currentQIdx++;
    currentStepIdx = 0;
    if (currentQIdx >= qs.length) {
      showChapterComplete();
      return;
    }
  }

  renderCurrentQuestion();
}

function showChapterComplete() {
  var area = $('ch-question-area');
  var mod = chapterModule(currentChapterId);
  var totalSteps = currentQuestionSet.questions.reduce(function(acc, q) { return acc + q.steps.length; }, 0);

  area.innerHTML =
    '<div class="chapter-complete">' +
      '<div class="complete-icon">&#127881;</div>' +
      '<h2>Chapter Complete!</h2>' +
      '<p>You worked through all ' + totalSteps + ' steps in ' + mod.title + '.</p>' +
      '<p>Practice with new numbers to reinforce the concepts.</p>' +
      '<button class="btn-new-numbers" id="complete-new-btn">Practice with New Numbers</button>' +
      '<button class="btn-secondary" id="complete-dash-btn">Back to Dashboard</button>' +
    '</div>';

  document.getElementById('complete-new-btn').addEventListener('click', function() {
    startChapter(currentChapterId);
  });
  document.getElementById('complete-dash-btn').addEventListener('click', function() {
    renderDashboard();
  });

  $('ch-progress-bar').style.width = '100%';
  $('ch-progress-label').textContent = 'Complete!';
}

// ---- Answer Sheet ----
function updateAnswerSheet() {
  var list = $('answer-sheet-list');
  if (completedAnswers.length === 0) {
    list.innerHTML = '<p style="color:#666;font-size:13px;">No answers yet.</p>';
    return;
  }
  list.innerHTML = completedAnswers.map(function(a, i) {
    return '<div class="answer-sheet-row"><span class="answer-sheet-num">' + (i + 1) + '.</span><span class="answer-sheet-val">' + (a.result || a.title) + '</span></div>';
  }).join('');
}

// ---- Test Mode ----
function renderTestSetup() {
  showView('view-test');
  $('test-setup').style.display = 'block';
  $('test-running').style.display = 'none';
  $('test-results').style.display = 'none';
  setActiveNav(null);

  var checkboxes = $('test-chapter-checkboxes');
  checkboxes.innerHTML = '';
  CHAPTERS.forEach(function(ch) {
    var mod = window[ch.module];
    if (!mod) return;
    var label = document.createElement('label');
    label.className = 'test-ch-label';
    label.innerHTML =
      '<input type="checkbox" value="' + ch.id + '" checked class="test-ch-check"> ' +
      'Ch ' + ch.num + ' — ' + mod.title;
    checkboxes.appendChild(label);
  });
}

function startTest() {
  var selectedChs = [];
  document.querySelectorAll('.test-ch-check:checked').forEach(function(cb) {
    selectedChs.push(cb.value);
  });
  if (selectedChs.length === 0) {
    alert('Please select at least one chapter.');
    return;
  }

  var numQ = parseInt($('test-num-questions').value, 10) || 10;
  var includeDefs = $('test-include-defs').checked;

  // Build question pool
  var pool = [];
  selectedChs.forEach(function(chId) {
    var mod = chapterModule(chId);
    if (!mod) return;
    var gen = mod.generate();

    gen.questions.forEach(function(q) {
      q.steps.forEach(function(step) {
        pool.push({
          chId: chId,
          chTitle: mod.title,
          inst: step.inst,
          choices: step.choices,
          correct: step.correct,
          exp: step.exp,
          result: step.result,
          isDefinition: false
        });
      });
    });

    if (includeDefs && mod.definitions) {
      mod.definitions.forEach(function(d) {
        pool.push({
          chId: chId,
          chTitle: mod.title,
          inst: d.q,
          choices: d.choices,
          correct: d.correct,
          exp: d.exp,
          result: d.choices[d.correct],
          isDefinition: true
        });
      });
    }
  });

  // Shuffle and limit
  pool.sort(function() { return Math.random() - 0.5; });
  pool = pool.slice(0, numQ);

  testState = {
    questions: pool,
    current: 0,
    answers: [],   // { correct: bool, userChoice: idx, q: question }
    startTime: Date.now()
  };

  $('test-setup').style.display = 'none';
  $('test-running').style.display = 'block';
  renderTestQuestion();

  // Timer
  if (window._testTimer) clearInterval(window._testTimer);
  window._testTimer = setInterval(function() {
    if (!testState) { clearInterval(window._testTimer); return; }
    var elapsed = Math.floor((Date.now() - testState.startTime) / 1000);
    var m = Math.floor(elapsed / 60), s = elapsed % 60;
    $('test-timer').textContent = m + ':' + (s < 10 ? '0' : '') + s;
  }, 1000);
}

function renderTestQuestion() {
  if (!testState) return;
  var q = testState.questions[testState.current];
  var total = testState.questions.length;
  var idx = testState.current;

  $('test-q-counter').textContent = 'Question ' + (idx + 1) + ' of ' + total;
  $('test-q-progress').style.width = Math.round((idx / total) * 100) + '%';
  $('test-ch-label-run').textContent = q.chTitle + (q.isDefinition ? ' — Definition' : '');

  var area = $('test-question-area');
  area.innerHTML = '';

  var instEl = document.createElement('div');
  instEl.className = 'step-inst';
  instEl.textContent = q.inst;
  area.appendChild(instEl);

  var btnWrap = document.createElement('div');
  btnWrap.className = 'answer-buttons';

  q.choices.forEach(function(choice, ci) {
    var btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = choice;
    btn.addEventListener('click', function() {
      handleTestAnswer(ci, q, btnWrap);
    });
    btnWrap.appendChild(btn);
  });

  area.appendChild(btnWrap);
}

function handleTestAnswer(chosenIdx, q, btnWrap) {
  var isCorrect = chosenIdx === q.correct;
  btnWrap.querySelectorAll('.answer-btn').forEach(function(b) { b.disabled = true; });

  var chosenBtn = btnWrap.querySelectorAll('.answer-btn')[chosenIdx];
  var correctBtn = btnWrap.querySelectorAll('.answer-btn')[q.correct];

  if (isCorrect) {
    chosenBtn.classList.add('answer-correct');
  } else {
    chosenBtn.classList.add('answer-wrong');
    correctBtn.classList.add('answer-correct');
  }

  testState.answers.push({ correct: isCorrect, userChoice: chosenIdx, q: q });

  setTimeout(function() {
    testState.current++;
    if (testState.current >= testState.questions.length) {
      showTestResults();
    } else {
      renderTestQuestion();
    }
  }, 900);
}

function showTestResults() {
  clearInterval(window._testTimer);
  $('test-running').style.display = 'none';
  $('test-results').style.display = 'block';

  var answers = testState.answers;
  var correct = answers.filter(function(a) { return a.correct; }).length;
  var total = answers.length;
  var pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  var passed = pct >= 70;

  $('result-score').textContent = correct + ' / ' + total;
  $('result-pct').textContent = pct + '%';
  $('result-pass').textContent = passed ? 'PASS' : 'FAIL';
  $('result-pass').className = passed ? 'result-pass' : 'result-fail';

  // Chapter breakdown
  var byChapter = {};
  answers.forEach(function(a) {
    var chId = a.q.chId;
    if (!byChapter[chId]) byChapter[chId] = { title: a.q.chTitle, correct: 0, total: 0 };
    byChapter[chId].total++;
    if (a.correct) byChapter[chId].correct++;
  });

  var bdEl = $('result-breakdown');
  bdEl.innerHTML = '<h4>By Chapter</h4>' +
    Object.keys(byChapter).map(function(chId) {
      var c = byChapter[chId];
      var cpct = Math.round((c.correct / c.total) * 100);
      return '<div class="result-ch-row"><span>' + c.title + '</span><span>' + c.correct + '/' + c.total + ' (' + cpct + '%)</span></div>';
    }).join('');

  // Missed questions
  var missed = answers.filter(function(a) { return !a.correct; });
  var missedEl = $('result-missed');
  if (missed.length === 0) {
    missedEl.innerHTML = '<p style="color:#16a34a;font-weight:600;">Perfect score! No missed questions.</p>';
  } else {
    missedEl.innerHTML = '<h4>Missed Questions</h4>' +
      missed.map(function(a, i) {
        return '<div class="missed-q">' +
          '<div class="missed-q-text">' + (i + 1) + '. ' + a.q.inst + '</div>' +
          '<div class="missed-correct">Correct answer: <strong>' + a.q.choices[a.q.correct] + '</strong></div>' +
          '<div class="missed-exp" style="color:#555;font-size:13px;">' + a.q.exp + '</div>' +
        '</div>';
      }).join('');
  }

  // Save test result
  Progress.addTestResult({ score: correct, total: total, pct: pct, passed: passed });
}

// ---- Event wiring ----
document.addEventListener('DOMContentLoaded', function() {
  // Nav links
  CHAPTERS.forEach(function(ch) {
    var el = document.querySelector('[data-navch="' + ch.id + '"]');
    if (el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        startChapter(ch.id);
      });
    }
  });

  // Dashboard link
  var dashLink = $('nav-dashboard');
  if (dashLink) dashLink.addEventListener('click', function(e) { e.preventDefault(); renderDashboard(); });

  // Test link
  var testLink = $('nav-test');
  if (testLink) testLink.addEventListener('click', function(e) { e.preventDefault(); renderTestSetup(); });

  // Dashboard: Take a Test button
  var dashTestBtn = $('dash-test-btn');
  if (dashTestBtn) dashTestBtn.addEventListener('click', renderTestSetup);

  // Chapter back button
  var backBtn = $('ch-back-btn');
  if (backBtn) backBtn.addEventListener('click', renderDashboard);

  // New Numbers button
  var newNumBtn = $('ch-new-numbers-btn');
  if (newNumBtn) {
    newNumBtn.addEventListener('click', function() {
      if (currentChapterId) startChapter(currentChapterId);
    });
  }

  // Formulas toggle
  var formulasToggle = $('ch-formulas-toggle');
  var formulasList = $('ch-formulas-list');
  if (formulasToggle && formulasList) {
    formulasToggle.addEventListener('click', function() {
      var open = formulasList.style.display !== 'none';
      formulasList.style.display = open ? 'none' : 'block';
      formulasToggle.textContent = open ? '▶ Show Formulas' : '▼ Hide Formulas';
    });
  }

  // Data table toggle
  var dataToggle = $('ch-data-toggle');
  var dataTable = $('ch-data-table');
  if (dataToggle && dataTable) {
    dataToggle.addEventListener('click', function() {
      var open = dataTable.style.display !== 'none';
      dataTable.style.display = open ? 'none' : 'table';
      dataToggle.textContent = open ? '▶ Show Data' : '▼ Hide Data';
    });
  }

  // Answer sheet toggle
  var sheetToggle = $('answer-sheet-toggle');
  var sheetContent = $('answer-sheet-content');
  if (sheetToggle && sheetContent) {
    sheetToggle.addEventListener('click', function() {
      var open = sheetContent.style.display !== 'none';
      sheetContent.style.display = open ? 'none' : 'block';
      sheetToggle.textContent = open ? '▶ Show Answer Sheet' : '▼ Hide Answer Sheet';
    });
  }

  // Test start button
  var testStartBtn = $('test-start-btn');
  if (testStartBtn) testStartBtn.addEventListener('click', startTest);

  // Test back button (from setup)
  var testBackBtn = $('test-back-btn');
  if (testBackBtn) testBackBtn.addEventListener('click', renderDashboard);

  // Test results — retake
  var retakeBtn = $('result-retake-btn');
  if (retakeBtn) retakeBtn.addEventListener('click', renderTestSetup);

  // Test results — dashboard
  var resultDashBtn = $('result-dash-btn');
  if (resultDashBtn) resultDashBtn.addEventListener('click', renderDashboard);

  // Mobile sidebar toggle
  var menuToggle = $('menu-toggle');
  var sidebar = $('sidebar');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('sidebar-open');
    });
  }

  // Sidebar click on mobile closes it
  document.querySelectorAll('.nav-ch, #nav-dashboard, #nav-test').forEach(function(el) {
    el.addEventListener('click', function() {
      if (sidebar) sidebar.classList.remove('sidebar-open');
    });
  });

  // Reset progress button
  var resetBtn = $('reset-progress-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (confirm('Reset all progress? This cannot be undone.')) {
        Progress.reset();
        renderDashboard();
      }
    });
  }

  // Init tools
  Calculator.init();
  Clipboard.init();

  // Start on dashboard
  renderDashboard();
});
