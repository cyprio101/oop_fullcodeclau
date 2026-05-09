// ═══════════════════════════════════════════════════════════════
//  BioMed OOP Lab — Assessor Module
//  Handles: Pyodide execution, rubric evaluation, score tracking
// ═══════════════════════════════════════════════════════════════

let pyodideReady = false;
let pyodideInstance = null;

// ── Load Pyodide ─────────────────────────────────────────────
async function initPyodide() {
  try {
    const bar = document.getElementById('loading-bar');
    const sub = document.querySelector('.loading-sub');
    if (bar) bar.style.width = '20%';

    if (sub) sub.textContent = 'Downloading Python runtime (~8MB)…';
    pyodideInstance = await loadPyodide();
    if (bar) bar.style.width = '75%';

    if (sub) sub.textContent = 'Warming up Python environment…';
    await pyodideInstance.runPythonAsync(`
import sys, io, traceback
from abc import ABC, abstractmethod
from datetime import date, datetime
import random
`);

    if (bar) bar.style.width = '100%';
    pyodideReady = true;

    setTimeout(() => {
      document.getElementById('loading-screen').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
    }, 350);

  } catch (err) {
    console.error('Pyodide failed:', err);
    document.getElementById('loading-screen').innerHTML = `
      <div class="loading-inner">
        <div style="color:#ff4f6a;font-size:1.3rem;margin-bottom:14px;">⚠ Runtime Failed to Load</div>
        <div style="color:#7a93b0;font-size:0.88rem;max-width:340px;text-align:center;line-height:1.6;">
          Could not load the Python runtime.<br/>Check your internet connection and refresh.
          <br/><br/><em style="font-size:0.78rem;">${err.message}</em>
        </div>
        <button onclick="location.reload()" style="margin-top:24px;padding:11px 28px;background:linear-gradient(135deg,#00d4aa,#0099ff);border:none;border-radius:8px;color:#fff;font-weight:700;font-size:0.95rem;cursor:pointer;">
          Refresh & Retry
        </button>
      </div>`;
  }
}

// ── Execute Python Code Safely ───────────────────────────────
async function runPythonCode(code) {
  if (!pyodideReady) {
    return { stdout: '', stderr: 'Python runtime not yet ready. Please wait.', error: true };
  }

  // Indent user code and capture stdout/stderr
  const indented = code.split('\n').map(l => '    ' + l).join('\n');
  const wrapped = `
import sys as _sys, io as _io, traceback as _tb

_out = _io.StringIO()
_err = _io.StringIO()
_saved_out, _saved_err = _sys.stdout, _sys.stderr
_sys.stdout = _out
_sys.stderr = _err
_ok = True

try:
${indented}
except Exception as _e:
    _ok = False
    _sys.stderr.write(_tb.format_exc())
finally:
    _sys.stdout = _saved_out
    _sys.stderr = _saved_err

(_out.getvalue(), _err.getvalue(), _ok)
`;

  try {
    const res = await pyodideInstance.runPythonAsync(wrapped);
    const arr = res && res.toJs ? res.toJs() : res;
    return {
      stdout: arr[0] || '',
      stderr: arr[1] || '',
      error:  !arr[2]
    };
  } catch (err) {
    return { stdout: '', stderr: err.message, error: true };
  }
}

// ── Evaluate Code Against Rubric (static analysis) ──────────
function evaluateCode(qid, code) {
  const rubric = RUBRICS[qid];
  if (!rubric) return { criteria: [], total: 0, max: 0 };

  const criteria = rubric.map(criterion => {
    const result = { score: 0, feedback: 'Not checked.' };
    try {
      // eslint-disable-next-line no-new-func
      new Function('code', 'result', criterion.check)(code, result);
    } catch (e) {
      result.score = 0;
      result.feedback = `Check error: ${e.message}`;
    }
    const scored = Math.min(Math.max(0, result.score), criterion.marks);
    return {
      id:       criterion.id,
      label:    criterion.label,
      marks:    criterion.marks,
      scored,
      feedback: result.feedback,
      status:   scored >= criterion.marks ? 'pass'
              : scored > 0               ? 'partial'
              :                            'fail'
    };
  });

  const total = criteria.reduce((s, c) => s + c.scored, 0);
  const max   = rubric.reduce((s, c) => s + c.marks,  0);
  return { criteria, total, max };
}

