# 🏥 BioMed OOP Lab — Python OOP Assessment Platform

> An interactive, browser-based Python OOP learning and assessment platform built around real-world **Biomedical Engineering** scenarios. Students write Python code directly in the browser, run it via Pyodide (WebAssembly Python), and receive instant AI-powered marks and feedback.

---

## 📸 Screenshots

```
┌─────────────────────────────────────────────────────────────┐
│  ⚕ BioMedOOP Lab        Home  Q1  Q2  Q3  Q4  Q5  Summary  │
├──────────────┬──────────────────────────────────────────────┤
│  Sidebar     │  Master OOP Through Medical Innovation        │
│  Navigation  │  ─────────────────────────────────────────   │
│              │  5 Questions · 125 Marks · 7 OOP Concepts    │
│  Progress:   │                                              │
│  ████░ 40%   │  [Q1 💉 Insulin]  [Q2 🏥 Inventory]         │
│  50 / 125    │  [Q3 💊 Drugs]    [Q4 📡 Signals]            │
│              │  [Q5 🔬 Vehicles]                            │
└──────────────┴──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  💉 Q1 · Smart Insulin Delivery System  [25 marks]          │
│  ┌──────────────────┬──────────────────────────────────┐   │
│  │ 📋 Question      │ ⌨ Python Editor                  │   │
│  │                  │  ▶ Run & Assess  💡 Hint  ⚠ Sol  │   │
│  │ Part a) Abstract │  ─────────────────────────────   │   │
│  │ base class...    │  from abc import ABC, abstract.. │   │
│  │                  │  class MedicalDevice(ABC):       │   │
│  │ Part b) Insulin  │      def __init__(self, ...):    │   │
│  │ Pump subclass... │          ...                     │   │
│  └──────────────────┴──────────────────────────────────┘   │
│  [🖥 Console Output]  [📊 Marks & Feedback]                 │
│  ✓ ABC imported (1/1)  ✓ Abstract class (2/2)  ✗ (0/3)    │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🖥 Interactive Coding Environment
- **Full CodeMirror editor** with Python syntax highlighting, line numbers, auto-indentation, bracket matching, and keyboard shortcuts
- **Pyodide (WebAssembly Python)** — real Python execution in the browser, no server required
- Supports all OOP features: `abc`, `datetime`, `random`, custom exceptions, `@property`, `__dunder__` methods

### 📊 Intelligent Assessment System
- **Dual evaluation**: static code analysis (rubric) + live execution (console output)
- **Partial marks** per criterion — e.g. `3/6` with specific feedback explaining what's missing
- **Initial score locked** on first submission; best score tracked across attempts
- Per-criterion status: ✅ Pass / ⚠ Partial / ❌ Fail with actionable feedback

### 💡 Progressive Hint System
- **Hint 1** (first click): Gentle conceptual nudge
- **Hint 2**: More specific guidance with code patterns
- **Hint 3**: Targeted help on the exact failing criterion
- Hints auto-advance after failed attempts — never gives the full solution unless explicitly requested

### 🔬 5 Biomedical OOP Questions
| # | Scenario | Marks | Key Concepts |
|---|----------|-------|-------------|
| Q1 | Smart Insulin Delivery System | 25 | Abstract Classes, Inheritance, Encapsulation |
| Q2 | Hospital Equipment Inventory | 25 | Composition, Magic Methods, Polymorphism |
| Q3 | Patient & Drug Management | 30 | Composition, Exception Handling, Polymorphism |
| Q4 | Biomedical Signal Processor | 20 | Abstract Classes, Polymorphism, `__add__` |
| Q5 | Drug Delivery Optimization | 25 | Properties, Custom Exceptions, Simulation |

### 📈 Progress & Reporting
- **LocalStorage persistence** — progress saved automatically, survives page refresh
- **Summary page** with animated score ring, per-question breakdown, progress bars
- **Personalised recommendations** — lists OOP topics to revise based on weak rubric criteria
- **Export as Markdown** — download a full assessment report

### 👨‍🏫 Teacher Mode
- Toggle per-question to reveal expected class structure (class names, parent classes)
- Useful for instructors demoing or for students stuck on architecture

---

## 🚀 How to Run Locally

### Option 1 — Open Directly (Simplest)
```bash
# Clone the repo
git clone https://github.com/your-username/biomedical-oop-lab.git
cd biomedical-oop-lab

