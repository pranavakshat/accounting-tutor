window.CH11 = {
  title: "Chapter 11 — Relevant Costs & Product Mix",
  description: "Special orders, make-or-buy, product discontinuation, and constrained resource decisions",
  formulas: [
    "Relevant Cost = Costs that differ between alternatives (future, differential)",
    "CM per unit = Selling Price − Variable Costs per unit",
    "Special Order Impact = (Special Price − Variable Cost) × Special Units − Opportunity Cost",
    "Discontinue if: Traceable Fixed Costs > Contribution Margin Lost",
    "CM per constraint unit = CM per unit / Constraint units per product",
    "Optimal Mix: Rank products by CM per constraint unit, fill highest rank first"
  ],
  definitions: [
    { q: "A relevant cost is:", choices: ["A. Any cost that appears on the income statement", "B. A future cost that differs between decision alternatives", "C. A cost that has already been incurred", "D. Fixed costs only"], correct: 1, exp: "Relevant costs are future costs that differ between alternatives. Sunk costs (already incurred) and costs that don't change between options are irrelevant." },
    { q: "When deciding whether to drop a product line, which costs are relevant?", choices: ["A. All costs allocated to that product line", "B. Only variable costs of that product line", "C. Traceable fixed costs that would be eliminated, and lost contribution margin", "D. Common fixed costs allocated to the product"], correct: 2, exp: "Only traceable (avoidable) fixed costs are relevant — they disappear if the product is dropped. Common fixed costs continue regardless and are irrelevant." },
    { q: "When a company has a binding constraint (e.g., limited raw materials), the optimal product mix prioritizes:", choices: ["A. Products with the highest selling price", "B. Products with the highest CM per unit", "C. Products with the highest CM per unit of the constrained resource", "D. Products with the lowest variable costs"], correct: 2, exp: "With constraints, maximize CM per unit of the scarce resource (e.g., CM per pound of RM). Not CM per unit — that ignores how much of the constraint each unit consumes." }
  ],
  generate: function() {
    var multipliers = [0.85, 0.90, 1.0, 1.05, 1.10, 1.15, 1.20];
    var m = multipliers[Math.floor(Math.random() * multipliers.length)];

    // Cane Company scenario — parametric
    var priceA = 190, priceB = 155;

    // Variable costs per unit
    // dmA = 5 lbs × $8/lb = $40; dmB = 3 lbs × $8/lb = $24
    var dmA = 40, dlA = 34, vmohA = 21, vselA = 26;
    var dmB = 24, dlB = 28, vmohB = 16, vselB = 19;
    var varTotalA = dmA + dlA + vmohA + vselA;  // 121
    var varTotalB = dmB + dlB + vmohB + vselB;  // 87

    var cmA = priceA - varTotalA;  // 61
    var cmB = priceB - varTotalB;  // 54

    // Fixed costs (parametric)
    var normalUnitsA = Math.round(122000 * m / 1000) * 1000;
    var normalUnitsB = Math.round(122000 * m / 1000) * 1000;

    var traceFixedA_perUnit = 29;
    var traceFixedB_perUnit = 22;
    var traceFixedA = traceFixedA_perUnit * normalUnitsA;
    var traceFixedB = traceFixedB_perUnit * normalUnitsB;

    var commonFixed_perUnit = 29;
    var commonFixed = commonFixed_perUnit * (normalUnitsA + normalUnitsB);

    // Special order Q3: Alpha 24,000 units at $136
    var soUnitsA = Math.round(24000 * m / 1000) * 1000;
    var soPriceA = 136;
    var soVariableCostA = varTotalA;  // no extra traceable fixed for small order
    var soFinImpactA = (soPriceA - soVariableCostA) * soUnitsA;

    // Special order Q4: Beta 3,000 units at $62
    var soUnitsB = Math.round(3000 * m / 1000) * 1000;
    var soPriceB = 62;
    var soFinImpactB = (soPriceB - varTotalB) * soUnitsB;

    // Special order Q5: Alpha 109,000 units at $136, displaces 11,000 regular
    var soLargeUnitsA = Math.round(109000 * m / 1000) * 1000;
    var soDisplacedA   = Math.round(11000  * m / 1000) * 1000;
    var soLargeRevA    = soPriceA * soLargeUnitsA;
    var soLargeVarA    = varTotalA * soLargeUnitsA;
    var soLargeOppCost = cmA * soDisplacedA;  // lost CM from displaced sales
    var soLargeFinImpact = (soPriceA - varTotalA) * soLargeUnitsA - soLargeOppCost;

    // Q6: Discontinue Beta (all units) — impact
    var discBetaCM = cmB * normalUnitsB;
    var discBetaTraceFixed = traceFixedB;
    var discBetaFinImpact = discBetaTraceFixed - discBetaCM;  // negative = loss from discontinuing

    // Q7: Discontinue 54,000 units of Beta
    var discBetaUnits54 = Math.round(54000 * m / 1000) * 1000;
    var discBeta54FinImpact = traceFixedB_perUnit * discBetaUnits54 - cmB * discBetaUnits54;

    // Q8: Discontinue Beta + add 14,000 Alpha
    var addAlphaUnits = Math.round(14000 * m / 1000) * 1000;
    var disc_plus_add = discBetaFinImpact + cmA * addAlphaUnits;

    // Q9: Make vs Buy — buy 94,000 Alpha at $136
    var buyUnitsA_lose = Math.round(94000 * m / 1000) * 1000;
    var buyPriceA = 136;
    var savedVarCosts = varTotalA * buyUnitsA_lose;
    var savedTraceFixed = traceFixedA_perUnit * buyUnitsA_lose;
    var purchaseCost = buyPriceA * buyUnitsA_lose;
    var makeVsBuy94_impact = savedVarCosts + savedTraceFixed - purchaseCost;  // positive = buy is better? negative = make is better

    // Q10: Buy 69,000 Alpha at $136 (traceable fixed not avoidable at 69k level)
    var buyUnitsA_win = Math.round(69000 * m / 1000) * 1000;
    var savedVar69 = varTotalA * buyUnitsA_win;
    var purchaseCost69 = buyPriceA * buyUnitsA_win;
    var makeVsBuy69_impact = savedVar69 - purchaseCost69;  // negative = lose if buy (make is better at this level)

    // Q11-14: Constrained resource — RM
    var lbsPerA = 5, lbsPerB = 3;
    var rmCostPerLb = 8;
    var cmPerLbA = cmA / lbsPerA;  // 61/5 = 12.20
    var cmPerLbB = cmB / lbsPerB;  // 54/3 = 18.00
    // Beta has higher CM/lb, so produce Beta first
    var totalLbs = Math.round(228000 * m / 1000) * 1000;

    // Optimal: max Beta (normalUnitsB), then fill with Alpha
    var lbsForMaxB = normalUnitsB * lbsPerB;
    var lbsRemaining = totalLbs - lbsForMaxB;
    var optUnitsA, optUnitsB;
    if (lbsRemaining >= 0) {
      optUnitsB = normalUnitsB;
      optUnitsA = Math.min(normalUnitsA, Math.floor(lbsRemaining / lbsPerA));
    } else {
      optUnitsB = Math.floor(totalLbs / lbsPerB);
      optUnitsA = 0;
    }
    var optTotalCM = cmB * optUnitsB + cmA * optUnitsA;

    // Q15: Max price per additional lb
    // Next best use is Alpha (lower CM/lb), so max additional price = cmPerLbB OR cmPerLbA depending on which runs out
    var maxPricePerLb = cmPerLbB + rmCostPerLb;  // the contribution we'd get from the best remaining use + current cost = max we'd pay

    var fmt  = function(n) { return '$' + Math.round(n).toLocaleString(); };
    var fmtD = function(n) { return '$' + (Math.round(n * 100) / 100).toFixed(2); };
    var fmtN = function(n) { return Math.round(n).toLocaleString(); };

    function mc(correct, wrongs) {
      var cR = Math.round(correct);
      var pool = [cR].concat(wrongs.map(Math.round).filter(function(w) { return Math.abs(w - cR) > 100; })).slice(0, 4);
      while (pool.length < 4) pool.push(Math.round(Math.abs(cR) * (1 + 0.12 * pool.length) * (cR < 0 ? -1 : 1)));
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var idx = s.indexOf(cR);
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmt(v) + (v < 0 ? ' (loss/disadvantage)' : ' (advantage)'); }), correct: idx };
    }

    function mcDollar(correct, wrongs) {
      var cR = Math.round(correct);
      var pool = [cR].concat(wrongs.map(Math.round).filter(function(w) { return w !== cR && w > 0; })).slice(0, 4);
      while (pool.length < 4) pool.push(Math.round(cR * (1 + 0.12 * pool.length)));
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var idx = s.indexOf(cR);
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmt(v); }), correct: idx };
    }

    function mcRate(correct, wrongs) {
      var pool = [correct].concat(wrongs).slice(0, 4);
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var cR = Math.round(correct * 100);
      var idx = s.findIndex(function(v) { return Math.round(v * 100) === cR; });
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtD(v) + '/lb'; }), correct: idx };
    }

    // Precompute all mc() results to avoid double-call shuffle bug
    var q1s1mc = mcDollar(traceFixedA, [traceFixedB, traceFixedA * 1.1, commonFixed]);
    var q1s2mc = mcDollar(traceFixedB, [traceFixedA, traceFixedB * 1.1, commonFixed]);
    var q2mc   = mcDollar(commonFixed, [traceFixedA + traceFixedB, commonFixed * 1.1, traceFixedA]);
    var q3mc   = mc(soFinImpactA, [soFinImpactA * 1.1, -soFinImpactA, (soPriceA - traceFixedA_perUnit - varTotalA) * soUnitsA]);
    var q4mc   = mc(soFinImpactB, [soFinImpactB * 1.5, -soFinImpactB, soFinImpactA]);
    var q5s1mc = mcDollar(soLargeOppCost, [cmA * soLargeUnitsA, soLargeOppCost * 1.5, cmA * soUnitsA]);
    var q5s2mc = mc(soLargeFinImpact, [soFinImpactA, soLargeFinImpact * 1.1, -soLargeFinImpact]);
    var q6mc   = mc(discBetaFinImpact, [discBetaCM, discBetaTraceFixed, discBetaFinImpact * 1.2]);
    var q7mc   = mc(discBeta54FinImpact, [discBetaFinImpact, -discBeta54FinImpact, discBeta54FinImpact * 1.2]);
    var q8mc   = mc(disc_plus_add, [discBetaFinImpact, cmA * addAlphaUnits, disc_plus_add * 1.2]);
    var q9mc   = mc(makeVsBuy94_impact, [makeVsBuy69_impact, -makeVsBuy94_impact, makeVsBuy94_impact * 1.1]);
    var q10mc  = mc(makeVsBuy69_impact, [makeVsBuy94_impact, -makeVsBuy69_impact, makeVsBuy69_impact * 1.1]);
    var q12s1mc = mcRate(cmPerLbA, [cmPerLbB, cmA, cmPerLbA * 1.2]);
    var q12s2mc = mcRate(cmPerLbB, [cmPerLbA, cmB, cmPerLbB * 1.2]);
    var q14mc  = mcDollar(optTotalCM, [cmB * normalUnitsB, cmA * normalUnitsA + cmB * normalUnitsB, optTotalCM * 1.1]);
    var q15mc  = mcRate(maxPricePerLb, [cmPerLbB, rmCostPerLb, maxPricePerLb * 1.2]);

    return {
      data: {
        priceA: priceA, priceB: priceB, cmA: cmA, cmB: cmB,
        normalUnitsA: normalUnitsA, normalUnitsB: normalUnitsB,
        traceFixedA: traceFixedA, traceFixedB: traceFixedB, commonFixed: commonFixed,
        cmPerLbA: cmPerLbA, cmPerLbB: cmPerLbB, totalLbs: totalLbs,
        optUnitsA: optUnitsA, optUnitsB: optUnitsB, optTotalCM: optTotalCM
      },
      dataTable: [
        ["Alpha selling price", fmt(priceA) + "/unit"],
        ["Beta selling price", fmt(priceB) + "/unit"],
        ["Alpha variable costs (DM+DL+VMfgOH+VSelling)", fmt(varTotalA) + "/unit"],
        ["Beta variable costs (DM+DL+VMfgOH+VSelling)", fmt(varTotalB) + "/unit"],
        ["Alpha CM per unit", fmt(cmA)],
        ["Beta CM per unit", fmt(cmB)],
        ["Alpha traceable fixed OH per unit", fmt(traceFixedA_perUnit)],
        ["Beta traceable fixed OH per unit", fmt(traceFixedB_perUnit)],
        ["Normal capacity (Alpha & Beta)", fmtN(normalUnitsA) + " units each"],
        ["Common fixed costs per unit (allocated)", fmt(commonFixed_perUnit)],
        ["Raw material cost", fmt(rmCostPerLb) + "/lb"],
        ["Alpha RM per unit", lbsPerA + " lbs"],
        ["Beta RM per unit", lbsPerB + " lbs"],
        ["Total RM available (constrained)", fmtN(totalLbs) + " lbs"]
      ],
      questions: [
        {
          title: "Q1 — Total Traceable Fixed Costs",
          steps: [
            {
              inst: "Alpha has a traceable fixed OH of " + fmt(traceFixedA_perUnit) + "/unit and normal volume is " + fmtN(normalUnitsA) + " units. What is total traceable fixed OH for Alpha?",
              choices: q1s1mc.choices,
              correct: q1s1mc.correct,
              exp: fmt(traceFixedA_perUnit) + " × " + fmtN(normalUnitsA) + " = " + fmt(traceFixedA),
              result: "Alpha traceable fixed costs = " + fmt(traceFixedA),
              formula: "Total Traceable Fixed = Fixed per Unit × Normal Volume",
              numbers: "Traceable fixed/unit = " + fmt(traceFixedA_perUnit) + ", Volume = " + fmtN(normalUnitsA)
            },
            {
              inst: "Beta has traceable fixed OH of " + fmt(traceFixedB_perUnit) + "/unit and normal volume of " + fmtN(normalUnitsB) + " units. What is total traceable fixed OH for Beta?",
              choices: q1s2mc.choices,
              correct: q1s2mc.correct,
              exp: fmt(traceFixedB_perUnit) + " × " + fmtN(normalUnitsB) + " = " + fmt(traceFixedB),
              result: "Beta traceable fixed costs = " + fmt(traceFixedB),
              formula: "Total Traceable Fixed = Fixed per Unit × Normal Volume",
              numbers: "Traceable fixed/unit = " + fmt(traceFixedB_perUnit) + ", Volume = " + fmtN(normalUnitsB)
            }
          ]
        },
        {
          title: "Q2 — Total Common Fixed Expenses",
          steps: [{
            inst: "Common fixed costs are " + fmt(commonFixed_perUnit) + "/unit allocated to all " + fmtN(normalUnitsA + normalUnitsB) + " total units. What are total common fixed expenses?",
            choices: q2mc.choices,
            correct: q2mc.correct,
            exp: fmt(commonFixed_perUnit) + " × " + fmtN(normalUnitsA + normalUnitsB) + " = " + fmt(commonFixed),
            result: "Common fixed expenses = " + fmt(commonFixed),
            formula: "Common Fixed = Common Fixed per Unit × Total Units",
            numbers: "Common fixed/unit = " + fmt(commonFixed_perUnit) + ", Total units = " + fmtN(normalUnitsA + normalUnitsB)
          }]
        },
        {
          title: "Q3 — Special Order: Alpha (" + fmtN(soUnitsA) + " units at $136)",
          steps: [{
            inst: "A customer offers to buy " + fmtN(soUnitsA) + " Alpha units at " + fmt(soPriceA) + " per unit. Alpha's variable cost is " + fmt(varTotalA) + "/unit. There is idle capacity — no regular sales are displaced. What is the financial impact?",
            choices: q3mc.choices,
            correct: q3mc.correct,
            exp: "(" + fmt(soPriceA) + " − " + fmt(varTotalA) + ") × " + fmtN(soUnitsA) + " = " + fmt(soFinImpactA) + " advantage",
            result: "Special order Alpha financial advantage = " + fmt(soFinImpactA),
            formula: "Special Order Impact = (Special Price − Variable Cost) × Units",
            numbers: "Special price = " + fmt(soPriceA) + ", Variable cost = " + fmt(varTotalA) + ", Units = " + fmtN(soUnitsA)
          }]
        },
        {
          title: "Q4 — Special Order: Beta (" + fmtN(soUnitsB) + " units at $62)",
          steps: [{
            inst: "A customer offers to buy " + fmtN(soUnitsB) + " Beta units at " + fmt(soPriceB) + " per unit. Beta's variable cost is " + fmt(varTotalB) + "/unit. There is idle capacity. What is the financial impact?",
            choices: q4mc.choices,
            correct: q4mc.correct,
            exp: "(" + fmt(soPriceB) + " − " + fmt(varTotalB) + ") × " + fmtN(soUnitsB) + " = " + fmt(soFinImpactB) + (soFinImpactB >= 0 ? " advantage" : " disadvantage"),
            result: "Special order Beta financial impact = " + fmt(soFinImpactB),
            formula: "Special Order Impact = (Special Price − Variable Cost) × Units",
            numbers: "Special price = " + fmt(soPriceB) + ", Variable cost = " + fmt(varTotalB) + ", Units = " + fmtN(soUnitsB)
          }]
        },
        {
          title: "Q5 — Large Special Order with Displaced Sales",
          steps: [
            {
              inst: "A large special order wants " + fmtN(soLargeUnitsA) + " Alpha at " + fmt(soPriceA) + ". This displaces " + fmtN(soDisplacedA) + " regular Alpha sales (at " + fmt(priceA) + "). Alpha CM/unit = " + fmt(cmA) + ". What is the opportunity cost (lost CM from displaced sales)?",
              choices: q5s1mc.choices,
              correct: q5s1mc.correct,
              exp: fmt(cmA) + " × " + fmtN(soDisplacedA) + " displaced units = " + fmt(soLargeOppCost) + " opportunity cost",
              result: "Opportunity cost (displaced Alpha) = " + fmt(soLargeOppCost),
              formula: "Opportunity Cost = CM per unit × Units Displaced",
              numbers: "CM/unit Alpha = " + fmt(cmA) + ", Displaced = " + fmtN(soDisplacedA)
            },
            {
              inst: "Special order contribution: (" + fmt(soPriceA) + " − " + fmt(varTotalA) + ") × " + fmtN(soLargeUnitsA) + " = " + fmt((soPriceA - varTotalA) * soLargeUnitsA) + ". Minus opportunity cost " + fmt(soLargeOppCost) + ". What is the net financial impact?",
              choices: q5s2mc.choices,
              correct: q5s2mc.correct,
              exp: fmt((soPriceA - varTotalA) * soLargeUnitsA) + " − " + fmt(soLargeOppCost) + " = " + fmt(soLargeFinImpact) + (soLargeFinImpact < 0 ? " — should REJECT order" : " — should ACCEPT order"),
              result: "Large special order net impact = " + fmt(soLargeFinImpact),
              formula: "Net Impact = Special Order CM − Opportunity Cost",
              numbers: "SO CM = " + fmt((soPriceA - varTotalA) * soLargeUnitsA) + ", Opp cost = " + fmt(soLargeOppCost)
            }
          ]
        },
        {
          title: "Q6 — Discontinue Beta: Financial Impact",
          steps: [{
            inst: "Beta's total CM = " + fmt(discBetaCM) + ". Traceable fixed costs = " + fmt(discBetaTraceFixed) + " (avoidable if dropped). Common fixed = NOT avoidable. What is the financial impact of discontinuing Beta?",
            choices: q6mc.choices,
            correct: q6mc.correct,
            exp: "Saved fixed costs " + fmt(discBetaTraceFixed) + " − Lost CM " + fmt(discBetaCM) + " = " + fmt(discBetaFinImpact) + (discBetaFinImpact < 0 ? " — KEEP Beta (loss from dropping)" : " — DROP Beta (saves money)"),
            result: "Discontinue Beta impact = " + fmt(discBetaFinImpact),
            formula: "Impact = Saved Traceable Fixed − Lost Contribution Margin",
            numbers: "Traceable fixed saved = " + fmt(discBetaTraceFixed) + ", CM lost = " + fmt(discBetaCM)
          }]
        },
        {
          title: "Q7 — Discontinue " + fmtN(discBetaUnits54) + " Units of Beta",
          steps: [{
            inst: "If " + fmtN(discBetaUnits54) + " Beta units are discontinued (partial), traceable fixed saved = " + fmt(traceFixedB_perUnit) + "/unit and CM lost = " + fmt(cmB) + "/unit. What is the financial impact?",
            choices: q7mc.choices,
            correct: q7mc.correct,
            exp: "(" + fmt(traceFixedB_perUnit) + " − " + fmt(cmB) + ") × " + fmtN(discBetaUnits54) + " = " + fmt(discBeta54FinImpact) + (discBeta54FinImpact < 0 ? " disadvantage" : " advantage"),
            result: "Discontinue " + fmtN(discBetaUnits54) + " Beta impact = " + fmt(discBeta54FinImpact),
            formula: "Impact = (Traceable Fixed/unit − CM/unit) × Units",
            numbers: "Trace fixed saved/unit = " + fmt(traceFixedB_perUnit) + ", CM/unit = " + fmt(cmB) + ", Units = " + fmtN(discBetaUnits54)
          }]
        },
        {
          title: "Q8 — Discontinue Beta AND Add Alpha Sales",
          steps: [{
            inst: "Drop Beta (impact: " + fmt(discBetaFinImpact) + ") AND increase Alpha by " + fmtN(addAlphaUnits) + " units (CM " + fmt(cmA) + "/unit). What is the combined financial impact?",
            choices: q8mc.choices,
            correct: q8mc.correct,
            exp: fmt(discBetaFinImpact) + " (drop Beta) + " + fmt(cmA * addAlphaUnits) + " (add Alpha CM) = " + fmt(disc_plus_add),
            result: "Combined impact = " + fmt(disc_plus_add),
            formula: "Combined = Drop Beta Impact + (Added Alpha Units × Alpha CM)",
            numbers: "Drop Beta = " + fmt(discBetaFinImpact) + ", Add Alpha CM = " + fmt(cmA * addAlphaUnits)
          }]
        },
        {
          title: "Q9 — Make vs Buy: " + fmtN(buyUnitsA_lose) + " Alpha at $136",
          steps: [{
            inst: "Buy " + fmtN(buyUnitsA_lose) + " Alpha externally at " + fmt(buyPriceA) + "/unit vs. making them (variable cost " + fmt(varTotalA) + " + traceable fixed " + fmt(traceFixedA_perUnit) + " per unit). What is the financial impact of buying?",
            choices: q9mc.choices,
            correct: q9mc.correct,
            exp: "Saved (var + trace fixed): " + fmt(varTotalA + traceFixedA_perUnit) + " × " + fmtN(buyUnitsA_lose) + " = " + fmt(savedVarCosts + savedTraceFixed) + ". Purchase cost: " + fmt(purchaseCost) + ". Net: " + fmt(makeVsBuy94_impact) + (makeVsBuy94_impact > 0 ? " — BUY is better" : " — MAKE is better"),
            result: "Make vs buy (" + fmtN(buyUnitsA_lose) + " units) impact = " + fmt(makeVsBuy94_impact),
            formula: "Buy Impact = Savings (var + avoidable fixed) − Purchase Cost",
            numbers: "Savings/unit = " + fmt(varTotalA + traceFixedA_perUnit) + ", Buy price = " + fmt(buyPriceA) + ", Units = " + fmtN(buyUnitsA_lose)
          }]
        },
        {
          title: "Q10 — Make vs Buy: " + fmtN(buyUnitsA_win) + " Alpha at $136",
          steps: [{
            inst: "Buy " + fmtN(buyUnitsA_win) + " Alpha at " + fmt(buyPriceA) + "/unit. At this lower volume, traceable fixed costs are NOT avoidable (capacity still needed). Only variable costs " + fmt(varTotalA) + "/unit are saved. What is the financial impact?",
            choices: q10mc.choices,
            correct: q10mc.correct,
            exp: "Saved var cost: " + fmt(varTotalA) + " × " + fmtN(buyUnitsA_win) + " = " + fmt(savedVar69) + ". Purchase cost: " + fmt(purchaseCost69) + ". Net: " + fmt(makeVsBuy69_impact) + (makeVsBuy69_impact > 0 ? " — BUY is better" : " — MAKE is better"),
            result: "Make vs buy (" + fmtN(buyUnitsA_win) + " units) impact = " + fmt(makeVsBuy69_impact),
            formula: "Buy Impact = Variable Savings − Purchase Cost (when fixed costs not avoidable)",
            numbers: "Var savings/unit = " + fmt(varTotalA) + ", Buy price = " + fmt(buyPriceA) + ", Units = " + fmtN(buyUnitsA_win)
          }]
        },
        {
          title: "Q11 — Raw Material per Unit",
          steps: [{
            inst: "Alpha requires how many pounds of raw material per unit? (Note: RM costs " + fmt(rmCostPerLb) + "/lb, and Alpha DM cost is " + fmt(dmA) + "/unit)",
            choices: ["A. 5 lbs per unit", "B. 3 lbs per unit", "C. 8 lbs per unit", "D. 6 lbs per unit"],
            correct: 0,
            exp: "Alpha DM = " + fmt(dmA) + "/unit ÷ " + fmt(rmCostPerLb) + "/lb = " + lbsPerA + " lbs/unit. Beta DM = " + fmt(dmB) + " ÷ " + fmt(rmCostPerLb) + " = " + lbsPerB + " lbs/unit.",
            result: "Alpha = " + lbsPerA + " lbs/unit; Beta = " + lbsPerB + " lbs/unit",
            formula: "Lbs per unit = DM cost per unit / Cost per lb",
            numbers: "Alpha DM = " + fmt(dmA) + ", Beta DM = " + fmt(dmB) + ", RM cost = " + fmt(rmCostPerLb) + "/lb"
          }]
        },
        {
          title: "Q12 — Contribution Margin per Pound of RM",
          steps: [
            {
              inst: "Alpha CM per unit = " + fmt(cmA) + ", uses " + lbsPerA + " lbs/unit. What is Alpha's CM per pound of raw material?",
              choices: q12s1mc.choices,
              correct: q12s1mc.correct,
              exp: fmt(cmA) + " ÷ " + lbsPerA + " lbs = " + fmtD(cmPerLbA) + "/lb",
              result: "Alpha CM/lb = " + fmtD(cmPerLbA),
              formula: "CM per lb = CM per unit / Lbs per unit",
              numbers: "Alpha CM = " + fmt(cmA) + ", Lbs = " + lbsPerA
            },
            {
              inst: "Beta CM per unit = " + fmt(cmB) + ", uses " + lbsPerB + " lbs/unit. What is Beta's CM per pound of raw material?",
              choices: q12s2mc.choices,
              correct: q12s2mc.correct,
              exp: fmt(cmB) + " ÷ " + lbsPerB + " lbs = " + fmtD(cmPerLbB) + "/lb",
              result: "Beta CM/lb = " + fmtD(cmPerLbB),
              formula: "CM per lb = CM per unit / Lbs per unit",
              numbers: "Beta CM = " + fmt(cmB) + ", Lbs = " + lbsPerB
            }
          ]
        },
        {
          title: "Q13 — Optimal Product Mix with RM Constraint",
          steps: [{
            inst: "Total RM available = " + fmtN(totalLbs) + " lbs. Alpha needs " + lbsPerA + " lbs/unit (CM/lb = " + fmtD(cmPerLbA) + "), Beta needs " + lbsPerB + " lbs/unit (CM/lb = " + fmtD(cmPerLbB) + "). Max demand = " + fmtN(normalUnitsA) + " each. Which product should be produced first?",
            choices: [
              "A. Beta — it has higher CM per pound of RM",
              "B. Alpha — it has higher CM per unit",
              "C. Alpha — it has higher selling price",
              "D. Equal priority for both products"
            ],
            correct: 0,
            exp: "Beta CM/lb = " + fmtD(cmPerLbB) + " vs Alpha CM/lb = " + fmtD(cmPerLbA) + ". Produce Beta first (higher CM per constrained resource), then use remaining lbs for Alpha.",
            result: "Optimal: Produce Beta first, then Alpha with remaining RM",
            formula: "Rank by CM per unit of constrained resource (lbs of RM)",
            numbers: "Alpha CM/lb = " + fmtD(cmPerLbA) + ", Beta CM/lb = " + fmtD(cmPerLbB)
          }]
        },
        {
          title: "Q14 — Total CM at Optimal Mix",
          steps: [{
            inst: "Optimal mix: " + fmtN(optUnitsB) + " Beta units (" + fmtN(optUnitsB * lbsPerB) + " lbs) and " + fmtN(optUnitsA) + " Alpha units (" + fmtN(optUnitsA * lbsPerA) + " lbs). Total = " + fmtN(optUnitsB * lbsPerB + optUnitsA * lbsPerA) + " lbs. What is total CM?",
            choices: q14mc.choices,
            correct: q14mc.correct,
            exp: "(" + fmtN(optUnitsB) + " × " + fmt(cmB) + ") + (" + fmtN(optUnitsA) + " × " + fmt(cmA) + ") = " + fmt(cmB * optUnitsB) + " + " + fmt(cmA * optUnitsA) + " = " + fmt(optTotalCM),
            result: "Total CM at optimal mix = " + fmt(optTotalCM),
            formula: "Total CM = (Beta units × Beta CM) + (Alpha units × Alpha CM)",
            numbers: "Beta: " + fmtN(optUnitsB) + " × " + fmt(cmB) + "; Alpha: " + fmtN(optUnitsA) + " × " + fmt(cmA)
          }]
        },
        {
          title: "Q15 — Maximum Price per Additional Pound of RM",
          steps: [{
            inst: "The optimal plan uses all " + fmtN(totalLbs) + " lbs. The constrained product with the highest CM/lb is Beta at " + fmtD(cmPerLbB) + "/lb. What is the maximum price per additional pound of RM the company would pay?",
            choices: q15mc.choices,
            correct: q15mc.correct,
            exp: "Current cost = " + fmtD(rmCostPerLb) + "/lb. Additional CM gained = " + fmtD(cmPerLbB) + "/lb. Max price = " + fmtD(rmCostPerLb) + " + " + fmtD(cmPerLbB) + " = " + fmtD(maxPricePerLb) + "/lb (breakeven on additional RM).",
            result: "Max price for additional RM = " + fmtD(maxPricePerLb) + "/lb",
            formula: "Max price = Current RM cost + CM per lb of best constrained product",
            numbers: "Current cost = " + fmtD(rmCostPerLb) + "/lb, Best CM/lb = " + fmtD(cmPerLbB)
          }]
        }
      ]
    };
  }
};
