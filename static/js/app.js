// ═══════════════════════════════════════════════════════════════
//  BioMed OOP Lab — Main Application
//  Orchestrates: navigation, CodeMirror editors, run/assess/
//  hint/solution flows, progress tracking, summary page.
// ═══════════════════════════════════════════════════════════════

// ── State ────────────────────────────────────────────────────
const editors       = {};   // qid → CodeMirror instance
const lastRunResult = {};   // qid → { criteria, total, max }
let   currentPage   = 'home';
let   teacherMode   = false;

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupMobileMenu();
  setupResetButton();
  buildAllQuestionPages();
  restoreEditorContents();
  updateGlobalUI();
  initPyodide();   // defined in assessor.js — starts loading screen
});

// ═══════════════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════════════
function setupNavigation() {
  document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });
}

function navigate(pageId) {
  // hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');

  const btn = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (btn) btn.classList.add('active');

  currentPage = pageId;

  // refresh CodeMirror layout when switching to a question page
  if (editors[pageId]) {
    setTimeout(() => editors[pageId].refresh(), 50);
  }

  // rebuild summary when navigating to it
  if (pageId === 'summary') buildSummaryPage();

  // close mobile menu
  document.getElementById('sidebar').classList.remove('mobile-open');

  window.scrollTo(0, 0);
}

function scrollToResources() {
  document.getElementById('resources-section')?.scrollIntoView({ behavior: 'smooth' });
}

// ── Mobile menu ──────────────────────────────────────────────
function setupMobileMenu() {
  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('mobile-open');
  });
}

// ═══════════════════════════════════════════════════════════════
//  BUILD QUESTION PAGES
// ═══════════════════════════════════════════════════════════════
function buildAllQuestionPages() {
  ['q1','q2','q3','q4','q5'].forEach(buildQuestionPage);
}

function buildQuestionPage(qid) {
  const q    = QUESTIONS[qid];
  const page = document.getElementById('page-' + qid);
  if (!q || !page) return;

  const qIndex = ['q1','q2','q3','q4','q5'].indexOf(qid) + 1;
  const qNext  = qIndex < 5 ? `q${qIndex + 1}` : 'summary';
  const prog   = getQProgress(qid);

  page.innerHTML = `
    <!-- Header -->
    <div class="q-header">
      <div class="q-header-icon">${q.icon}</div>
      <div class="q-header-info">
        <div class="q-num-tag">Question ${qIndex} of 5 · ${q.totalMarks} marks</div>
        <div class="q-title">${q.title}</div>
        <div class="q-meta">
          ${q.concepts.map(c => `<span>${c}</span>`).join('')}
        </div>
      </div>
    </div>

    <!-- Score tracker -->
    <div class="score-tracker" id="tracker-${qid}">
      <div>
        <div class="score-tracker-label">Initial Score</div>
        <div class="score-tracker-val initial" id="initial-score-${qid}">
          ${prog.initialScore !== null ? prog.initialScore + ' / ' + q.totalMarks : '—'}
        </div>
      </div>
      <div class="score-tracker-divider"></div>
      <div>
        <div class="score-tracker-label">Best Score</div>
        <div class="score-tracker-val best" id="best-score-${qid}">
          ${prog.bestScore !== null ? prog.bestScore + ' / ' + q.totalMarks : '—'}
        </div>
      </div>
      <div class="score-tracker-divider"></div>
      <div>
        <div class="score-tracker-label">Attempts</div>
        <div class="score-tracker-val" id="attempts-${qid}" style="color:var(--text-sec)">
          ${prog.attempts}
        </div>
      </div>
    </div>

    <!-- Two-column layout: question | editor -->
    <div class="q-layout">

      <!-- LEFT: Question text -->
      <div class="q-panel">
        <div class="q-panel-head">
          <span class="q-panel-title">📋 Question</span>
          <div class="q-panel-actions">
            <button class="tb-btn" onclick="toggleTeacherPanel('${qid}')" title="Teacher mode: show expected class structure">
              👨‍🏫 Teacher View
            </button>
          </div>
        </div>
        <div class="question-text-body">
          ${q.htmlContent}
          <div id="teacher-panel-${qid}" class="teacher-panel hidden">
            ${buildTeacherPanel(q)}
          </div>
        </div>
      </div>

      <!-- RIGHT: Code editor -->
      <div class="q-panel">
        <div class="q-panel-head">
          <span class="q-panel-title">⌨ Python Editor</span>
          <div class="q-panel-actions">
            <button class="tb-btn" onclick="resetEditor('${qid}')" title="Reset to starter code">↺ Reset</button>
            <button class="tb-btn" onclick="copyCode('${qid}')">⧉ Copy</button>
          </div>
        </div>
        <div class="editor-toolbar">
          <button class="tb-btn primary" id="run-btn-${qid}" onclick="handleRun('${qid}')">
            ▶ Run &amp; Assess
          </button>
          <button class="tb-btn" onclick="handleHint('${qid}')">💡 Hint</button>
          <button class="tb-btn danger" onclick="handleShowSolution('${qid}')">⚠ Show Solution</button>
          <button class="tb-btn" style="margin-left:auto" onclick="navigate('${qNext}')">
            ${qNext === 'summary' ? '📊 View Summary →' : 'Next Q →'}
          </button>
        </div>
        <div class="editor-wrap">
          <textarea id="editor-${qid}">${escapeHtml(q.starterCode)}</textarea>
        </div>
      </div>
    </div>

    <!-- Output section -->
    <div class="output-section">
      <div class="out-tabs">
        <button class="out-tab active" onclick="switchTab('${qid}','console')">🖥 Console Output</button>
        <button class="out-tab" onclick="switchTab('${qid}','marks')">📊 Marks &amp; Feedback</button>
      </div>
      <div class="out-panel active" id="tab-console-${qid}">
        <div class="console-out" id="console-${qid}">
          <span style="color:var(--text-muted)">Click <strong>▶ Run &amp; Assess</strong> to execute your code and see results here.</span>
        </div>
      </div>
      <div class="out-panel" id="tab-marks-${qid}">
        <div id="marks-panel-${qid}">
          <span style="color:var(--text-muted);font-size:0.85rem">Run your code first to see the marks breakdown.</span>
        </div>
      </div>
    </div>
  `;

  // initialise CodeMirror on the textarea
  const ta = document.getElementById('editor-' + qid);
  if (ta) {
    editors[qid] = CodeMirror.fromTextArea(ta, {
      mode:            'python',
      theme:           'dracula',
      lineNumbers:     true,
      indentUnit:      4,
      tabSize:         4,
      indentWithTabs:  false,
      autoCloseBrackets: true,
      matchBrackets:   true,
      extraKeys: {
        'Tab': cm => cm.replaceSelection('    '),
        'Ctrl-/': 'toggleComment',
        'Cmd-/':  'toggleComment'
      }
    });
    editors[qid].setSize(null, 460);
  }
}

