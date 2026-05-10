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
      var pool = [correct].concat(wrongs.filter(function(w) { return w !== correct; })).slice(0, 4);
      while (pool.length < 4) pool.push(Math.round(correct * (1 + 0.1 * pool.length)));
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var letters = ['A', 'B', 'C', 'D'];
      return { choices: s.map(function(v, i) { return letters[i] + '. ' + fmt(v); }), correct: s.indexOf(correct) };
    }

    function mcPct(correct, wrongs) {
      var pool = [correct].concat(wrongs.filter(function(w) { return w !== correct; })).slice(0, 4);
      while (pool.length < 4) pool.push(correct * (1 + 0.15 * pool.length));
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var letters = ['A', 'B', 'C', 'D'];
      return { choices: s.map(function(v, i) { return letters[i] + '. ' + fmtP(v); }), correct: s.indexOf(correct) };
    }

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
            choices: mcPct(margin, [margin * 1.2, roi, margin * 0.8]).choices,
            correct: mcPct(margin, [margin * 1.2, roi, margin * 0.8]).correct,
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
            choices: mcPct(turnover, [turnover * 1.2, turnover * 0.8, roi]).choices,
            correct: mcPct(turnover, [turnover * 1.2, turnover * 0.8, roi]).correct,
            exp: fmt(sales) + " ÷ " + fmt(assets) + " = " + fmtP(turnover),
            result: "Turnover = " + fmtP(turnover),
            formula: "Turnover = Sales ÷ Average Operating Assets",
            numbers: "Sales = " + fmt(sales) + ", Assets = " + fmt(assets)
          }]
        },
        {
          title: "Q3 — Return on Investment (ROI)",
          steps: [{
            inst: "What is the return on investment for this division?",
            choices: mcPct(roi, [roi * 1.15, roi * 0.85, minReturn]).choices,
            correct: mcPct(roi, [roi * 1.15, roi * 0.85, minReturn]).correct,
            exp: fmtP(margin) + " × " + fmtP(turnover) + " = " + fmtP(roi) + " (or " + fmt(noi) + " ÷ " + fmt(assets) + ")",
            result: "ROI = " + fmtP(roi),
            formula: "ROI = Margin × Turnover (or NOI ÷ Assets)",
            numbers: "Margin = " + fmtP(margin) + ", Turnover = " + fmtP(turnover)
          }]
        },
        {
          title: "Q4 — Residual Income",
          steps: [
            {
              inst: "What is the minimum required return in dollars?",
              choices: mcDollar(Math.round(minReturn * assets), [Math.round(noi), Math.round(assets * roi), Math.round(assets * 0.1)]).choices,
              correct: mcDollar(Math.round(minReturn * assets), [Math.round(noi), Math.round(assets * roi), Math.round(assets * 0.1)]).correct,
              exp: fmtP(minReturn) + " × " + fmt(assets) + " = " + fmt(minReturn * assets),
              result: "Min required = " + fmt(minReturn * assets),
              formula: "Min Required Return $ = Min Rate × Operating Assets",
              numbers: "Min rate = " + fmtP(minReturn) + ", Assets = " + fmt(assets)
            },
            {
              inst: "What is the residual income?",
              choices: mcDollar(Math.round(ri), [Math.round(noi), Math.round(ri * 1.2), Math.round(ri * 0.8)]).choices,
              correct: mcDollar(Math.round(ri), [Math.round(noi), Math.round(ri * 1.2), Math.round(ri * 0.8)]).correct,
              exp: fmt(noi) + " − " + fmt(minReturn * assets) + " = " + fmt(ri),
              result: "Residual income = " + fmt(ri),
              formula: "RI = NOI − (Min Rate × Assets)",
              numbers: "NOI = " + fmt(noi) + ", Min required = " + fmt(minReturn * assets)
            }
          ]
        }
      ]
    };
  }
};