// ── LocalStorage Progress ────────────────────────────────────
const STORAGE_KEY = 'biomedOOP_v3';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch (e) { console.warn('localStorage write failed:', e); }
}

function getQProgress(qid) {
  return loadProgress()[qid] || {
    initialScore:   null,
    bestScore:      null,
    attempts:       0,
    lastCode:       '',
    solutionViewed: false,
    hintLevel:      0,
    lastResult:     null
  };
}

function setQProgress(qid, patch) {
  const all = loadProgress();
  all[qid] = { ...(all[qid] || {}), ...patch };
  saveProgress(all);
}

function resetAllProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

function getTotalScore() {
  const p = loadProgress();
  return ['q1','q2','q3','q4','q5'].reduce((sum, qid) => {
    const q = p[qid];
    return sum + (q && q.bestScore !== null ? q.bestScore : 0);
  }, 0);
}

// ── Hint retrieval ───────────────────────────────────────────
function getHint(qid, hintLevel) {
  const q = QUESTIONS[qid];
  if (!q || !q.hints || q.hints.length === 0) return null;
  return q.hints[Math.min(hintLevel, q.hints.length - 1)];
}

// ── Personalised Recommendations ────────────────────────────
const CONCEPT_MAP = {
  abc_import:         'Abstract Base Classes (abc module)',
  medical_device_class:'Abstract Classes & ABC',
  check_battery:      'Method Implementation',
  insulin_pump:       'Inheritance & super()',
  deliver_therapy_pump:'Method Overriding & Logic',
  glucose_monitor:    'Polymorphism',
  encapsulation:      'Encapsulation & @property',
  exception_handling: 'Exception Handling (try/except)',
  main_script:        'Applied OOP / Scripting',
  equipment_base:     'Base Class Design',
  equipment_methods:  'Method Implementation & Dates',
  imaging_device:     'Inheritance & Method Overriding',
  monitoring_device:  'Inheritance & super()',
  hospital_inventory: 'Composition',
  inventory_methods:  'Composition & isinstance()',
  error_handling:     'Exception Handling',
  magic_methods:      'Magic / Dunder Methods',
  demonstration:      'Applied OOP / Integration',
  patient_class:      'Class Design & Encapsulation',
  patient_methods:    'Method Implementation',
  medication_base:    'Base Class & Inheritance',
  allergy_check:      'Exception Handling & Custom Errors',
  infusion_medication:'Polymorphism & Inheritance',
  oral_medication:    'Inheritance & State Management',
  treatment_plan:     'Composition',
  simulation:         'Simulation & Exception Handling',
  abstract_processor: 'Abstract Classes',
  processor_load:     'Method Implementation',
  ecg_processor:      'Concrete Subclasses & Algorithms',
  eeg_processor:      'Concrete Subclasses & Signal Processing',
  patient_monitor:    'Composition & Polymorphism',
  add_magic:          'Magic Methods (__add__)',
  poly_demo:          'Polymorphism',
  base_vehicle:       'Abstract Classes & Protected Attributes',
  vehicle_methods:    'Method Implementation',
  nanoparticle:       'Inheritance & Release Profiles',
  liposome:           'Inheritance & Burst Release',
  formulation_lab:    'Composition & Optimisation',
  properties:         '@property & Encapsulation',
  custom_exceptions:  'Custom Exception Classes',
  magic_methods_v5:   'Magic / Dunder Methods',
  simulation_24h:     'Simulation Design & OOP Integration'
};

function getRecommendations(allResults) {
  const weak = new Set();
  Object.values(allResults).forEach(res => {
    if (!res || !res.criteria) return;
    res.criteria.forEach(c => {
      if (c.status !== 'pass') {
        const concept = CONCEPT_MAP[c.id];
        if (concept) weak.add(concept);
      }
    });
  });
  return [...weak].slice(0, 7);
}