// ── Teacher Panel HTML ───────────────────────────────────────
function buildTeacherPanel(q) {
  const classNames = extractClassNames(q.solution || '');
  return `
    <div class="teacher-panel-title">👨‍🏫 Expected Class Structure</div>
    <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">
      Classes and key methods the solution should contain:
    </div>
    ${classNames.map(cls => `
      <div class="class-req">
        <span style="color:var(--teal)">▸</span>
        <code>${cls.name}</code>
        <span style="color:var(--text-muted);font-size:0.75rem;">${cls.parent ? '(' + cls.parent + ')' : ''}</span>
      </div>
    `).join('')}
  `;
}

function extractClassNames(code) {
  const matches = [...code.matchAll(/class\s+(\w+)(?:\s*\(\s*(\w+)\s*\))?/g)];
  return matches.map(m => ({ name: m[1], parent: m[2] || '' }));
}

function toggleTeacherPanel(qid) {
  const panel = document.getElementById('teacher-panel-' + qid);
  if (panel) panel.classList.toggle('hidden');
}

// ═══════════════════════════════════════════════════════════════
//  RUN & ASSESS
// ═══════════════════════════════════════════════════════════════
async function handleRun(qid) {
  const btn = document.getElementById('run-btn-' + qid);
  if (btn) { btn.textContent = '⏳ Running…'; btn.disabled = true; }

  switchTab(qid, 'console');

  const code = editors[qid] ? editors[qid].getValue() : '';
  const consoleEl = document.getElementById('console-' + qid);

  // Run code
  const { stdout, stderr, error } = await runPythonCode(code);

  // Render console output
  if (consoleEl) {
    let html = '';
    if (stdout) {
      html += stdout.split('\n').map(line =>
        `<span class="${line.toLowerCase().includes('error') ? 'err-line' : ''}">${escapeHtml(line)}</span>`
      ).join('\n');
    }
    if (stderr) {
      html += `\n<span class="err-line">${escapeHtml(stderr)}</span>`;
    }
    if (!stdout && !stderr) {
      html = '<span style="color:var(--text-muted)">(no output)</span>';
    }
    consoleEl.innerHTML = html;
  }

  // Static rubric assessment
  const evalResult = evaluateCode(qid, code);
  lastRunResult[qid] = evalResult;

  // Update progress
  const prog = getQProgress(qid);
  const newAttempts = prog.attempts + 1;
  const prevBest    = prog.bestScore;
  const newBest     = prevBest === null ? evalResult.total
                    : Math.max(prevBest, evalResult.total);
  const newInitial  = prog.initialScore === null ? evalResult.total : prog.initialScore;

  setQProgress(qid, {
    attempts:     newAttempts,
    bestScore:    newBest,
    initialScore: newInitial,
    lastCode:     code,
    lastResult:   evalResult
  });

  // Render marks panel
  renderMarksPanel(qid, evalResult, prog.solutionViewed);

  // Update tracker display
  document.getElementById('initial-score-' + qid).textContent =
    newInitial + ' / ' + QUESTIONS[qid].totalMarks;
  document.getElementById('best-score-' + qid).textContent =
    newBest + ' / ' + QUESTIONS[qid].totalMarks;
  document.getElementById('attempts-' + qid).textContent = newAttempts;

  // Hint bump: if score did not improve and > 0 attempts
  if (newAttempts > 1 && evalResult.total <= (prog.bestScore || 0)) {
    const prog2 = getQProgress(qid);
    setQProgress(qid, { hintLevel: Math.min((prog2.hintLevel || 0) + 1, 2) });
  }

  updateGlobalUI();
  switchTab(qid, 'marks');

  if (btn) { btn.textContent = '▶ Run & Assess'; btn.disabled = false; }
}