# Open index.html in your browser
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

> ⚠️ **First load takes 20–30 seconds** — Pyodide (~8MB WebAssembly runtime) is downloaded from the CDN. Subsequent loads are fast due to browser caching.

### Option 2 — Local HTTP Server (Recommended for development)
```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .

# Then open: http://localhost:8080
```

### Option 3 — GitHub Pages (Zero setup hosting)
1. Push to GitHub
2. Go to **Settings → Pages → Deploy from branch → main / root**
3. Access at `https://your-username.github.io/biomedical-oop-lab/`

---

## 📁 Project Structure

```
biomedical-oop-lab/
│
├── index.html                  # App shell — all HTML structure
│
├── static/
│   ├── css/
│   │   └── main.css            # Dark medical theme, full responsive layout
│   │
│   └── js/
│       ├── questions.js        # All 5 question definitions
│       │                       #   • HTML question text
│       │                       #   • Starter code templates
│       │                       #   • 3 progressive hints each
│       │                       #   • Full model solutions
│       │
│       ├── rubrics.js          # Scoring rubrics (~40 criteria)
│       │                       #   • Per-criterion JS check functions
│       │                       #   • Mark allocations matching question specs
│       │
│       ├── assessor.js         # Core assessment engine
│       │                       #   • Pyodide loader & Python runner
│       │                       #   • Rubric evaluator (static analysis)
│       │                       #   • LocalStorage progress manager
│       │                       #   • Hint retrieval logic
│       │                       #   • OOP concept recommendations
│       │
│       └── app.js              # Main UI orchestrator
│                               #   • Page navigation
│                               #   • CodeMirror editor setup
│                               #   • Run/Assess/Hint/Solution handlers
│                               #   • Summary page builder
│                               #   • Markdown export
│                               #   • Reset functionality
│
└── README.md                   # This file
```

---

## 🔧 How It Works

### Code Execution (Pyodide)
```
User writes Python → clicks "Run & Assess"
    ↓
Code wrapped in stdout/stderr capture
    ↓
Pyodide executes Python in WebAssembly sandbox
    ↓
Output shown in Console tab
    ↓
Static rubric analysis runs in parallel
    ↓
Marks & Feedback tab populated
```

### Rubric Evaluation (Static Analysis)
Each criterion is a small JavaScript snippet that reads the student's code string and assigns a score. For example:

```javascript
// Check that InsulinPump correctly inherits MedicalDevice
const hasClass = /class\s+InsulinPump\s*\(\s*MedicalDevice\s*\)/.test(code);
const hasReservoir = code.includes('insulin_reservoir');
const hasBolus = code.includes('bolus_history');
if (hasClass && hasReservoir && hasBolus) { result.score = 3; }
```

This approach is:
- **Instant** — no round-trip to a server
- **Partial-marks friendly** — each criterion scores independently
- **Transparent** — students see exactly why marks were awarded/deducted

### Progress Storage
```javascript
localStorage['biomedOOP_v3'] = {
  q1: {
    initialScore: 14,    // locked after first attempt
    bestScore: 20,       // updates if improved
    attempts: 3,
    lastCode: "...",     // restores editor on refresh
    solutionViewed: false,
    hintLevel: 1
  },
  // q2..q5 same structure
}
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-deep` | `#080d14` | Page background |
| `--bg-card` | `#111c2b` | Card surfaces |
| `--teal` | `#00d4aa` | Primary accent, active states |
| `--blue` | `#0099ff` | Secondary accent, gradient |
| `--red` | `#ff4f6a` | Errors, danger actions |
| `--amber` | `#ffb340` | Warnings, hints |
| `--green` | `#2dce89` | Pass indicators |
| Font: Syne | 400/600/700/800 | Headings |
| Font: DM Sans | 300/400/500/600 | Body text |
| Font: DM Mono | 400/500 | Code, scores |

