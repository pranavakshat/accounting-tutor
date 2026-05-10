# 📊 Accounting Exam Prep — Interactive Study Platform

A full-featured, Socratic-style accounting tutor built as a web app. Designed for managerial accounting finals. Instead of just showing answers, it walks students through every problem step by step with multiple-choice guidance, hints, and breakdowns when things go wrong.

**Live site:** [accounting-tutor-production-c503.up.railway.app](https://accounting-tutor-production-c503.up.railway.app)

---

## What It Does

### 🎯 Socratic Learning Flow
Every question is broken into steps. The app asks what to do first, gives you choices, and won't move on until you answer correctly. If you get it wrong twice, it breaks down the full solution — formula, numbers to use, and worked calculation — without just handing you the answer immediately.

### 📚 10 Chapters, 15 Questions Each (150 Total)
All questions are **parametric** — numbers randomize every session so you can't memorize answers, only the method.

| Chapter | Topic |
|---------|-------|
| Ch 1 | Cost Classification (product vs period, fixed vs variable, direct vs indirect) |
| Ch 2 | Job Order Costing (plantwide vs departmental overhead rates, two-job scenarios) |
| Ch 5 | Process Costing — Weighted Average (equivalent units, cost per EU, reconciliation) |
| Ch 6 | Cost-Volume-Profit Analysis (break-even, target profit, margin of safety, operating leverage) |
| Ch 7 | Variable vs Absorption Costing (unit costs, income differences, reconciliation) |
| Ch 8 | Master Budget (full 15-step chain: sales → production → RM → DL → OH → income statement) |
| Ch 9 | Variance Analysis (MPV, MQV, LRV, LEV, total variances, interpretation) |
| Ch 10 | ROI & Residual Income (margin, turnover, DuPont, goal congruence) |
| Ch 11 | Relevant Costs & Product Mix (special orders, make vs buy, discontinue, constrained resources) |
| Ch 12 | Capital Budgeting (NPV, IRR, payback period, simple rate of return, postaudit) |

### 👥 Multi-User Login
Students create their own username and password — no email required, no external auth service. Each user's progress is saved separately in the browser. Share the link with your class and everyone tracks their own progress independently.

### 🧮 Floating Calculator
A persistent calculator with memory store/recall (MS/MR) that stays open while you work through problems. Doesn't cover question content.

### 📋 Labeled Clipboard
A notepad where you can paste numbers and label them (e.g. "CM per unit = $18"). Keeps your working values visible across steps since the dropdown format hides previous answers.

### 📈 Progress Tracking
Dashboard shows completion percentage per chapter. Progress saves locally per user account and persists across sessions.

### 🛠️ Wrong Answer Handling
- **First wrong answer:** Red highlight + "Try again"
- **Second wrong answer:** Full breakdown panel showing the formula, the specific numbers to plug in, and the complete worked calculation

### 💡 Hint System
Two hint buttons on every question:
- **Formula hint** — reveals the formula to use (without numbers)
- **Numbers hint** — reveals the specific values to plug in

---

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS — no frameworks, no build step
- **Backend:** Node.js + Express (static file server only)
- **Auth:** localStorage-based username/password (no external service)
- **Progress:** localStorage, namespaced per user
- **Deployment:** Railway ([railway.app](https://railway.app))
- **Version control:** GitHub

---

## Running Locally

```bash
git clone https://github.com/pranavakshat/accounting-tutor.git
cd accounting-tutor
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
accounting-tutor/
├── server.js              # Express static server
├── package.json
├── railway.toml           # Railway deployment config
└── public/
    ├── index.html         # Single-page app shell + auth overlay
    └── js/
        ├── app.js         # Router, question renderer, wrong-answer logic
        ├── auth.js        # Multi-user login/register (localStorage)
        ├── progress.js    # Per-user progress tracking
        ├── calculator.js  # Floating calculator with MS/MR
        ├── clipboard.js   # Floating labeled notepad
        └── questions/
            ├── ch1.js     # Cost Classification (15 conceptual Q's)
            ├── ch2.js     # Job Order Costing (15 parametric Q's)
            ├── ch5.js     # Process Costing (15 parametric Q's)
            ├── ch6.js     # CVP Analysis (15 parametric Q's)
            ├── ch7.js     # Variable vs Absorption (15 parametric Q's)
            ├── ch8.js     # Master Budget (15-step chain)
            ├── ch9.js     # Variance Analysis (15 parametric Q's)
            ├── ch10.js    # ROI & Residual Income (15 parametric Q's)
            ├── ch11.js    # Relevant Costs (15 parametric Q's)
            └── ch12.js    # Capital Budgeting (15 parametric Q's)
```

---

## How Questions Work

Each chapter's `generate()` function randomizes inputs within accounting-valid constraints (e.g., selling price > variable cost, production quantities chain correctly through the master budget). The same formulas apply to different numbers every time.

```js
// Example: parametric break-even
var price = pick([40, 50, 60, 75]);
var varCost = Math.round(price * pick([0.40, 0.50, 0.60]));
var cm = price - varCost;
var fixedCosts = pick([1000, 2000, 3000]) * cm; // guarantees clean break-even
var beq = fixedCosts / cm; // always a whole number
```

Multi-step problems (like Ch 8 Master Budget) chain answers — units to produce feeds into raw materials needed, which feeds into purchase costs, and so on — so every intermediate result is consistent.

---

## Built With

Built collaboratively using [Claude](https://claude.ai) (Anthropic) as an AI pair programmer via Cowork mode. All chapter content derived from actual managerial accounting review problems (Foundational 15 sets).