// ── Marks Panel Renderer ─────────────────────────────────────
function renderMarksPanel(qid, evalResult, solutionViewed) {
  const panel = document.getElementById('marks-panel-' + qid);
  if (!panel) return;

  const pct = evalResult.max > 0
    ? Math.round(evalResult.total / evalResult.max * 100)
    : 0;

  const gradeColor = pct >= 75 ? 'var(--green)'
                   : pct >= 50 ? 'var(--amber)'
                   : 'var(--red)';

  let html = `
    <div class="marks-total-line">
      <span class="marks-total-label">Score</span>
      <span class="marks-total-score" style="color:${gradeColor}">
        ${evalResult.total} / ${evalResult.max}
        <span style="font-size:0.75rem;color:var(--text-muted);margin-left:6px;">(${pct}%)</span>
      </span>
    </div>
  `;

  if (solutionViewed) {
    html += `<div class="hint-box" style="margin-bottom:14px;border-color:rgba(255,79,106,0.3);background:var(--red-dim)">
      <div class="hint-box-title" style="color:var(--red)">⚠ Solution Viewed</div>
      Score for this question has been zeroed because you revealed the solution.
    </div>`;
  }

  evalResult.criteria.forEach(c => {
    const icon = c.status === 'pass'    ? '✓'
               : c.status === 'partial' ? '◑'
               : '✗';
    html += `
      <div class="rubric-item">
        <div class="rubric-check ${c.status}">${icon}</div>
        <div class="rubric-info">
          <div class="rubric-criterion">${c.label}</div>
          <div class="rubric-feedback">${c.feedback}</div>
        </div>
        <div class="rubric-score-chip ${c.status}">${c.scored}/${c.marks}</div>
      </div>`;
  });

  panel.innerHTML = html;
}

// ─ Tab switcher ──────────────────────────────────────────────
function switchTab(qid, tab) {
  ['console','marks'].forEach(t => {
    document.getElementById(`tab-${t}-${qid}`)?.classList.toggle('active', t === tab);
  });
  document.querySelectorAll(`#page-${qid} .out-tab`).forEach((btn, i) => {
    btn.classList.toggle('active', (i === 0 && tab === 'console') || (i === 1 && tab === 'marks'));
  });
}

// ═══════════════════════════════════════════════════════════════
//  HINT SYSTEM
// ═══════════════════════════════════════════════════════════════
function handleHint(qid) {
  const prog  = getQProgress(qid);
  const hint  = getHint(qid, prog.hintLevel || 0);
  if (!hint) {
    showToast('No more hints available for this question.', 'info');
    return;
  }
  showToast(hint);
  setQProgress(qid, { hintLevel: Math.min((prog.hintLevel || 0) + 1, 2) });
}