---

## ➕ How to Extend

### Add a New Question
1. **`questions.js`** — add a new entry to the `QUESTIONS` object:
```javascript
QUESTIONS.q6 = {
  id: 'q6',
  icon: '🧬',
  title: 'Your New Question Title',
  totalMarks: 20,
  concepts: ['Concept1', 'Concept2'],
  htmlContent: `<h3>Scenario</h3><p>...</p>`,
  starterCode: `# Starter code here`,
  hints: [
    '💡 Hint 1 — gentle nudge',
    '💡 Hint 2 — more specific',
    '💡 Hint 3 — targeted help'
  ],
  solution: `# Full model solution`
};
```

2. **`rubrics.js`** — add `RUBRICS.q6 = [...]` with criterion objects:
```javascript
{ id: 'my_check', label: 'My Criterion Label', marks: 5,
  check: `
    result.score = 0; result.feedback = "Not found.";
    if (/class\\s+MyClass/.test(code)) {
      result.score = 5; result.feedback = "MyClass correctly defined!";
    }
  `
}
```

3. **`index.html`** — add sidebar nav item and page section:
```html
<button class="nav-item" data-page="q6">
  <span class="nav-icon">🧬</span>
  <span class="nav-label">Q6 · New Question</span>
  <span class="nav-badge" id="badge-q6">20</span>
</button>
<!-- ... -->
<section id="page-q6" class="page"></section>
```

4. **`app.js`** — add `'q6'` to the arrays in `buildAllQuestionPages`, `updateGlobalUI`, and `Q_META`.

### Modify Rubric Criteria
Each criterion's `check` property is plain JavaScript. You have access to `code` (the student's code string) and `result` (object with `score` and `feedback`). Use regex, string matching, or any JS logic.

### Change the Theme
All colours are CSS custom properties in `main.css` under `:root`. Change `--teal`, `--blue`, etc. for a different colour scheme.

---

## 🌐 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 89+ | ✅ Full |
| Safari 15+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Chrome | ✅ Responsive |
| Mobile Safari | ✅ Responsive |

> Pyodide requires **SharedArrayBuffer** support. This is available in all modern browsers when served over HTTPS or localhost.

---

## 📚 OOP Concepts Covered

| Concept | Questions |
|---------|-----------|
| Abstract Base Classes (`abc.ABC`) | Q1, Q4, Q5 |
| `@abstractmethod` | Q1, Q4, Q5 |
| Inheritance & `super()` | Q1, Q2, Q3, Q5 |
| Method Overriding (Polymorphism) | Q1, Q2, Q3, Q4 |
| Encapsulation (`_private`, `@property`) | Q1, Q3, Q5 |
| Composition (HAS-A relationships) | Q2, Q3, Q4, Q5 |
| Magic / Dunder Methods | Q2, Q4, Q5 |
| Custom Exception Classes | Q1, Q2, Q3, Q5 |
| Exception Handling (`try`/`except`) | Q1, Q2, Q3, Q4 |
| `isinstance()` & Type Checking | Q2, Q4 |
| Simulation / Applied OOP | Q1, Q5 |

---

## 🛠 Dependencies (all CDN, no install needed)

| Library | Version | Purpose |
|---------|---------|---------|
| [Pyodide](https://pyodide.org) | 0.24.1 | WebAssembly Python runtime |
| [CodeMirror](https://codemirror.net) | 5.65.16 | Code editor with Python mode |
| [Google Fonts](https://fonts.google.com) | — | Syne, DM Sans, DM Mono |

No npm, no webpack, no build step. Pure HTML + CSS + JS.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-question-dna`
3. Add your question following the **Add a New Question** guide above
4. Submit a pull request with a description of the new OOP scenario

---

## 📄 License

MIT License — free to use for educational purposes.

---

## 👨‍💻 Author

Built for Biomedical Engineering OOP courses. Designed to make abstract OOP concepts tangible through medical device and clinical scenarios.

---

*"The best way to learn OOP is to build things that matter."*
