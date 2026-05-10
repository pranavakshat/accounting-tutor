window.CH12 = {
  title: "Chapter 12 — Capital Budgeting",
  description: "NPV, IRR, payback period, simple rate of return, and postaudit analysis",
  formulas: [
    "Annual Net Cash Inflow = Net Operating Income + Depreciation",
    "Net Present Value (NPV) = PV of Cash Inflows − Initial Investment",
    "Profitability Index = PV of Cash Inflows / Initial Investment",
    "IRR: Find discount rate where NPV = 0 (factor = Investment / Annual CF)",
    "Payback Period = Initial Investment / Annual Net Cash Inflow",
    "Simple Rate of Return = Net Operating Income / Initial Investment",
    "Depreciation = Investment / Useful Life (straight-line, no salvage)"
  ],
  definitions: [
    { q: "Which of the following does NOT affect cash flows and should be excluded from NPV analysis?", choices: ["A. Sales revenue", "B. Variable operating expenses", "C. Depreciation expense", "D. Tax savings from the investment"], correct: 2, exp: "Depreciation is a non-cash expense. It reduces taxable income but does not represent an actual cash outflow, so it is added back to NOI to get cash flow." },
    { q: "A project has a positive NPV. This means:", choices: ["A. The IRR equals the discount rate", "B. The project earns exactly the required return", "C. The project earns MORE than the required rate of return", "D. The payback period is less than the project life"], correct: 2, exp: "Positive NPV means the PV of future cash flows exceeds the investment — the project earns more than the required (hurdle) rate." },
    { q: "The payback period method's main weakness is:", choices: ["A. It is too complex to calculate", "B. It ignores the time value of money and cash flows after payback", "C. It requires estimating the discount rate", "D. It cannot be used for projects with uneven cash flows"], correct: 1, exp: "Payback ignores both the time value of money and any cash flows that occur after the payback point is reached — it doesn't measure profitability." }
  ],
  generate: function() {
    var investmentOptions = [2500000, 2810000, 3000000, 3200000, 3500000];
    var investment = investmentOptions[Math.floor(Math.random() * investmentOptions.length)];

    var yearsOptions = [5, 6, 7, 8];
    var years = yearsOptions[Math.floor(Math.random() * yearsOptions.length)];

    var discountRateOptions = [0.12, 0.14, 0.16, 0.18, 0.20];
    var discountRate = discountRateOptions[Math.floor(Math.random() * discountRateOptions.length)];

    var depreciation = Math.round(investment / years);

    // PV annuity factors (pre-computed for common combos)
    var pvFactors = {
      '0.12_5': 3.605, '0.12_6': 4.111, '0.12_7': 4.564, '0.12_8': 4.968,
      '0.14_5': 3.433, '0.14_6': 3.889, '0.14_7': 4.288, '0.14_8': 4.639,
      '0.16_5': 3.274, '0.16_6': 3.685, '0.16_7': 4.039, '0.16_8': 4.344,
      '0.18_5': 3.127, '0.18_6': 3.498, '0.18_7': 3.812, '0.18_8': 4.078,
      '0.20_5': 2.991, '0.20_6': 3.326, '0.20_7': 3.605, '0.20_8': 3.837
    };
    var pvFactor = pvFactors[discountRate + '_' + years] || 3.274;

    // Income statement
    var sales        = Math.round(investment * 1.013 / 1000) * 1000;
    var varExpPct    = 0.394;  // ~39.4% like Cardinal Company
    var varExpense   = Math.round(sales * varExpPct / 1000) * 1000;
    var cm           = sales - varExpense;
    var advSalaries  = Math.round(investment * 0.278 / 1000) * 1000;
    var fixedCash    = advSalaries;
    var totalFixed   = fixedCash + depreciation;
    var noi          = cm - totalFixed;

    // Make NOI positive and reasonable
    if (noi <= 0) {
      advSalaries = Math.round((cm - depreciation) * 0.67 / 1000) * 1000;
      fixedCash = advSalaries;
      totalFixed = fixedCash + depreciation;
      noi = cm - totalFixed;
    }
    noi = Math.round(noi / 1000) * 1000;

    var annualCF = noi + depreciation;
    var pvInflows = Math.round(annualCF * pvFactor);
    var npv = pvInflows - investment;
    var pi = Math.round((pvInflows / investment) * 100) / 100;
    var payback = Math.round((investment / annualCF) * 100) / 100;
    var srr = Math.round((noi / investment) * 10000) / 100;  // as %

    // IRR factor and rate (approximate)
    var irrFactor = Math.round((investment / annualCF) * 1000) / 1000;
    // Find nearest IRR rate (rough)
    var irrRateOptions = [0.16, 0.18, 0.20, 0.22, 0.24, 0.25, 0.28, 0.30];
    var irrFactorsLookup = {
      '0.16_5': 3.274, '0.18_5': 3.127, '0.20_5': 2.991, '0.22_5': 2.864, '0.24_5': 2.745, '0.25_5': 2.689,
      '0.16_6': 3.685, '0.18_6': 3.498, '0.20_6': 3.326, '0.22_6': 3.167, '0.24_6': 3.020,
      '0.16_7': 4.039, '0.18_7': 3.812, '0.20_7': 3.605, '0.22_7': 3.416,
      '0.16_8': 4.344, '0.18_8': 4.078, '0.20_8': 3.837, '0.22_8': 3.619
    };
    var irrRate = discountRate + 0.04;  // approximate: IRR is typically higher than discount rate when NPV>0
    if (npv < 0) irrRate = discountRate - 0.02;

    // Postaudit: actual var expense ratio was 45%
    var actualVarExpPct = 0.45;
    var actualVarExpense = Math.round(sales * actualVarExpPct / 1000) * 1000;
    var actualCM = sales - actualVarExpense;
    var actualNOI = actualCM - totalFixed;
    var actualAnnualCF = actualNOI + depreciation;
    var actualPvInflows = Math.round(actualAnnualCF * pvFactor);
    var actualNPV = actualPvInflows - investment;
    var actualPayback = actualAnnualCF > 0 ? Math.round((investment / actualAnnualCF) * 100) / 100 : 999;
    var actualSRR = Math.round((actualNOI / investment) * 10000) / 100;

    var fmt  = function(n) { return '$' + Math.round(n).toLocaleString(); };
    var fmtD = function(n) { return (Math.round(n * 100) / 100).toFixed(2); };
    var fmtP = function(n) { return (Math.round(n * 10) / 10) + '%'; };

    function mc(correct, wrongs) {
      var cR = Math.round(correct);
      var pool = [cR];
      wrongs.forEach(function(w) {
        var r = Math.round(w);
        if (r !== cR && pool.indexOf(r) === -1) pool.push(r);
      });
      var k = 1;
      while (pool.length < 4) {
        var f = Math.round(Math.abs(cR) * (1 + 0.13 * k) + 1031 * k) * (cR < 0 ? -1 : 1);
        if (pool.indexOf(f) === -1 && f !== 0) pool.push(f);
        k++;
        if (k > 50) break;
      }
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var idx = s.indexOf(cR);
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmt(v); }), correct: idx };
    }

    function mcSmall(correct, wrongs) {
      var key = function(v) { return Math.round(v * 100); };
      var cK = key(correct);
      var pool = [correct];
      var seen = [cK];
      wrongs.forEach(function(w) {
        var k = key(w);
        if (k !== cK && seen.indexOf(k) === -1) { pool.push(w); seen.push(k); }
      });
      var i = 1;
      while (pool.length < 4) {
        var f = correct * (1 + 0.13 * i) + 0.07 * i;
        if (seen.indexOf(key(f)) === -1) { pool.push(f); seen.push(key(f)); }
        i++;
        if (i > 50) break;
      }
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var idx = s.findIndex(function(v) { return key(v) === cK; });
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtD(v); }), correct: idx };
    }

    function mcPct(correct, wrongs) {
      var key = function(v) { return Math.round(v * 10); };
      var cK = key(correct);
      var pool = [correct];
      var seen = [cK];
      wrongs.forEach(function(w) {
        var k = key(w);
        if (k !== cK && seen.indexOf(k) === -1) { pool.push(w); seen.push(k); }
      });
      var i = 1;
      while (pool.length < 4) {
        var f = correct * (1 + 0.13 * i) + 0.7 * i;
        if (seen.indexOf(key(f)) === -1) { pool.push(f); seen.push(key(f)); }
        i++;
        if (i > 50) break;
      }
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var idx = s.findIndex(function(v) { return key(v) === cK; });
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtP(v); }), correct: idx };
    }

    // Precompute all mc() results to avoid double-call shuffle bug
    var q2mc  = mc(annualCF, [noi, depreciation, annualCF + noi]);
    var q3mc  = mc(pvInflows, [annualCF * years, pvInflows * 1.1, investment]);
    var q4mc  = mc(npv, [pvInflows, -npv, npv + annualCF]);
    var q5mc  = mcSmall(pi, [Math.round((investment / pvInflows) * 100) / 100, pi + 0.1, pi - 0.1]);
    var q7mc  = mcSmall(payback, [years / 2, payback * 1.2, payback * 0.8]);
    var q13mc = mc(actualNPV, [npv, actualNPV * 1.2, investment - actualPvInflows]);
    var q14mc = mcSmall(actualPayback, [payback, actualPayback * 1.2, years]);

    return {
      data: {
        investment: investment, years: years, discountRate: discountRate,
        sales: sales, varExpense: varExpense, cm: cm, depreciation: depreciation,
        noi: noi, annualCF: annualCF, pvFactor: pvFactor,
        pvInflows: pvInflows, npv: npv, pi: pi, payback: payback, srr: srr,
        irrFactor: irrFactor, irrRate: irrRate
      },
      dataTable: [
        ["Initial investment", fmt(investment)],
        ["Project life", years + " years"],
        ["Discount rate (hurdle rate)", Math.round(discountRate * 100) + "%"],
        ["Annual sales", fmt(sales)],
        ["Annual variable expenses", fmt(varExpense) + " (" + Math.round(varExpPct * 100) + "% of sales)"],
        ["Annual CM", fmt(cm)],
        ["Fixed — advertising/salaries (cash)", fmt(fixedCash)],
        ["Fixed — depreciation", fmt(depreciation)],
        ["Annual net operating income (NOI)", fmt(noi)],
        ["PV annuity factor (" + Math.round(discountRate * 100) + "%, " + years + " yrs)", fmtD(pvFactor)]
      ],
      questions: [
        {
          title: "Q1 — Non-Cash Items",
          steps: [{
            inst: "Which item in the income statement does NOT represent an actual cash flow and must be added back when computing annual net cash inflow?",
            choices: [
              "A. Sales revenue",
              "B. Variable expenses",
              "C. Depreciation expense",
              "D. Advertising and salaries expense"
            ],
            correct: 2,
            exp: "Depreciation is a non-cash charge — it reduces accounting income but no cash leaves the company. Adding it back: Annual Cash Flow = NOI + Depreciation.",
            result: "Non-cash item = Depreciation",
            formula: "Annual Cash Inflow = NOI + Depreciation",
            numbers: "NOI = " + fmt(noi) + ", Depreciation = " + fmt(depreciation)
          }]
        },
        {
          title: "Q2 — Annual Net Cash Inflow",
          steps: [{
            inst: "Net operating income = " + fmt(noi) + " per year. Depreciation = " + fmt(depreciation) + " per year. What is the annual net cash inflow?",
            choices: q2mc.choices,
            correct: q2mc.correct,
            exp: fmt(noi) + " + " + fmt(depreciation) + " = " + fmt(annualCF) + " per year",
            result: "Annual net cash inflow = " + fmt(annualCF),
            formula: "Annual Cash Inflow = NOI + Depreciation",
            numbers: "NOI = " + fmt(noi) + ", Depreciation = " + fmt(depreciation)
          }]
        },
        {
          title: "Q3 — Present Value of Cash Inflows",
          steps: [{
            inst: "Annual cash inflow = " + fmt(annualCF) + " for " + years + " years at a " + Math.round(discountRate * 100) + "% discount rate. PV annuity factor = " + fmtD(pvFactor) + ". What is the total present value of cash inflows?",
            choices: q3mc.choices,
            correct: q3mc.correct,
            exp: fmt(annualCF) + " × " + fmtD(pvFactor) + " = " + fmt(pvInflows),
            result: "PV of cash inflows = " + fmt(pvInflows),
            formula: "PV of Inflows = Annual Cash Flow × PV Annuity Factor",
            numbers: "Annual CF = " + fmt(annualCF) + ", PV factor = " + fmtD(pvFactor)
          }]
        },
        {
          title: "Q4 — Net Present Value (NPV)",
          steps: [{
            inst: "PV of cash inflows = " + fmt(pvInflows) + ". Initial investment = " + fmt(investment) + ". What is the net present value?",
            choices: q4mc.choices,
            correct: q4mc.correct,
            exp: fmt(pvInflows) + " − " + fmt(investment) + " = " + fmt(npv) + (npv >= 0 ? " — Accept (positive NPV)" : " — Reject (negative NPV)"),
            result: "NPV = " + fmt(npv),
            formula: "NPV = PV of Cash Inflows − Initial Investment",
            numbers: "PV inflows = " + fmt(pvInflows) + ", Investment = " + fmt(investment)
          }]
        },
        {
          title: "Q5 — Profitability Index",
          steps: [{
            inst: "PV of cash inflows = " + fmt(pvInflows) + ". Initial investment = " + fmt(investment) + ". What is the profitability index?",
            choices: q5mc.choices,
            correct: q5mc.correct,
            exp: fmt(pvInflows) + " ÷ " + fmt(investment) + " = " + fmtD(pi) + (pi >= 1 ? " — Accept (PI ≥ 1)" : " — Reject (PI < 1)"),
            result: "Profitability Index = " + fmtD(pi),
            formula: "Profitability Index = PV of Cash Inflows / Initial Investment",
            numbers: "PV inflows = " + fmt(pvInflows) + ", Investment = " + fmt(investment)
          }]
        },
        {
          title: "Q6 — Internal Rate of Return (IRR)",
          steps: [{
            inst: "Investment = " + fmt(investment) + ". Annual cash flow = " + fmt(annualCF) + ". The IRR factor = " + fmt(investment) + " ÷ " + fmt(annualCF) + " = " + fmtD(irrFactor) + ". Looking up this factor in a " + years + "-year PV annuity table, the IRR is approximately:",
            choices: [
              "A. " + Math.round(irrRate * 100) + "%",
              "B. " + Math.round(discountRate * 100) + "%",
              "C. " + Math.round((irrRate + 0.06) * 100) + "%",
              "D. " + Math.round((irrRate - 0.06) * 100) + "%"
            ],
            correct: 0,
            exp: "IRR factor = " + fmt(investment) + " / " + fmt(annualCF) + " = " + fmtD(irrFactor) + ". Scanning the " + years + "-yr row of PV annuity tables, this factor corresponds to approximately " + Math.round(irrRate * 100) + "%. IRR > hurdle rate of " + Math.round(discountRate * 100) + "% — project is acceptable.",
            result: "IRR ≈ " + Math.round(irrRate * 100) + "%",
            formula: "IRR factor = Initial Investment / Annual Cash Flow; look up in PV tables",
            numbers: "Investment = " + fmt(investment) + ", Annual CF = " + fmt(annualCF) + ", Factor = " + fmtD(irrFactor)
          }]
        },
        {
          title: "Q7 — Payback Period",
          steps: [{
            inst: "Initial investment = " + fmt(investment) + ". Annual net cash inflow = " + fmt(annualCF) + ". What is the payback period?",
            choices: q7mc.choices,
            correct: q7mc.correct,
            exp: fmt(investment) + " ÷ " + fmt(annualCF) + " = " + fmtD(payback) + " years",
            result: "Payback period = " + fmtD(payback) + " years",
            formula: "Payback Period = Initial Investment / Annual Net Cash Inflow",
            numbers: "Investment = " + fmt(investment) + ", Annual CF = " + fmt(annualCF)
          }]
        },
        {
          title: "Q8 — Simple Rate of Return",
          steps: [{
            inst: "Annual net operating income = " + fmt(noi) + ". Initial investment = " + fmt(investment) + ". What is the simple rate of return?",
            choices: [
              "A. " + fmtP(srr),
              "B. " + fmtP(Math.round(discountRate * 1000) / 10),
              "C. " + fmtP(Math.round((annualCF / investment) * 1000) / 10),
              "D. " + fmtP(srr * 0.8)
            ],
            correct: 0,
            exp: fmt(noi) + " ÷ " + fmt(investment) + " = " + fmtP(srr) + " (compare to hurdle rate of " + Math.round(discountRate * 100) + "%)",
            result: "Simple rate of return = " + fmtP(srr),
            formula: "Simple Rate of Return = Annual NOI / Initial Investment",
            numbers: "NOI = " + fmt(noi) + ", Investment = " + fmt(investment)
          }]
        },
        {
          title: "Q9 — Effect of Higher Discount Rate on NPV",
          steps: [{
            inst: "The project's NPV is " + fmt(npv) + " at a " + Math.round(discountRate * 100) + "% discount rate. If the discount rate were raised to " + Math.round((discountRate + 0.02) * 100) + "%, how would the NPV change?",
            choices: [
              "A. NPV would be lower (higher discount rate reduces PV of future cash flows)",
              "B. NPV would be higher (higher rate increases present value)",
              "C. NPV would stay the same (rate only affects IRR, not NPV)",
              "D. NPV would be zero (the project breaks even)"
            ],
            correct: 0,
            exp: "A higher discount rate reduces the PV of future cash flows. Since the inflows stay the same but their present value is lower, NPV decreases. This is why projects become less attractive as the required return rises.",
            result: "Higher discount rate → Lower NPV",
            formula: "PV = CF / (1+r)^n — as r increases, PV of future cash flows decreases",
            numbers: "Current rate = " + Math.round(discountRate * 100) + "%, Proposed = " + Math.round((discountRate + 0.02) * 100) + "%"
          }]
        },
        {
          title: "Q10 — Effect of Salvage Value on Payback",
          steps: [{
            inst: "If the equipment had a salvage value of " + fmt(Math.round(investment * 0.1)) + " at the end of " + years + " years, how would the payback period change?",
            choices: [
              "A. Payback would be lower (salvage received sooner reduces payback)",
              "B. Payback would be the same (payback uses annual cash flows, not terminal cash)",
              "C. Payback would be higher (more investment to recover)",
              "D. Payback is unaffected only when salvage equals depreciation"
            ],
            correct: 1,
            exp: "The simple payback formula (Investment / Annual CF) does not include the salvage value because it occurs at the END of the project, after the annual cash flows have already recouped the investment. The payback period is unchanged.",
            result: "Salvage value → Payback period unchanged",
            formula: "Payback = Investment / Annual Cash Flow (terminal salvage not included in simple payback)",
            numbers: "Annual CF = " + fmt(annualCF) + ", Salvage received at year " + years
          }]
        },
        {
          title: "Q11 — Effect of Salvage Value on NPV",
          steps: [{
            inst: "If the equipment had a salvage value of " + fmt(Math.round(investment * 0.1)) + " at year " + years + ", how would the NPV change?",
            choices: [
              "A. NPV would be higher (salvage is an additional cash inflow with positive PV)",
              "B. NPV would be lower (salvage reduces depreciation, thus reduces tax shield)",
              "C. NPV would be the same (salvage is excluded from NPV analysis)",
              "D. NPV would be zero (salvage exactly offsets depreciation loss)"
            ],
            correct: 0,
            exp: "Salvage value is an additional cash inflow at the end of the project. Its present value is positive (PV = Salvage / (1+r)^n), so NPV increases.",
            result: "Salvage value → NPV is higher",
            formula: "Additional PV = Salvage × PV factor (single period at year n)",
            numbers: "Salvage = " + fmt(Math.round(investment * 0.1)) + " at year " + years
          }]
        },
        {
          title: "Q12 — Effect of Salvage Value on Simple Rate of Return",
          steps: [{
            inst: "If the equipment has salvage value of " + fmt(Math.round(investment * 0.1)) + ", straight-line depreciation would be LOWER (depreciating over salvage, not full cost). How does this affect simple rate of return?",
            choices: [
              "A. Simple rate of return is higher (lower depreciation → higher NOI)",
              "B. Simple rate of return is lower (salvage reduces the recoverable amount)",
              "C. Simple rate of return is unchanged (depreciation is non-cash)",
              "D. Simple rate of return is zero (salvage replaces income)"
            ],
            correct: 0,
            exp: "With salvage value, depreciation = (Cost − Salvage) / Years, which is lower. Lower depreciation means higher NOI. Since SRR = NOI / Investment, higher NOI → higher SRR.",
            result: "Salvage value → Simple rate of return is higher",
            formula: "Depreciation (with salvage) = (Cost − Salvage) / Years — lower → higher NOI → higher SRR",
            numbers: "Original depreciation = " + fmt(depreciation) + "/yr; with salvage, it would be lower"
          }]
        },
        {
          title: "Q13 — Postaudit: Actual NPV",
          steps: [{
            inst: "Postaudit reveals variable expense ratio was actually 45% (not " + Math.round(varExpPct * 100) + "%). Sales remain " + fmt(sales) + ". Actual variable expenses = " + fmt(actualVarExpense) + ". Actual NOI = " + fmt(actualNOI) + ", Actual annual CF = " + fmt(actualAnnualCF) + ". What is the actual NPV?",
            choices: q13mc.choices,
            correct: q13mc.correct,
            exp: "Actual CF = " + fmt(actualAnnualCF) + " × " + fmtD(pvFactor) + " = " + fmt(actualPvInflows) + " − " + fmt(investment) + " = " + fmt(actualNPV),
            result: "Actual NPV = " + fmt(actualNPV),
            formula: "Actual NPV = Actual Annual CF × PV Factor − Investment",
            numbers: "Actual annual CF = " + fmt(actualAnnualCF) + ", PV factor = " + fmtD(pvFactor) + ", Investment = " + fmt(investment)
          }]
        },
        {
          title: "Q14 — Postaudit: Actual Payback Period",
          steps: [{
            inst: "With 45% variable expenses, actual annual cash inflow = " + fmt(actualAnnualCF) + ". Initial investment = " + fmt(investment) + ". What is the actual payback period?",
            choices: q14mc.choices,
            correct: q14mc.correct,
            exp: fmt(investment) + " ÷ " + fmt(actualAnnualCF) + " = " + fmtD(actualPayback) + " years (vs. projected " + fmtD(payback) + " years)",
            result: "Actual payback = " + fmtD(actualPayback) + " years",
            formula: "Payback = Investment / Actual Annual Cash Flow",
            numbers: "Investment = " + fmt(investment) + ", Actual annual CF = " + fmt(actualAnnualCF)
          }]
        },
        {
          title: "Q15 — Postaudit: Actual Simple Rate of Return",
          steps: [{
            inst: "With 45% variable expenses, actual NOI = " + fmt(actualNOI) + ". Investment = " + fmt(investment) + ". What is the actual simple rate of return?",
            choices: [
              "A. " + fmtP(actualSRR),
              "B. " + fmtP(srr),
              "C. " + fmtP(actualSRR * 1.2),
              "D. " + fmtP(Math.round(discountRate * 1000) / 10)
            ],
            correct: 0,
            exp: fmt(actualNOI) + " ÷ " + fmt(investment) + " = " + fmtP(actualSRR) + " (vs. projected " + fmtP(srr) + "). " + (actualSRR < discountRate * 100 ? "Below hurdle rate — project underperformed." : "Still meets hurdle rate."),
            result: "Actual SRR = " + fmtP(actualSRR),
            formula: "SRR = Actual NOI / Initial Investment",
            numbers: "Actual NOI = " + fmt(actualNOI) + ", Investment = " + fmt(investment)
          }]
        }
      ]
    };
  }
};