function showToast(msg, type = 'hint') {
  const toast = document.getElementById('hint-toast');
  const body  = document.getElementById('toast-body');
  if (!toast || !body) return;
  body.textContent = msg.replace(/^💡\s*/, '');
  toast.classList.remove('hidden');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => closeToast(), 8000);
}

function closeToast() {
  document.getElementById('hint-toast')?.classList.add('hidden');
}

// ═══════════════════════════════════════════════════════════════
//  SHOW SOLUTION
// ═══════════════════════════════════════════════════════════════
function handleShowSolution(qid) {
  showModal(
    '⚠ Show Solution?',
    `Revealing the solution will <strong>zero your score</strong> for this question and it cannot be recovered. Use this only as a last resort after multiple attempts.<br/><br/>Are you sure you want to proceed?`,
    () => {
      const q = QUESTIONS[qid];
      if (editors[qid] && q.solution) {
        editors[qid].setValue(q.solution);
      }
      setQProgress(qid, { solutionViewed: true, bestScore: 0, initialScore: getQProgress(qid).initialScore });
      updateGlobalUI();
      // re-render marks panel if it was already shown
      if (lastRunResult[qid]) {
        renderMarksPanel(qid, lastRunResult[qid], true);
      }
      document.getElementById('best-score-' + qid).textContent = '0 / ' + q.totalMarks;
    }
  );
}

// ═══════════════════════════════════════════════════════════════
//  EDITOR UTILITIES
// ═══════════════════════════════════════════════════════════════
function resetEditor(qid) {
  const q = QUESTIONS[qid];
  if (!q || !editors[qid]) return;
  showModal(
    '↺ Reset Editor?',
    'This will replace your current code with the starter template. Your progress data is kept but your code will be lost.',
    () => { editors[qid].setValue(q.starterCode); }
  );
}

function copyCode(qid) {
  const code = editors[qid] ? editors[qid].getValue() : '';
  navigator.clipboard.writeText(code).then(() => {
    showToast('Code copied to clipboard!', 'info');
  }).catch(() => {
    showToast('Copy failed — please select and copy manually.', 'info');
  });
}

function restoreEditorContents() {
  ['q1','q2','q3','q4','q5'].forEach(qid => {
    const prog = getQProgress(qid);
    if (prog.lastCode && editors[qid]) {
      editors[qid].setValue(prog.lastCode);
    }
  });
}

// ═══════════════════════════════════════════════════════════════
//  GLOBAL UI UPDATES (sidebar badges, progress bar, score)
// ═══════════════════════════════════════════════════════════════
const Q_MAX = { q1:25, q2:25, q3:30, q4:20, q5:25 };
const TOTAL_MAX = 125;

function updateGlobalUI() {
  let totalScore = 0;

  ['q1','q2','q3','q4','q5'].forEach(qid => {
    const prog  = getQProgress(qid);
    const best  = prog.bestScore;
    const badge = document.getElementById('badge-' + qid);

    if (best !== null) {
      totalScore += best;
      if (badge) {
        badge.textContent = best + '/' + Q_MAX[qid];
        badge.classList.add('scored');
      }
      // Update question card status on home page
      const cardStatus = document.getElementById('card-status-' + qid);
      if (cardStatus) {
        const pct = best / Q_MAX[qid] * 100;
        if (pct >= 80) {
          cardStatus.textContent = '✓ Completed — ' + best + '/' + Q_MAX[qid];
          cardStatus.className = 'qcard-status completed';
        } else {
          cardStatus.textContent = '⟳ In Progress — ' + best + '/' + Q_MAX[qid];
          cardStatus.className = 'qcard-status started';
        }
      }
    }
  });

  const pct = Math.round(totalScore / TOTAL_MAX * 100);
  const bar = document.getElementById('global-progress-bar');
  if (bar) bar.style.width = pct + '%';

  const scoreDisp = document.getElementById('global-score-display');
  if (scoreDisp) scoreDisp.textContent = totalScore + ' / ' + TOTAL_MAX;

  const mobileScore = document.getElementById('mobile-score');
  if (mobileScore) mobileScore.textContent = totalScore + '/' + TOTAL_MAX;
}

