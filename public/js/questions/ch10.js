window.CH10 = {
  title: "Chapter 10 — Return on Investment & Residual Income",
  description: "ROI, margin, turnover, and residual income calculations",
  formulas: [
    "ROI = Net Operating Income ÷ Average Operating Assets",
    "Margin = Net Operating Income ÷ Sales",
    "Turnover = Sales ÷ Average Operating Assets",
    "ROI = Margin × Turnover",
    "Residual Income = Net Operating Income − (Min Required Return × Operating Assets)"
  ],
  definitions: [
    { q: "Which formula correctly expresses ROI?", choices: ["A. Sales ÷ Assets", "B. Net Income ÷ Sales", "C. Net Operating Income ÷ Average Operating Assets", "D. Assets ÷ Net Operating Income"], correct: 2, exp: "ROI = NOI ÷ Operating Assets. It measures how much profit is generated per dollar of invested assets." },
    { q: "Residual income is positive when:", choices: ["A. ROI exceeds the minimum required return", "B. Sales exceed total costs", "C. Assets exceed liabilities", "D. Margin is greater than turnover"], correct: 0, exp: "RI = NOI − (Min rate × Assets). It's positive when the division earns more than the minimum required return." }
  ],
  generate: function() {
    var salesOptions = [500000, 750000, 1000000, 1250000, 1500000, 2000000];
    var marginPcts = [0.08, 0.10, 0.12, 0.15, 0.18, 0.20];
    var turnoverOptions = [1.0, 1.25, 1.5, 2.0, 2.5];
    var minReturnOptions = [0.10, 0.12, 0.15, 0.18, 0.20];

    var sales = salesOptions[Math.floor(Math.random() * salesOptions.length)];
    var margin = marginPcts[Math.floor(Math.random() * marginPcts.length)];
    var turnover = turnoverOptions[Math.floor(Math.random() * turnoverOptions.length)];
    var minReturn = minReturnOptions[Math.floor(Math.random() * minReturnOptions.length)];

    var noi = Math.round(sales * margin);
    var assets = Math.round(sales / turnover);
    var roi = noi / assets;
    var ri = noi - (minReturn * assets);

    var fmt = function(n) { return '$' + Math.round(n).toLocaleString(); };
    var fmtP = function(n) { return (Math.round(n * 1000) / 10) + '%'; };

    function mcDollar(correct, wrongs) {
      var cR = Math.round(correct);
      var pool = [cR];
      wrongs.forEach(function(w) {
        var r = Math.round(w);
        if (r !== cR && pool.indexOf(r) === -1) pool.push(r);
      });
      var k = 1;
      while (pool.length < 4) {
        var f = Math.round(cR * (1 + 0.13 * k) + 137 * k);
        if (pool.indexOf(f) === -1) pool.push(f);
        k++;
        if (k > 50) break;
      }
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var letters = ['A', 'B', 'C', 'D'];
      return { choices: s.map(function(v, i) { return letters[i] + '. ' + fmt(v); }), correct: s.indexOf(cR) };
    }

    function mcPct(correct, wrongs) {
      // Compare on rounded-to-tenth-of-percent (same precision as fmtP)
      var key = function(v) { return Math.round(v * 1000); };
      var cK = key(correct);
      var pool = [correct];
      var seen = [cK];
      wrongs.forEach(function(w) {
        var k = key(w);
        if (k !== cK && seen.indexOf(k) === -1) { pool.push(w); seen.push(k); }
      });
      var i = 1;
      while (pool.length < 4) {
        var f = correct * (1 + 0.17 * i) + 0.011 * i;
        if (seen.indexOf(key(f)) === -1) { pool.push(f); seen.push(key(f)); }
        i++;
        if (i > 50) break;
      }
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var letters = ['A', 'B', 'C', 'D'];
      var idx = s.findIndex(function(v) { return key(v) === cK; });
      return { choices: s.map(function(v, i) { return letters[i] + '. ' + fmtP(v); }), correct: idx };
    }

    // Dedicated turnover formatter: displays as "X.XXx" (ratio, not percentage)
    var fmtTurnover = function(v) { return (Math.round(v * 100) / 100).toFixed(2) + 'x'; };

    // Precompute all mc() results to avoid double-call shuffle bug
    var q1mc = mcPct(margin, [margin * 1.2, roi, margin * 0.8]);

    // Q2: Asset Turnover — use fmtTurnover (not fmtP) to show ratio correctly
    var q2 = (function() {
      // Compare values on the precision used for display (2 decimals)
      var key = function(v) { return Math.round(v * 100); };
      var tK = key(turnover);
      var pool = [turnover];
      var seen = [tK];
      [turnover * 1.2, turnover * 0.8, roi].forEach(function(w) {
        var k = key(w);
        if (k !== tK && seen.indexOf(k) === -1) { pool.push(w); seen.push(k); }
      });
      var i = 1;
      while (pool.length < 4) {
        var f = turnover * (1 + 0.17 * i) + 0.07 * i;
        if (seen.indexOf(key(f)) === -1) { pool.push(f); seen.push(key(f)); }
        i++;
        if (i > 50) break;
      }
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var letters = ['A', 'B', 'C', 'D'];
      var idx = s.findIndex(function(v) { return key(v) === tK; });
      return { choices: s.map(function(v, i) { return letters[i] + '. ' + fmtTurnover(v); }), correct: idx };
    })();

    var q3mc = mcPct(roi, [roi * 1.15, roi * 0.85, minReturn]);
    var q4s1mc = mcDollar(Math.round(minReturn * assets), [Math.round(noi), Math.round(assets * roi), Math.round(assets * 0.1)]);
    var q4s2mc = mcDollar(Math.round(ri), [Math.round(noi), Math.round(ri * 1.2), Math.round(ri * 0.8)]);
    var q8 = (function() {
      // Match fmtP precision (1 decimal place after Math.round(n*1000)/10)
      var key = function(v) { return Math.round(v * 1000); };
      var na = Math.round(assets*0.80); var nr = noi/na;
      var nrK = key(nr);
      var pool = [nr];
      var seen = [nrK];
      [roi, nr*0.8, roi*1.3].forEach(function(w) {
        var k = key(w);
        if (k !== nrK && seen.indexOf(k) === -1 && w > 0) { pool.push(w); seen.push(k); }
      });
      var i=1;
      while(pool.length<4){
        var f = nr*(1 + 0.17*i) + 0.013*i;
        if (seen.indexOf(key(f)) === -1) { pool.push(f); seen.push(key(f)); }
        i++;
        if (i > 50) break;
      }
      var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return {choices:s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmtP(v);}),correct:s.findIndex(function(v){return key(v)===nrK;})};
    })();
    var q10 = (function() {
      var pa=Math.round(assets*0.15); var pn=Math.round(pa*roi*0.85); var pr=pn-Math.round(minReturn*pa);
      var pool = [pr];
      [Math.round(pn), Math.round(minReturn*pa), pr-2000].forEach(function(w){
        if (w !== pr && pool.indexOf(w) === -1) pool.push(w);
      });
      var k=1; while(pool.length<4){var f=pr+k*1031; if(pool.indexOf(f)===-1) pool.push(f); k++;}
      var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return {choices:s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}),correct:s.indexOf(pr)};
    })();
    var q12mc = mcDollar(noi, [Math.round(noi*1.2), Math.round(noi*0.8), Math.round(assets*minReturn)]);
    var q13mc = mcDollar(assets, [Math.round(assets*1.25), Math.round(assets*0.75), Math.round(sales*turnover)]);
    var q14mc = mcDollar(sales, [Math.round(sales*1.2), Math.round(sales*0.8), Math.round(noi/roi)]);

    return {
      data: { sales: sales, noi: noi, assets: assets, margin: margin, turnover: turnover, roi: roi, ri: ri, minReturn: minReturn },
      dataTable: [
        ["Sales", fmt(sales)],
        ["Net operating income", fmt(noi)],
        ["Average operating assets", fmt(assets)],
        ["Minimum required return", fmtP(minReturn)]
      ],
      questions: [
        {
          title: "Q1 — Profit Margin",
          steps: [{
            inst: "What is the profit margin for this division?",
            choices: q1mc.choices,
            correct: q1mc.correct,
            exp: fmt(noi) + " ÷ " + fmt(sales) + " = " + fmtP(margin),
            result: "Margin = " + fmtP(margin),
            formula: "Margin = Net Operating Income ÷ Sales",
            numbers: "NOI = " + fmt(noi) + ", Sales = " + fmt(sales)
          }]
        },
        {
          title: "Q2 — Asset Turnover",
          steps: [{
            inst: "What is the asset turnover for this division?",
            choices: q2.choices,
            correct: q2.correct,
            exp: fmt(sales) + " ÷ " + fmt(assets) + " = " + fmtTurnover(turnover),
            result: "Turnover = " + fmtTurnover(turnover),
            formula: "Turnover = Sales ÷ Average Operating Assets",
            numbers: "Sales = " + fmt(sales) + ", Assets = " + fmt(assets)
          }]
        },
        {
          title: "Q3 — Return on Investment (ROI)",
          steps: [{
            inst: "What is the return on investment for this division?",
            choices: q3mc.choices,
            correct: q3mc.correct,
            exp: fmtP(margin) + " × " + fmtTurnover(turnover) + " = " + fmtP(roi) + " (or " + fmt(noi) + " ÷ " + fmt(assets) + ")",
            result: "ROI = " + fmtP(roi),
            formula: "ROI = Margin × Turnover (or NOI ÷ Assets)",
            numbers: "Margin = " + fmtP(margin) + ", Turnover = " + fmtTurnover(turnover)
          }]
        },
        {
          title: "Q4 — Residual Income",
          steps: [
            {
              inst: "What is the minimum required return in dollars?",
              choices: q4s1mc.choices,
              correct: q4s1mc.correct,
              exp: fmtP(minReturn) + " × " + fmt(assets) + " = " + fmt(minReturn * assets),
              result: "Min required = " + fmt(minReturn * assets),
              formula: "Min Required Return $ = Min Rate × Operating Assets",
              numbers: "Min rate = " + fmtP(minReturn) + ", Assets = " + fmt(assets)
            },
            {
              inst: "What is the residual income?",
              choices: q4s2mc.choices,
              correct: q4s2mc.correct,
              exp: fmt(noi) + " − " + fmt(minReturn * assets) + " = " + fmt(ri),
              result: "Residual income = " + fmt(ri),
              formula: "RI = NOI − (Min Rate × Assets)",
              numbers: "NOI = " + fmt(noi) + ", Min required = " + fmt(minReturn * assets)
            }
          ]
        },
        {
          title: "Q5 — Is RI Positive or Negative?",
          steps: [{
            inst: "Residual income is " + fmt(Math.round(ri)) + ". What does this tell us about the division's performance?",
            choices: ri >= 0
              ? ["A. The division is destroying value", "B. The division earns exactly the minimum required", "C. The division earns more than the minimum required return — creating value", "D. ROI equals the minimum required rate"]
              : ["A. The division earns more than the minimum required return", "B. The division is breaking even", "C. The division earns less than the minimum required return — destroying value", "D. ROI is zero"],
            correct: 2,
            exp: ri >= 0 ? "Positive RI (" + fmt(Math.round(ri)) + ") means the division earns MORE than the " + fmtP(minReturn) + " minimum required — creating value." : "Negative RI (" + fmt(Math.round(ri)) + ") means the division earns LESS than the " + fmtP(minReturn) + " minimum — destroying value.",
            result: ri >= 0 ? "Positive RI — creating value" : "Negative RI — destroying value",
            formula: "RI > 0 → creating value | RI < 0 → destroying value",
            numbers: "RI = " + fmt(Math.round(ri)) + ", Min rate = " + fmtP(minReturn)
          }]
        },
        {
          title: "Q6 — ROI vs Minimum Return",
          steps: [{
            inst: "ROI is " + fmtP(roi) + " and the minimum required return is " + fmtP(minReturn) + ". What is true?",
            choices: roi >= minReturn
              ? ["A. The division should be shut down", "B. Residual income is negative", "C. ROI exceeds the minimum — residual income is positive", "D. The division is breaking even"]
              : ["A. ROI exceeds the hurdle rate — RI is positive", "B. Residual income is positive", "C. The division is earning exactly the minimum", "D. ROI is below the minimum — residual income is negative"],
            correct: roi >= minReturn ? 2 : 3,
            exp: "ROI (" + fmtP(roi) + ") " + (roi >= minReturn ? "exceeds" : "is below") + " the minimum required return (" + fmtP(minReturn) + "), so RI is " + (roi >= minReturn ? "positive." : "negative."),
            result: roi >= minReturn ? "ROI > hurdle rate → RI positive" : "ROI < hurdle rate → RI negative",
            formula: "If ROI > Min Rate → RI > 0 | If ROI < Min Rate → RI < 0",
            numbers: "ROI = " + fmtP(roi) + ", Min rate = " + fmtP(minReturn)
          }]
        },
        {
          title: "Q7 — Effect of Increasing NOI on ROI",
          steps: [{
            inst: "If NOI increases by " + fmt(Math.round(noi*0.20)) + " while assets stay constant, what happens to ROI?",
            choices: ["A. ROI decreases", "B. ROI stays the same", "C. ROI increases", "D. Turnover decreases"],
            correct: 2,
            exp: "New ROI = " + fmt(noi + Math.round(noi*0.20)) + " ÷ " + fmt(assets) + " = " + fmtP((noi + Math.round(noi*0.20))/assets) + " vs. old " + fmtP(roi) + ". Higher NOI → higher ROI.",
            result: "C. ROI increases",
            formula: "ROI = NOI ÷ Assets. Higher NOI with same assets → higher ROI",
            numbers: "New NOI = " + fmt(noi+Math.round(noi*0.20)) + ", Assets = " + fmt(assets)
          }]
        },
        {
          title: "Q8 — Effect of Reducing Assets on ROI",
          steps: [{
            inst: "If operating assets decrease by 20% while NOI stays at " + fmt(noi) + ", what is the new ROI?",
            choices: q8.choices,
            correct: q8.correct,
            exp: fmt(noi) + " ÷ " + fmt(Math.round(assets*0.80)) + " = " + fmtP(noi/Math.round(assets*0.80)) + ". Smaller asset base → higher ROI.",
            result: "New ROI = " + fmtP(noi/Math.round(assets*0.80)),
            formula: "ROI = NOI ÷ Assets. Reducing assets increases ROI.",
            numbers: "NOI = " + fmt(noi) + ", New assets = " + fmt(Math.round(assets*0.80))
          }]
        },
        {
          title: "Q9 — New Investment: ROI Method Decision",
          steps: [{
            inst: "Division ROI is " + fmtP(roi) + ". A new project offers " + fmtP(roi*0.85) + " ROI on " + fmt(Math.round(assets*0.15)) + " of new assets. Under ROI-based evaluation, will the manager accept?",
            choices: [
              "A. Yes — any ROI above zero is acceptable",
              "B. No — the project ROI (" + fmtP(roi*0.85) + ") is below the division's current ROI (" + fmtP(roi) + "), dragging down the average",
              "C. Yes — the project ROI exceeds the minimum required return",
              "D. Only if it increases residual income"
            ],
            correct: 1,
            exp: "ROI-method managers reject projects below their current average ROI because it lowers their reported ROI — even if the project exceeds the hurdle rate. This is called goal incongruence.",
            result: "B. No — lowers division average ROI",
            formula: "ROI incentive: reject if project ROI < current division ROI",
            numbers: "Division ROI = " + fmtP(roi) + ", Project ROI = " + fmtP(roi*0.85)
          }]
        },
        {
          title: "Q10 — New Investment: RI Method Decision",
          steps: [{
            inst: "The same project earns " + fmtP(roi*0.85) + " ROI on " + fmt(Math.round(assets*0.15)) + " assets. Minimum required return is " + fmtP(minReturn) + ". What is the project's residual income?",
            choices: q10.choices,
            correct: q10.correct,
            exp: (function(){var pa=Math.round(assets*0.15);var pn=Math.round(pa*roi*0.85);var pr=pn-Math.round(minReturn*pa);return fmt(pn)+" − "+fmt(Math.round(minReturn*pa))+" = "+fmt(pr)+". "+(pr>0?"Positive → accept under RI method.":"Negative → reject.");})(),
            result: (function(){var pa=Math.round(assets*0.15);var pn=Math.round(pa*roi*0.85);return "Project RI = "+fmt(pn-Math.round(minReturn*pa));})(),
            formula: "Project RI = Project NOI − (Min Rate × Project Assets)",
            numbers: "Project assets = " + fmt(Math.round(assets*0.15)) + ", Min rate = " + fmtP(minReturn)
          }]
        },
        {
          title: "Q11 — Goal Congruence",
          steps: [{
            inst: "A project earns ROI above the minimum required return but below the division's current ROI. Under which evaluation method will a manager ACCEPT the project?",
            choices: [
              "A. ROI method only",
              "B. Residual income method only",
              "C. Both methods",
              "D. Neither method"
            ],
            correct: 1,
            exp: "RI method encourages accepting projects exceeding the minimum required return regardless of division average ROI. ROI-based evaluation creates incentive to REJECT valuable projects that lower the division's average — a goal incongruence problem.",
            result: "B. Residual income method only",
            formula: "RI: accept if project ROI > min rate | ROI: reject if project ROI < division ROI",
            numbers: "N/A — conceptual"
          }]
        },
        {
          title: "Q12 — Compute Missing: NOI from ROI",
          steps: [{
            inst: "A division has ROI of " + fmtP(roi) + " and average operating assets of " + fmt(assets) + ". What is net operating income?",
            choices: q12mc.choices,
            correct: q12mc.correct,
            exp: fmtP(roi) + " × " + fmt(assets) + " = " + fmt(noi),
            result: "NOI = " + fmt(noi),
            formula: "NOI = ROI × Average Operating Assets",
            numbers: "ROI = " + fmtP(roi) + ", Assets = " + fmt(assets)
          }]
        },
        {
          title: "Q13 — Compute Missing: Assets from Turnover",
          steps: [{
            inst: "A division has sales of " + fmt(sales) + " and asset turnover of " + fmtTurnover(turnover) + ". What are average operating assets?",
            choices: q13mc.choices,
            correct: q13mc.correct,
            exp: fmt(sales) + " ÷ " + fmtTurnover(turnover) + " = " + fmt(assets),
            result: "Assets = " + fmt(assets),
            formula: "Assets = Sales ÷ Turnover",
            numbers: "Sales = " + fmt(sales) + ", Turnover = " + fmtTurnover(turnover)
          }]
        },
        {
          title: "Q14 — Compute Missing: Sales from Margin and NOI",
          steps: [{
            inst: "A division has NOI of " + fmt(noi) + " and profit margin of " + fmtP(margin) + ". What are total sales?",
            choices: q14mc.choices,
            correct: q14mc.correct,
            exp: fmt(noi) + " ÷ " + fmtP(margin) + " = " + fmt(sales),
            result: "Sales = " + fmt(sales),
            formula: "Sales = NOI ÷ Margin",
            numbers: "NOI = " + fmt(noi) + ", Margin = " + fmtP(margin)
          }]
        },
        {
          title: "Q15 — Full ROI Analysis",
          steps: [{
            inst: "Division A: Sales " + fmt(sales) + ", NOI " + fmt(noi) + ", Assets " + fmt(assets) + ". Division B: same assets but sales of " + fmt(Math.round(sales*1.3)) + " and NOI of " + fmt(Math.round(noi*0.9)) + ". Which division has higher ROI?",
            choices: (function() {
              var roiA = noi/assets;
              var roiB = Math.round(noi*0.9)/assets;
              return {
                choices: [
                  "A. Division A — ROI = " + fmtP(roiA),
                  "B. Division B — ROI = " + fmtP(roiB),
                  "C. They are equal",
                  "D. Cannot be determined without more information"
                ],
                correct: roiA >= roiB ? 0 : 1
              };
            })().choices,
            correct: (function() {
              var roiA = noi/assets;
              var roiB = Math.round(noi*0.9)/assets;
              return roiA >= roiB ? 0 : 1;
            })(),
            exp: "Division A ROI = " + fmt(noi) + " ÷ " + fmt(assets) + " = " + fmtP(noi/assets) + ". Division B ROI = " + fmt(Math.round(noi*0.9)) + " ÷ " + fmt(assets) + " = " + fmtP(Math.round(noi*0.9)/assets) + ".",
            result: noi/assets >= Math.round(noi*0.9)/assets ? "Division A has higher ROI" : "Division B has higher ROI",
            formula: "ROI = NOI ÷ Average Operating Assets",
            numbers: "A: NOI=" + fmt(noi) + ", B: NOI=" + fmt(Math.round(noi*0.9)) + ", Both assets=" + fmt(assets)
          }]
        }
      ]
    };
  }
};
