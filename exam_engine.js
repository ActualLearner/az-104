/**
 * AZ-104 Exam Simulator Engine
 * Definitive 2026 Edition
 * Features: Timed Exam Mode, Practice/Review Mode, LocalStorage Persistence,
 * Domain Scoring, Error Journal SOP Exporter, Keyboard Navigation, Mobile Ergonomics.
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_KEY_SESSION = 'az104_simulator_session_v1';
  const STORAGE_KEY_HISTORY = 'az104_simulator_history_v1';

  // Application State
  let currentExamKey = 'exam1'; // 'exam1' | 'exam2' | 'combined'
  let currentMode = 'timed'; // 'timed' | 'practice'
  let activeQuestions = [];
  let currentIndex = 0;
  let userAnswers = {}; // { [qId]: 'A' | ['A', 'C'] }
  let flaggedQuestions = new Set();
  let timeRemainingSeconds = 100 * 60; // default 100 minutes
  let timerInterval = null;
  let isTimerPaused = false;
  let isExamSubmitted = false;
  let examStartTime = null;

  // DOM Elements cache
  let dom = {};

  function init() {
    cacheDom();
    bindEvents();
    loadSessionOrInit();
  }

  function cacheDom() {
    dom.examSelect = document.getElementById('exam-select');
    dom.modeSelect = document.getElementById('mode-select');
    dom.timerDisplay = document.getElementById('timer-display');
    dom.timerBox = document.getElementById('timer-box');
    dom.btnPauseTimer = document.getElementById('btn-pause-timer');
    dom.questionPanelMain = document.getElementById('question-panel-main');
    dom.questionCountBadge = document.getElementById('question-count-badge');
    dom.domainBadge = document.getElementById('domain-badge');
    dom.flagBtn = document.getElementById('btn-flag');
    dom.questionTitle = document.getElementById('question-title');
    dom.questionScenario = document.getElementById('question-scenario');
    dom.optionsContainer = document.getElementById('options-container');
    dom.explanationCard = document.getElementById('explanation-card');
    dom.explanationContent = document.getElementById('explanation-content');
    dom.btnPrev = document.getElementById('btn-prev');
    dom.btnNext = document.getElementById('btn-next');
    dom.btnCheckAnswer = document.getElementById('btn-check-answer');
    dom.btnSubmitExam = document.getElementById('btn-submit-exam');
    dom.questionPalette = document.getElementById('question-palette');
    dom.paletteFilter = document.getElementById('palette-filter');
    dom.mobilePaletteFilter = document.getElementById('mobile-palette-filter');
    dom.testView = document.getElementById('test-view');
    dom.resultsView = document.getElementById('results-view');
    dom.scorePercentage = document.getElementById('score-percentage');
    dom.scoreRaw = document.getElementById('score-raw');
    dom.passFailBadge = document.getElementById('pass-fail-badge');
    dom.domainBreakdownList = document.getElementById('domain-breakdown-list');
    dom.reviewQuestionsList = document.getElementById('review-questions-list');
    dom.reviewFilter = document.getElementById('review-filter');
    dom.btnExportErrorJournal = document.getElementById('btn-export-error-journal');
    dom.exportModal = document.getElementById('export-modal');
    dom.exportFilterSelect = document.getElementById('export-filter-select');
    dom.exportCountLabel = document.getElementById('export-count-label');
    dom.exportMarkdownText = document.getElementById('export-markdown-text');
    dom.btnCloseExport = document.getElementById('btn-close-export');
    dom.btnCopyExport = document.getElementById('btn-copy-export');
    dom.copyFeedback = document.getElementById('copy-feedback');
    dom.btnRetakeExam = document.getElementById('btn-retake-exam');
    dom.btnResetExam = document.getElementById('btn-reset-exam');
    dom.btnHistory = document.getElementById('btn-history');
    dom.historyModal = document.getElementById('history-modal');
    dom.historyTableBody = document.getElementById('history-table-body');
    dom.btnCloseHistory = document.getElementById('btn-close-history');
    dom.btnClearHistory = document.getElementById('btn-clear-history');
    dom.mobilePaletteToggle = document.getElementById('mobile-palette-toggle');
    dom.mobileQuestionPalette = document.getElementById('mobile-question-palette');
    dom.paletteDrawer = document.getElementById('palette-drawer');
    dom.paletteDrawerClose = document.getElementById('palette-drawer-close');
    dom.drawerBackdrop = document.getElementById('drawer-backdrop');
    dom.submitModal = document.getElementById('submit-modal');
    dom.submitModalUnanswered = document.getElementById('submit-modal-unanswered');
    dom.submitModalFlagged = document.getElementById('submit-modal-flagged');
    dom.btnConfirmSubmit = document.getElementById('btn-confirm-submit');
    dom.btnCancelSubmit = document.getElementById('btn-cancel-submit');
    dom.confirmDialogModal = document.getElementById('confirm-dialog-modal');
    dom.confirmModalTitle = document.getElementById('confirm-modal-title');
    dom.confirmModalMessage = document.getElementById('confirm-modal-message');
    dom.btnConfirmDialogCancel = document.getElementById('btn-confirm-dialog-cancel');
    dom.btnConfirmDialogOk = document.getElementById('btn-confirm-dialog-ok');
    dom.toastContainer = document.getElementById('toast-container');
  }

  // Toast Notification System
  function showToast(message, type = 'info', duration = 3000) {
    if (!dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    dom.toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('active');
    });

    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }

  // Custom Modal Confirmation (Replaces blocking window.confirm)
  function showConfirmDialog(title, message, onConfirm) {
    if (!dom.confirmDialogModal) {
      if (confirm(`${title}\n\n${message}`)) {
        onConfirm();
      }
      return;
    }

    dom.confirmModalTitle.textContent = title;
    dom.confirmModalMessage.textContent = message;
    dom.confirmDialogModal.style.display = 'flex';

    const handleOk = () => {
      cleanup();
      dom.confirmDialogModal.style.display = 'none';
      onConfirm();
    };

    const handleCancel = () => {
      cleanup();
      dom.confirmDialogModal.style.display = 'none';
    };

    const cleanup = () => {
      dom.btnConfirmDialogOk.removeEventListener('click', handleOk);
      dom.btnConfirmDialogCancel.removeEventListener('click', handleCancel);
    };

    dom.btnConfirmDialogOk.addEventListener('click', handleOk);
    dom.btnConfirmDialogCancel.addEventListener('click', handleCancel);
  }

  function bindEvents() {
    // Exam selector change
    if (dom.examSelect) {
      dom.examSelect.addEventListener('change', (e) => {
        const nextExam = e.target.value;
        const answeredCount = Object.keys(userAnswers).length;
        if (answeredCount > 0 && !isExamSubmitted) {
          showConfirmDialog(
            'Switch Exam?',
            'Switching to a different exam will discard your current progress on this attempt. Do you wish to continue?',
            () => {
              currentExamKey = nextExam;
              resetExamState(true);
            }
          );
          // revert select until confirmed
          dom.examSelect.value = currentExamKey;
        } else {
          currentExamKey = nextExam;
          resetExamState(true);
        }
      });
    }

    // Mode selector change (Preserves answers, only switches UX mode!)
    if (dom.modeSelect) {
      dom.modeSelect.addEventListener('change', (e) => {
        currentMode = e.target.value;
        if (currentMode === 'timed') {
          dom.timerBox.style.display = 'flex';
          dom.btnCheckAnswer.style.display = 'none';
          dom.explanationCard.style.display = 'none';
          if (!isExamSubmitted) startTimer();
        } else {
          dom.timerBox.style.display = 'none';
          clearInterval(timerInterval);
          dom.btnCheckAnswer.style.display = 'inline-flex';
          const q = activeQuestions[currentIndex];
          if (q && isQuestionAnswered(q.id)) {
            renderPracticeExplanation();
          }
        }
        updateOptionHighlighting();
        saveSession();
        showToast(`Switched to ${currentMode === 'timed' ? 'Timed Exam Mode' : 'Practice & Review Mode'}`, 'info', 2000);
      });
    }

    if (dom.btnPrev) dom.btnPrev.addEventListener('click', () => navigateQuestion(currentIndex - 1));
    if (dom.btnNext) dom.btnNext.addEventListener('click', () => navigateQuestion(currentIndex + 1));
    if (dom.flagBtn) dom.flagBtn.addEventListener('click', toggleFlagCurrentQuestion);

    if (dom.btnCheckAnswer) {
      dom.btnCheckAnswer.addEventListener('click', () => {
        const q = activeQuestions[currentIndex];
        if (!isQuestionAnswered(q.id)) {
          showToast('Please select an option first before checking the answer.', 'warning');
          return;
        }
        renderPracticeExplanation();
      });
    }

    if (dom.btnSubmitExam) {
      dom.btnSubmitExam.addEventListener('click', openSubmitConfirmationModal);
    }

    if (dom.btnConfirmSubmit) {
      dom.btnConfirmSubmit.addEventListener('click', () => {
        closeSubmitModal();
        submitExam();
      });
    }

    if (dom.btnCancelSubmit) {
      dom.btnCancelSubmit.addEventListener('click', closeSubmitModal);
    }

    if (dom.btnPauseTimer) {
      dom.btnPauseTimer.addEventListener('click', toggleTimerPause);
    }

    // Palette filter sync
    if (dom.paletteFilter) {
      dom.paletteFilter.addEventListener('change', () => {
        if (dom.mobilePaletteFilter) dom.mobilePaletteFilter.value = dom.paletteFilter.value;
        renderPalette();
      });
    }
    if (dom.mobilePaletteFilter) {
      dom.mobilePaletteFilter.addEventListener('change', () => {
        if (dom.paletteFilter) dom.paletteFilter.value = dom.mobilePaletteFilter.value;
        renderPalette();
      });
    }

    if (dom.btnResetExam) {
      dom.btnResetExam.addEventListener('click', () => {
        showConfirmDialog(
          'Restart Exam?',
          'Are you sure you want to restart this exam? All answers and timer progress will be cleared.',
          () => {
            resetExamState(true);
            showToast('Exam has been reset.', 'info');
          }
        );
      });
    }

    if (dom.btnRetakeExam) {
      dom.btnRetakeExam.addEventListener('click', () => {
        resetExamState(true);
      });
    }

    if (dom.reviewFilter) {
      dom.reviewFilter.addEventListener('change', () => renderResultsReviewList());
    }

    if (dom.btnExportErrorJournal) {
      dom.btnExportErrorJournal.addEventListener('click', openErrorJournalExportModal);
    }

    if (dom.exportFilterSelect) {
      dom.exportFilterSelect.addEventListener('change', () => updateExportMarkdownContent());
    }

    if (dom.btnCloseExport) {
      dom.btnCloseExport.addEventListener('click', () => {
        dom.exportModal.style.display = 'none';
      });
    }

    if (dom.btnCopyExport) {
      dom.btnCopyExport.addEventListener('click', copyExportMarkdownToClipboard);
    }

    if (dom.btnHistory) {
      dom.btnHistory.addEventListener('click', openHistoryModal);
    }

    if (dom.btnCloseHistory) {
      dom.btnCloseHistory.addEventListener('click', () => {
        dom.historyModal.style.display = 'none';
      });
    }

    if (dom.btnClearHistory) {
      dom.btnClearHistory.addEventListener('click', () => {
        showConfirmDialog(
          'Clear History?',
          'Are you sure you want to permanently delete all stored past exam attempts from this browser?',
          () => {
            localStorage.removeItem(STORAGE_KEY_HISTORY);
            renderHistoryTable();
            showToast('Exam attempt history cleared.', 'info');
          }
        );
      });
    }

    // Mobile drawer toggle & backdrop close
    if (dom.mobilePaletteToggle && dom.paletteDrawer) {
      dom.mobilePaletteToggle.addEventListener('click', () => {
        toggleMobileDrawer(true);
      });
    }
    if (dom.paletteDrawerClose && dom.paletteDrawer) {
      dom.paletteDrawerClose.addEventListener('click', () => {
        toggleMobileDrawer(false);
      });
    }
    if (dom.drawerBackdrop) {
      dom.drawerBackdrop.addEventListener('click', () => {
        toggleMobileDrawer(false);
      });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
  }

  function toggleMobileDrawer(open) {
    if (!dom.paletteDrawer) return;
    if (open) {
      dom.paletteDrawer.classList.add('active');
      if (dom.drawerBackdrop) dom.drawerBackdrop.classList.add('active');
    } else {
      dom.paletteDrawer.classList.remove('active');
      if (dom.drawerBackdrop) dom.drawerBackdrop.classList.remove('active');
    }
  }

  function handleKeyboardShortcuts(e) {
    // Only in active test view and not inside text inputs / modals
    if (dom.testView.style.display === 'none') return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (dom.submitModal && dom.submitModal.style.display === 'flex') return;
    if (dom.exportModal && dom.exportModal.style.display === 'flex') return;
    if (dom.historyModal && dom.historyModal.style.display === 'flex') return;
    if (dom.confirmDialogModal && dom.confirmDialogModal.style.display === 'flex') return;

    const key = e.key.toUpperCase();

    if (e.key === 'ArrowRight' || key === 'N') {
      if (currentIndex < activeQuestions.length - 1) navigateQuestion(currentIndex + 1);
    } else if (e.key === 'ArrowLeft' || key === 'P') {
      if (currentIndex > 0) navigateQuestion(currentIndex - 1);
    } else if (key === 'F') {
      toggleFlagCurrentQuestion();
    } else if (['1', '2', '3', '4', '5'].includes(key)) {
      const optIdx = parseInt(key, 10) - 1;
      const q = activeQuestions[currentIndex];
      if (q && q.options && q.options[optIdx]) {
        selectOption(q.options[optIdx].id);
      }
    } else if (['A', 'B', 'C', 'D', 'E'].includes(key)) {
      const q = activeQuestions[currentIndex];
      if (q && q.options) {
        const found = q.options.find((o) => o.id === key);
        if (found) selectOption(found.id);
      }
    }
  }

  function getQuestionPool(examKey) {
    const e1 = window.AZ104_EXAM_1 || [];
    const e2 = window.AZ104_EXAM_2 || [];
    if (examKey === 'exam1') return [...e1];
    if (examKey === 'exam2') return [...e2];
    if (examKey === 'combined') return [...e1, ...e2];
    return [...e1];
  }

  function getDefaultExamTimeSeconds(examKey) {
    // 50 questions -> 100 minutes. 100 questions -> 200 minutes.
    if (examKey === 'combined') return 200 * 60;
    return 100 * 60;
  }

  function loadSessionOrInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramExam = urlParams.get('exam');
    const paramMode = urlParams.get('mode');

    const saved = localStorage.getItem(STORAGE_KEY_SESSION);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        currentExamKey = paramExam || parsed.currentExamKey || 'exam1';
        currentMode = paramMode || parsed.currentMode || 'timed';
        currentIndex = parsed.currentIndex || 0;
        userAnswers = parsed.userAnswers || {};
        flaggedQuestions = new Set(parsed.flaggedQuestions || []);
        timeRemainingSeconds = parsed.timeRemainingSeconds !== undefined ? parsed.timeRemainingSeconds : getDefaultExamTimeSeconds(currentExamKey);
        isExamSubmitted = parsed.isExamSubmitted || false;
        examStartTime = parsed.examStartTime || Date.now();

        // If URL param specified a different exam than saved, re-init for that exam
        if (paramExam && paramExam !== parsed.currentExamKey) {
          resetExamState(false);
          return;
        }

        if (dom.examSelect) dom.examSelect.value = currentExamKey;
        if (dom.modeSelect) dom.modeSelect.value = currentMode;

        activeQuestions = getQuestionPool(currentExamKey);

        if (isExamSubmitted) {
          showResultsScreen();
        } else {
          showTestScreen();
          renderQuestion(currentIndex);
          renderPalette();
          if (currentMode === 'timed') {
            startTimer();
          } else {
            dom.timerBox.style.display = 'none';
          }
        }
        return;
      } catch (err) {
        console.error('Error loading saved session:', err);
      }
    }

    if (paramExam) currentExamKey = paramExam;
    if (paramMode) currentMode = paramMode;
    if (dom.examSelect) dom.examSelect.value = currentExamKey;
    if (dom.modeSelect) dom.modeSelect.value = currentMode;

    // Default initialization
    resetExamState(false);
  }

  function saveSession() {
    const sessionData = {
      currentExamKey,
      currentMode,
      currentIndex,
      userAnswers,
      flaggedQuestions: Array.from(flaggedQuestions),
      timeRemainingSeconds,
      isExamSubmitted,
      examStartTime
    };
    try {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function resetExamState(autoStart) {
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerPaused = false;
    isExamSubmitted = false;
    currentIndex = 0;
    userAnswers = {};
    flaggedQuestions.clear();
    timeRemainingSeconds = getDefaultExamTimeSeconds(currentExamKey);
    examStartTime = Date.now();

    activeQuestions = getQuestionPool(currentExamKey);

    saveSession();

    showTestScreen();
    renderQuestion(currentIndex);
    renderPalette();

    if (currentMode === 'timed') {
      dom.timerBox.style.display = 'flex';
      startTimer();
    } else {
      dom.timerBox.style.display = 'none';
    }
  }

  function showTestScreen() {
    dom.testView.style.display = 'block';
    dom.resultsView.style.display = 'none';
  }

  function showResultsScreen() {
    dom.testView.style.display = 'none';
    dom.resultsView.style.display = 'block';
    renderScoreSummary();
    renderDomainBreakdown();
    renderResultsReviewList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Timer Management
  function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      if (!isTimerPaused) {
        timeRemainingSeconds--;
        updateTimerDisplay();
        saveSession();

        if (timeRemainingSeconds <= 0) {
          clearInterval(timerInterval);
          showToast('Time has expired! Submitting your exam now.', 'warning', 4000);
          submitExam();
        }
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    if (!dom.timerDisplay) return;
    const safeSeconds = Math.max(0, timeRemainingSeconds);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    let formatted = '';
    if (hours > 0) {
      formatted = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    dom.timerDisplay.textContent = formatted;

    if (safeSeconds <= 300) {
      dom.timerBox.classList.add('timer-danger');
      dom.timerBox.classList.remove('timer-warning');
    } else if (safeSeconds <= 900) {
      dom.timerBox.classList.add('timer-warning');
      dom.timerBox.classList.remove('timer-danger');
    } else {
      dom.timerBox.classList.remove('timer-warning', 'timer-danger');
    }
  }

  function toggleTimerPause() {
    isTimerPaused = !isTimerPaused;
    if (dom.btnPauseTimer) {
      dom.btnPauseTimer.textContent = isTimerPaused ? '▶ Resume' : '⏸ Pause';
      dom.btnPauseTimer.title = isTimerPaused ? 'Resume exam timer' : 'Pause exam timer';
    }
    showToast(isTimerPaused ? 'Exam timer paused.' : 'Exam timer resumed.', 'info', 1500);
  }

  // Question Rendering
  function renderQuestion(index) {
    if (!activeQuestions || activeQuestions.length === 0) {
      dom.questionTitle.textContent = 'No questions loaded.';
      return;
    }

    currentIndex = Math.max(0, Math.min(index, activeQuestions.length - 1));
    const q = activeQuestions[currentIndex];

    dom.questionCountBadge.textContent = `Question ${currentIndex + 1} of ${activeQuestions.length}`;
    dom.domainBadge.textContent = q.domain || 'AZ-104 Domain';
    dom.questionTitle.textContent = q.topic || `Question ${currentIndex + 1}`;

    // Flag button state
    if (flaggedQuestions.has(q.id)) {
      dom.flagBtn.classList.add('flagged');
      dom.flagBtn.textContent = '🚩 Flagged';
    } else {
      dom.flagBtn.classList.remove('flagged');
      dom.flagBtn.textContent = '🏳️ Flag for Review';
    }

    // Format Scenario
    renderScenarioText(q.scenario);

    // Build Options DOM
    renderOptions(q);

    // Navigation buttons state
    dom.btnPrev.disabled = currentIndex === 0;
    dom.btnNext.disabled = currentIndex === activeQuestions.length - 1;

    // Practice mode explanation / check button
    if (currentMode === 'practice') {
      dom.btnCheckAnswer.style.display = 'inline-flex';
      const answered = isQuestionAnswered(q.id);
      if (answered) {
        renderPracticeExplanation();
      } else {
        dom.explanationCard.style.display = 'none';
      }
    } else {
      dom.btnCheckAnswer.style.display = 'none';
      dom.explanationCard.style.display = 'none';
    }

    saveSession();
    renderPalette();

    // Scroll question panel smoothly into view on mobile without hiding behind sticky nav
    if (window.innerWidth < 768 && dom.questionPanelMain) {
      const topOffset = dom.questionPanelMain.getBoundingClientRect().top + window.pageYOffset - 75;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }
  }

  function renderScenarioText(scenarioText) {
    if (!scenarioText) {
      dom.questionScenario.innerHTML = '';
      return;
    }

    // Convert code blocks and markdown-style formatting
    let formatted = scenarioText
      .replace(/```json([\s\S]*?)```/g, '<pre><code class="code-block">$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre><code class="code-block">$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="code-pill">$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

    dom.questionScenario.innerHTML = formatted;
  }

  function renderOptions(q) {
    dom.optionsContainer.innerHTML = '';
    const isMultiple = q.questionType === 'multiple' || Array.isArray(q.correctAnswer);
    const currentVal = userAnswers[q.id];

    q.options.forEach((opt) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'option-item';
      optionDiv.setAttribute('data-option-id', opt.id);

      const isSelected = isMultiple
        ? Array.isArray(currentVal) && currentVal.includes(opt.id)
        : currentVal === opt.id;

      if (isSelected) optionDiv.classList.add('selected');

      const inputType = isMultiple ? 'checkbox' : 'radio';
      const inputId = `opt-${q.id}-${opt.id}`;
      const inputName = `opt-${q.id}`;

      optionDiv.innerHTML = `
        <label class="option-label" for="${inputId}">
          <input type="${inputType}" id="${inputId}" name="${inputName}" value="${opt.id}" ${isSelected ? 'checked' : ''} />
          <span class="option-indicator">${opt.id}</span>
          <span class="option-text">${opt.text}</span>
          <span class="option-badge-status" id="badge-${q.id}-${opt.id}" style="display:none;"></span>
        </label>
      `;

      // Handle clicking anywhere on the option item
      optionDiv.addEventListener('click', (e) => {
        // If clicked on input itself, don't double-toggle
        selectOption(opt.id);
      });

      dom.optionsContainer.appendChild(optionDiv);
    });

    // If practice mode and already answered, apply highlighting
    if (currentMode === 'practice' && isQuestionAnswered(q.id)) {
      updateOptionHighlighting();
    }
  }

  function selectOption(optionId) {
    const q = activeQuestions[currentIndex];
    const isMultiple = q.questionType === 'multiple' || Array.isArray(q.correctAnswer);

    if (isMultiple) {
      let currentSelection = userAnswers[q.id] || [];
      if (!Array.isArray(currentSelection)) currentSelection = [currentSelection];

      if (currentSelection.includes(optionId)) {
        currentSelection = currentSelection.filter((id) => id !== optionId);
      } else {
        currentSelection.push(optionId);
      }
      currentSelection.sort();
      userAnswers[q.id] = currentSelection;
    } else {
      userAnswers[q.id] = optionId;
    }

    // Update classes and checked states without destroying DOM nodes
    const optionDivs = dom.optionsContainer.querySelectorAll('.option-item');
    const currentVal = userAnswers[q.id];

    optionDivs.forEach((div) => {
      const optId = div.getAttribute('data-option-id');
      const input = div.querySelector('input');
      const isSelected = isMultiple
        ? Array.isArray(currentVal) && currentVal.includes(optId)
        : currentVal === optId;

      if (isSelected) {
        div.classList.add('selected');
        if (input) input.checked = true;
      } else {
        div.classList.remove('selected');
        if (input) input.checked = false;
      }
    });

    // In practice mode, update highlighting immediately
    if (currentMode === 'practice') {
      updateOptionHighlighting();
      renderPracticeExplanation();
    }

    saveSession();
    renderPalette();
  }

  function updateOptionHighlighting() {
    const q = activeQuestions[currentIndex];
    const userVal = userAnswers[q.id];
    const isAnswered = isQuestionAnswered(q.id);
    const optionDivs = dom.optionsContainer.querySelectorAll('.option-item');

    optionDivs.forEach((div) => {
      const optId = div.getAttribute('data-option-id');
      const badge = div.querySelector('.option-badge-status');

      // Clear previous practice highlighting
      div.classList.remove('practice-correct', 'practice-incorrect');
      if (badge) badge.style.display = 'none';

      if (currentMode === 'practice' && isAnswered) {
        const isCorrectChoice = Array.isArray(q.correctAnswer)
          ? q.correctAnswer.includes(optId)
          : q.correctAnswer === optId;

        const isUserChoice = Array.isArray(userVal)
          ? userVal.includes(optId)
          : userVal === optId;

        if (isCorrectChoice) {
          div.classList.add('practice-correct');
          if (badge) {
            badge.className = 'option-badge-status status-badge-correct';
            badge.textContent = '✓ Correct';
            badge.style.display = 'inline-block';
          }
        } else if (isUserChoice && !isCorrectChoice) {
          div.classList.add('practice-incorrect');
          if (badge) {
            badge.className = 'option-badge-status status-badge-incorrect';
            badge.textContent = '✗ Selected';
            badge.style.display = 'inline-block';
          }
        }
      }
    });
  }

  function renderPracticeExplanation() {
    const q = activeQuestions[currentIndex];
    const userVal = userAnswers[q.id];
    if (!userVal) {
      dom.explanationCard.style.display = 'none';
      return;
    }

    const isCorrect = evaluateQuestionAnswer(q, userVal);
    const exp = q.explanation || {};

    let distractorsHtml = '';
    if (exp.distractors) {
      distractorsHtml = '<div class="explanation-section"><strong>⚡ Distractor Dissections:</strong><ul class="distractor-list">';
      for (const [key, reason] of Object.entries(exp.distractors)) {
        distractorsHtml += `<li><strong>Option ${key}:</strong> ${reason}</li>`;
      }
      distractorsHtml += '</ul></div>';
    }

    const correctStr = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer;
    const userStr = Array.isArray(userVal) ? userVal.join(', ') : userVal;

    dom.explanationCard.className = `explanation-card ${isCorrect ? 'correct' : 'incorrect'}`;
    dom.explanationCard.style.display = 'block';

    dom.explanationContent.innerHTML = `
      <div class="verdict-banner ${isCorrect ? 'verdict-correct' : 'verdict-incorrect'}">
        ${isCorrect ? '✅ <strong>Correct!</strong>' : '❌ <strong>Incorrect</strong>'}
        <span style="font-size:0.85rem; margin-left:0.5rem;">(Your Answer: <strong>${userStr}</strong> | Correct Answer: <strong>${correctStr}</strong>)</span>
      </div>

      <div class="explanation-section" style="margin-top:0.75rem;">
        <strong>🎯 Scenario Trigger &amp; Constraints:</strong>
        <p>${exp.triggerConstraints || 'None documented.'}</p>
      </div>

      <div class="explanation-section">
        <strong>🧠 Core Azure Mechanic (2026 Standard):</strong>
        <p>${exp.coreMechanic || exp.verdict || ''}</p>
      </div>

      ${distractorsHtml}

      <div class="heuristic-callout">
        <strong>💡 Exam Day Heuristic:</strong> ${exp.heuristic || ''}
      </div>

      <div style="margin-top:0.75rem; font-size:0.825rem;">
        <a href="${exp.msLearnUrl || '#'}" target="_blank" class="learn-link">📖 Verify on Microsoft Learn Docs ↗</a>
      </div>
    `;
  }

  function evaluateQuestionAnswer(q, answer) {
    if (!answer) return false;
    if (Array.isArray(q.correctAnswer)) {
      if (!Array.isArray(answer)) return false;
      if (q.correctAnswer.length !== answer.length) return false;
      const sortedCorrect = [...q.correctAnswer].sort();
      const sortedAnswer = [...answer].sort();
      return sortedCorrect.every((val, idx) => val === sortedAnswer[idx]);
    }
    return q.correctAnswer === answer;
  }

  function isQuestionAnswered(qId) {
    const val = userAnswers[qId];
    if (val === undefined || val === null) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  }

  function toggleFlagCurrentQuestion() {
    const q = activeQuestions[currentIndex];
    if (flaggedQuestions.has(q.id)) {
      flaggedQuestions.delete(q.id);
      dom.flagBtn.classList.remove('flagged');
      dom.flagBtn.textContent = '🏳️ Flag for Review';
      showToast(`Question ${currentIndex + 1} unflagged.`, 'info', 1500);
    } else {
      flaggedQuestions.add(q.id);
      dom.flagBtn.classList.add('flagged');
      dom.flagBtn.textContent = '🚩 Flagged';
      showToast(`Question ${currentIndex + 1} flagged for review.`, 'warning', 1500);
    }
    saveSession();
    renderPalette();
  }

  function navigateQuestion(newIndex) {
    if (newIndex >= 0 && newIndex < activeQuestions.length) {
      renderQuestion(newIndex);
    }
  }

  // Palette Grid Rendering
  function renderPalette() {
    if (!dom.questionPalette) return;
    dom.questionPalette.innerHTML = '';
    if (dom.mobileQuestionPalette) dom.mobileQuestionPalette.innerHTML = '';
    const filter = dom.paletteFilter ? dom.paletteFilter.value : 'all';

    activeQuestions.forEach((q, idx) => {
      const answered = isQuestionAnswered(q.id);
      const flagged = flaggedQuestions.has(q.id);
      const isCurrent = idx === currentIndex;

      // Filter check
      if (filter === 'answered' && !answered) return;
      if (filter === 'unanswered' && answered) return;
      if (filter === 'flagged' && !flagged) return;

      const createPill = () => {
        const pill = document.createElement('button');
        pill.className = 'palette-pill';
        pill.textContent = idx + 1;
        pill.title = `Jump to Question ${idx + 1}`;

        if (isCurrent) pill.classList.add('current');
        if (flagged) pill.classList.add('flagged');
        if (answered) pill.classList.add('answered');

        pill.addEventListener('click', () => {
          navigateQuestion(idx);
          toggleMobileDrawer(false);
        });
        return pill;
      };

      dom.questionPalette.appendChild(createPill());
      if (dom.mobileQuestionPalette) {
        dom.mobileQuestionPalette.appendChild(createPill());
      }
    });
  }

  // Submit Modal & Scoring
  function openSubmitConfirmationModal() {
    let unansweredCount = 0;
    let flaggedCount = 0;

    activeQuestions.forEach((q) => {
      if (!isQuestionAnswered(q.id)) unansweredCount++;
      if (flaggedQuestions.has(q.id)) flaggedCount++;
    });

    dom.submitModalUnanswered.textContent = unansweredCount;
    dom.submitModalFlagged.textContent = flaggedCount;
    dom.submitModal.style.display = 'flex';
  }

  function closeSubmitModal() {
    dom.submitModal.style.display = 'none';
  }

  function submitExam() {
    clearInterval(timerInterval);
    isExamSubmitted = true;
    saveSession();
    recordHistoryAttempt();
    showResultsScreen();
    showToast('Exam submitted successfully! Review your score below.', 'success', 3500);
  }

  function recordHistoryAttempt() {
    let correctCount = 0;
    activeQuestions.forEach((q) => {
      if (evaluateQuestionAnswer(q, userAnswers[q.id])) correctCount++;
    });

    const total = activeQuestions.length;
    const scorePct = Math.round((correctCount / total) * 100);
    const scaledScore = Math.round((correctCount / total) * 1000);
    const elapsedSeconds = Math.round((Date.now() - (examStartTime || Date.now())) / 1000);

    const record = {
      date: new Date().toISOString(),
      examKey: currentExamKey,
      mode: currentMode,
      totalQuestions: total,
      correctCount,
      scorePct,
      scaledScore,
      passed: scaledScore >= 700,
      timeSpentSeconds: Math.max(30, elapsedSeconds)
    };

    try {
      const historyJson = localStorage.getItem(STORAGE_KEY_HISTORY);
      const history = historyJson ? JSON.parse(historyJson) : [];
      history.unshift(record);
      // keep last 50
      if (history.length > 50) history.pop();
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to log exam history:', e);
    }
  }

  function renderScoreSummary() {
    let correctCount = 0;
    activeQuestions.forEach((q) => {
      if (evaluateQuestionAnswer(q, userAnswers[q.id])) correctCount++;
    });

    const total = activeQuestions.length;
    const scorePct = Math.round((correctCount / total) * 100);
    const scaledScore = Math.round((correctCount / total) * 1000);
    const passed = scaledScore >= 700;

    dom.scorePercentage.textContent = `${scorePct}%`;
    dom.scoreRaw.textContent = `${scaledScore} / 1000 (${correctCount} of ${total} questions correct)`;

    if (passed) {
      dom.passFailBadge.className = 'result-badge badge-pass';
      dom.passFailBadge.textContent = '🎉 PASSED (Target: 700 / 1000)';
    } else {
      dom.passFailBadge.className = 'result-badge badge-fail';
      dom.passFailBadge.textContent = '⚠️ FAILED (Passing Score: 700 / 1000)';
    }
  }

  function renderDomainBreakdown() {
    dom.domainBreakdownList.innerHTML = '';
    const domainStats = {};

    activeQuestions.forEach((q) => {
      const domain = q.domain || 'General Architecture';
      if (!domainStats[domain]) {
        domainStats[domain] = { total: 0, correct: 0 };
      }
      domainStats[domain].total++;
      if (evaluateQuestionAnswer(q, userAnswers[q.id])) {
        domainStats[domain].correct++;
      }
    });

    for (const [domainName, stats] of Object.entries(domainStats)) {
      const pct = Math.round((stats.correct / stats.total) * 100);
      const isPassed = pct >= 70;

      const item = document.createElement('div');
      item.className = 'domain-item';
      item.innerHTML = `
        <div class="domain-header">
          <span class="domain-title">${domainName}</span>
          <span class="domain-score ${isPassed ? 'text-green' : 'text-red'}">
            ${stats.correct} / ${stats.total} (${pct}%)
          </span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill ${isPassed ? 'fill-green' : 'fill-amber'}" style="width: ${pct}%;"></div>
        </div>
      `;
      dom.domainBreakdownList.appendChild(item);
    }
  }

  function renderResultsReviewList() {
    dom.reviewQuestionsList.innerHTML = '';
    const filter = dom.reviewFilter ? dom.reviewFilter.value : 'all';

    let displayedCount = 0;

    activeQuestions.forEach((q, idx) => {
      const userAns = userAnswers[q.id];
      const isCorrect = evaluateQuestionAnswer(q, userAns);
      const isFlagged = flaggedQuestions.has(q.id);

      if (filter === 'incorrect' && isCorrect) return;
      if (filter === 'correct' && !isCorrect) return;
      if (filter === 'flagged' && !isFlagged) return;

      displayedCount++;

      const card = document.createElement('div');
      card.className = `review-card ${isCorrect ? 'review-correct' : 'review-incorrect'}`;

      const correctStr = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer;
      const userStr = userAns ? (Array.isArray(userAns) ? userAns.join(', ') : userAns) : 'Unanswered';

      const exp = q.explanation || {};
      let distractorsHtml = '';
      if (exp.distractors) {
        distractorsHtml = '<div style="margin-top:0.5rem;"><strong>⚡ Distractor Dissections:</strong><ul style="margin-left:1.25rem; font-size:0.8rem; margin-top:0.25rem;">';
        for (const [key, reason] of Object.entries(exp.distractors)) {
          distractorsHtml += `<li><strong>Option ${key}:</strong> ${reason}</li>`;
        }
        distractorsHtml += '</ul></div>';
      }

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.4rem; gap:0.5rem; flex-wrap:wrap;">
          <div>
            <span class="badge ${isCorrect ? 'badge-green' : 'badge-red'}">${isCorrect ? '✓ Correct' : '✗ Missed'}</span>
            <span style="font-weight:700; font-size:0.9rem; margin-left:0.35rem;">Q${idx + 1}: ${q.topic}</span>
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted);">${q.domain}</span>
        </div>

        <p style="font-size:0.825rem; color:#334155; margin-bottom:0.5rem;">
          ${q.scenario.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\n/g, ' ')}
        </p>

        <div style="font-size:0.8rem; margin-bottom:0.5rem; background:#f8fafc; padding:0.5rem 0.75rem; border-radius:6px;">
          <div><strong>Your Answer:</strong> <span class="${isCorrect ? 'text-green' : 'text-red'} font-bold">${userStr}</span></div>
          <div><strong>Correct Answer:</strong> <span class="text-green font-bold">${correctStr}</span></div>
        </div>

        <div style="font-size:0.8rem; color:#1e293b; line-height:1.5;">
          <strong>🎯 Core Azure Rule:</strong> ${exp.coreMechanic || exp.verdict || ''}
          ${distractorsHtml}
          <div style="margin-top:0.4rem; font-weight:600; color:#4f46e5;">💡 ${exp.heuristic || ''}</div>
          <div style="margin-top:0.4rem;"><a href="${exp.msLearnUrl || '#'}" target="_blank" style="color:#0284c7; font-weight:700; text-decoration:none;">Official Microsoft Learn Reference ↗</a></div>
        </div>
      `;

      dom.reviewQuestionsList.appendChild(card);
    });

    // Friendly empty state
    if (displayedCount === 0) {
      const emptyCard = document.createElement('div');
      emptyCard.style.padding = '2rem';
      emptyCard.style.textAlign = 'center';
      emptyCard.style.color = 'var(--text-muted)';
      emptyCard.style.fontSize = '0.9rem';

      if (filter === 'incorrect') {
        emptyCard.innerHTML = '🎉 <strong>Flawless execution!</strong> Zero missed questions matching this filter.';
      } else if (filter === 'flagged') {
        emptyCard.innerHTML = '🚩 <strong>No flagged questions.</strong> You did not flag any questions during this exam attempt.';
      } else {
        emptyCard.innerHTML = 'No questions match the current filter selection.';
      }
      dom.reviewQuestionsList.appendChild(emptyCard);
    }
  }

  // Error Journal Export Feature (6-part standard SOP)
  function openErrorJournalExportModal() {
    updateExportMarkdownContent();
    dom.exportModal.style.display = 'flex';
  }

  function updateExportMarkdownContent() {
    const filterType = dom.exportFilterSelect ? dom.exportFilterSelect.value : 'all-missed';

    let targetQuestions = [];
    if (filterType === 'missed') {
      // Attempted and incorrect only
      targetQuestions = activeQuestions.filter((q) => isQuestionAnswered(q.id) && !evaluateQuestionAnswer(q, userAnswers[q.id]));
    } else if (filterType === 'flagged') {
      targetQuestions = activeQuestions.filter((q) => flaggedQuestions.has(q.id));
    } else if (filterType === 'all') {
      targetQuestions = [...activeQuestions];
    } else {
      // all-missed: either incorrect or unanswered
      targetQuestions = activeQuestions.filter((q) => !evaluateQuestionAnswer(q, userAnswers[q.id]));
    }

    if (dom.exportCountLabel) {
      dom.exportCountLabel.textContent = `(${targetQuestions.length} questions selected)`;
    }

    if (targetQuestions.length === 0) {
      dom.exportMarkdownText.value = `# AZ-104 Error Journal Export\n\nNo questions match filter "${filterType}". Outstanding performance!`;
      return;
    }

    let markdown = `# AZ-104 Error Journal Export - ${new Date().toLocaleDateString()}\n`;
    markdown += `**Exam Attempt:** ${currentExamKey.toUpperCase()} | **Mode:** ${currentMode.toUpperCase()} | **Total Selected:** ${targetQuestions.length}\n\n`;

    targetQuestions.forEach((q) => {
      const userAns = userAnswers[q.id];
      const isCorrect = evaluateQuestionAnswer(q, userAns);
      const userStr = userAns ? (Array.isArray(userAns) ? userAns.join(', ') : userAns) : 'Unanswered';
      const correctStr = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer;
      const exp = q.explanation || {};

      markdown += `---\n\n`;
      markdown += `### [${q.domain}] ${q.topic}\n`;
      markdown += `* **1. Diagnostic Verdict:** ${isCorrect ? '✅ Correct' : '❌ Incorrect'} (User picked: ${userStr}; Correct is: ${correctStr})\n`;
      markdown += `* **2. The Scenario Trigger & Hidden Constraints:**\n`;
      markdown += `  * ${exp.triggerConstraints || 'Scenario constraint: ' + q.topic}\n`;
      markdown += `* **3. Flawed Mental Model:**\n`;
      markdown += `  * ${exp.flawedMentalModel || 'Assumed incorrect SKU tier, permission boundary, or syntax.'}\n`;
      markdown += `* **4. The Core Azure Mechanic (2026 Standard):**\n`;
      markdown += `  * ${exp.coreMechanic || exp.verdict || ''}\n`;
      markdown += `* **5. Distractor Killers:**\n`;

      if (exp.distractors && Object.keys(exp.distractors).length > 0) {
        for (const [key, reason] of Object.entries(exp.distractors)) {
          markdown += `  * *Option ${key}:* ${reason}\n`;
        }
      } else {
        markdown += `  * Refer to MS Learn specifications.\n`;
      }

      markdown += `* **6. Exam Heuristic:**\n`;
      markdown += `  * **"${exp.heuristic || 'Verify specific SKU prerequisites.'}"**\n`;
      markdown += `* **Reference:** [Microsoft Learn Docs](${exp.msLearnUrl || 'https://learn.microsoft.com'})\n\n`;
    });

    dom.exportMarkdownText.value = markdown;
  }

  function copyExportMarkdownToClipboard() {
    dom.exportMarkdownText.select();

    const showSuccess = () => {
      dom.copyFeedback.style.display = 'inline-block';
      showToast('Copied to clipboard in 6-part Error Journal SOP format!', 'success');
      setTimeout(() => {
        dom.copyFeedback.style.display = 'none';
      }, 3000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(dom.exportMarkdownText.value)
        .then(showSuccess)
        .catch(() => {
          fallbackCopy();
        });
    } else {
      fallbackCopy();
    }

    function fallbackCopy() {
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          showSuccess();
        } else {
          showToast('Please press Ctrl+C (Cmd+C) to copy the highlighted text.', 'info');
        }
      } catch (err) {
        showToast('Please manually copy the highlighted text.', 'info');
      }
    }
  }

  // History Modal
  function openHistoryModal() {
    renderHistoryTable();
    dom.historyModal.style.display = 'flex';
  }

  function renderHistoryTable() {
    dom.historyTableBody.innerHTML = '';
    const historyJson = localStorage.getItem(STORAGE_KEY_HISTORY);
    const history = historyJson ? JSON.parse(historyJson) : [];

    if (history.length === 0) {
      dom.historyTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:1rem;">No prior test attempts recorded on this device.</td></tr>`;
      return;
    }

    history.forEach((h) => {
      const row = document.createElement('tr');
      const dateStr = new Date(h.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
      const durationMin = Math.max(1, Math.round((h.timeSpentSeconds || 60) / 60));

      row.innerHTML = `
        <td>${dateStr}</td>
        <td><strong>${(h.examKey || 'EXAM1').toUpperCase()}</strong></td>
        <td>${h.mode || 'timed'}</td>
        <td><strong class="${h.passed ? 'text-green' : 'text-red'}">${h.scaledScore} / 1000 (${h.scorePct}%)</strong></td>
        <td>${h.correctCount} / ${h.totalQuestions}</td>
        <td><span class="badge ${h.passed ? 'badge-green' : 'badge-red'}">${h.passed ? 'PASS' : 'FAIL'}</span></td>
        <td>${durationMin} mins</td>
      `;
      dom.historyTableBody.appendChild(row);
    });
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