// ═══════════════════════════════════════════════════════════════
//  SUMMARY PAGE
// ═══════════════════════════════════════════════════════════════
const Q_META = [
  { id:'q1', icon:'💉', title:'Smart Insulin Delivery System',              max:25 },
  { id:'q2', icon:'🏥', title:'Hospital Inventory Management',              max:25 },
  { id:'q3', icon:'💊', title:'Patient Record & Drug Delivery Management',  max:30 },
  { id:'q4', icon:'📡', title:'Biomedical Signal Processor',                max:20 },
  { id:'q5', icon:'🔬', title:'Drug Formulation & Delivery Optimization',   max:25 }
];

function buildSummaryPage() {
  const progress = loadProgress();
  let totalScore = 0;
  const allResults = {};

  Q_META.forEach(q => {
    const p = progress[q.id];
    if (p && p.bestScore !== null) totalScore += p.bestScore;
    if (p && p.lastResult) allResults[q.id] = p.lastResult;
  });

  const pct   = Math.round(totalScore / TOTAL_MAX * 100);
  const grade = pct >= 85 ? 'Distinction 🏆'
              : pct >= 70 ? 'Merit ⭐'
              : pct >= 50 ? 'Pass ✓'
              : 'Needs Work 📚';

  // Animate score ring
  const circle = document.getElementById('score-ring-circle');
  if (circle) {
    const circumference = 502;
    const offset = circumference - (pct / 100) * circumference;
    setTimeout(() => {
      circle.style.transition = 'stroke-dashoffset 1.2s ease';
      circle.style.strokeDashoffset = offset;
    }, 100);
  }

  const totalEl = document.getElementById('summary-total-score');
  if (totalEl) animateNumber(totalEl, 0, totalScore, 1200);

  const gradeEl = document.getElementById('summary-grade');
  if (gradeEl) gradeEl.textContent = grade + ' (' + pct + '%)';

  // Breakdown rows
  const breakdown = document.getElementById('summary-breakdown');
  if (breakdown) {
    breakdown.innerHTML = Q_META.map(q => {
      const p      = progress[q.id];
      const best   = p?.bestScore ?? null;
      const init   = p?.initialScore ?? null;
      const atts   = p?.attempts ?? 0;
      const viewed = p?.solutionViewed ?? false;

      const barPct = best !== null ? Math.round(best / q.max * 100) : 0;
      const barColor = barPct >= 75 ? 'var(--green)'
                     : barPct >= 50 ? 'var(--amber)'
                     : best !== null ? 'var(--red)' : 'var(--text-muted)';

      return `
        <div class="sb-item">
          <div class="sb-icon">${q.icon}</div>
          <div class="sb-info">
            <div class="sb-title">${q.title}</div>
            <div class="sb-sub">
              Attempts: ${atts}
              ${viewed ? ' · <span style="color:var(--red)">Solution viewed</span>' : ''}
            </div>
            <div style="margin-top:6px;background:var(--bg-input);border-radius:99px;height:5px;overflow:hidden;">
              <div style="width:${barPct}%;height:100%;background:${barColor};border-radius:99px;transition:width 1s ease;"></div>
            </div>
          </div>
          <div class="sb-scores">
            <div class="sb-score-main" style="color:${barColor}">${best ?? '—'} / ${q.max}</div>
            <div class="sb-score-init">Initial: ${init ?? '—'}</div>
          </div>
        </div>`;
    }).join('');
  }

  // Recommendations
  const recs    = getRecommendations(allResults);
  const recsEl  = document.getElementById('summary-recommendations');
  if (recsEl) {
    if (recs.length === 0) {
      recsEl.innerHTML = `
        <div class="summary-recs" style="background:var(--green-dim);border-color:rgba(45,206,137,0.3);">
          <div class="recs-title" style="color:var(--green)">🎉 Excellent Work!</div>
          <div class="rec-item" style="color:var(--text-sec)">You've passed all rubric criteria. Review the solutions for any edge cases.</div>
        </div>`;
    } else {
      recsEl.innerHTML = `
        <div class="summary-recs">
          <div class="recs-title">📚 Recommended Revision Topics</div>
          ${recs.map(r => `<div class="rec-item">${r}</div>`).join('')}
        </div>`;
    }
  }
}

function animateNumber(el, from, to, duration) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(from + (to - from) * easeOut(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

// ═══════════════════════════════════════════════════════════════
//  EXPORT AS MARKDOWN
// ═══════════════════════════════════════════════════════════════
function exportMarkdown() {
  const progress = loadProgress();
  let totalScore = 0;

  let md = `# BioMed OOP Lab — Assessment Report\n\n`;
  md += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
  md += `---\n\n`;
  md += `## Score Summary\n\n`;
  md += `| Question | Title | Best Score | Initial Score | Attempts |\n`;
  md += `|----------|-------|-----------|--------------|----------|\n`;

  Q_META.forEach(q => {
    const p    = progress[q.id];
    const best = p?.bestScore ?? '—';
    const init = p?.initialScore ?? '—';
    const atts = p?.attempts ?? 0;
    if (p?.bestScore != null) totalScore += p.bestScore;
    md += `| ${q.icon} ${q.id.toUpperCase()} | ${q.title} | ${best}/${q.max} | ${init}/${q.max} | ${atts} |\n`;
  });

  const pct = Math.round(totalScore / TOTAL_MAX * 100);
  md += `\n**Total: ${totalScore} / ${TOTAL_MAX} (${pct}%)**\n\n`;
  md += `---\n\n`;

  // Per-question breakdown
  md += `## Detailed Breakdown\n\n`;
  Q_META.forEach(q => {
    const p = progress[q.id];
    if (!p || !p.lastResult) return;
    md += `### ${q.icon} ${q.title} — ${p.bestScore}/${q.max}\n\n`;
    p.lastResult.criteria.forEach(c => {
      const icon = c.status === 'pass' ? '✅' : c.status === 'partial' ? '⚠️' : '❌';
      md += `- ${icon} **${c.label}** (${c.scored}/${c.marks}): ${c.feedback}\n`;
    });
    md += `\n`;
  });

  // Recommendations
  const allResults = {};
  Q_META.forEach(q => {
    const p = progress[q.id];
    if (p?.lastResult) allResults[q.id] = p.lastResult;
  });
  const recs = getRecommendations(allResults);
  if (recs.length > 0) {
    md += `---\n\n## Recommended Revision Topics\n\n`;
    recs.forEach(r => { md += `- ${r}\n`; });
  }

  // Download
  const blob = new Blob([md], { type: 'text/markdown' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'BioMedOOP_Report.md';
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════════════════════════
let _modalCallback = null;

function showModal(title, body, onConfirm) {
  _modalCallback = onConfirm;
  document.getElementById('modal-title').textContent  = title;
  document.getElementById('modal-body').innerHTML     = body;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  _modalCallback = null;
}

document.getElementById('modal-confirm')?.addEventListener('click', () => {
  if (_modalCallback) _modalCallback();
  closeModal();
});
document.getElementById('modal-cancel')?.addEventListener('click', closeModal);
document.getElementById('modal-overlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// ═══════════════════════════════════════════════════════════════
//  RESET
// ═══════════════════════════════════════════════════════════════
function setupResetButton() {
  document.getElementById('reset-btn')?.addEventListener('click', () => {
    showModal(
      '↺ Reset All Progress',
      'This will permanently erase all your scores, attempts, and saved code for every question. This cannot be undone.',
      () => {
        resetAllProgress();
        ['q1','q2','q3','q4','q5'].forEach(qid => {
          const q = QUESTIONS[qid];
          if (editors[qid] && q) editors[qid].setValue(q.starterCode);

          // Reset UI elements
          const initialEl = document.getElementById('initial-score-' + qid);
          const bestEl    = document.getElementById('best-score-' + qid);
          const attEl     = document.getElementById('attempts-' + qid);
          const badge     = document.getElementById('badge-' + qid);
          const console_  = document.getElementById('console-' + qid);
          const marks_    = document.getElementById('marks-panel-' + qid);
          const cardSt    = document.getElementById('card-status-' + qid);

          if (initialEl) initialEl.textContent = '—';
          if (bestEl)    bestEl.textContent    = '—';
          if (attEl)     attEl.textContent     = '0';
          if (badge) { badge.textContent = Q_MAX[qid]; badge.classList.remove('scored'); }
          if (console_)  console_.innerHTML    = '<span style="color:var(--text-muted)">Click ▶ Run & Assess to execute your code.</span>';
          if (marks_)    marks_.innerHTML      = '<span style="color:var(--text-muted);font-size:0.85rem">Run your code first.</span>';
          if (cardSt) { cardSt.textContent = 'Not Started'; cardSt.className = 'qcard-status'; }
        });
        updateGlobalUI();
      }
    );
  });
}

// ═══════════════════════════════════════════════════════════════
//  UTILITY
// ═══════════════════════════════════════════════════════════════
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
