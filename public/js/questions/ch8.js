window.CH8 = {
  title: "Chapter 8 — Master Budget",
  description: "Comprehensive budgeting: sales, production, materials, labor, and income",
  formulas: [
    "Budgeted Sales = Units × Selling Price",
    "Cash Collections = (collection % × this month sales) + ((1-collection %) × last month sales)",
    "Accounts Receivable = (1 - collection %) × this month sales",
    "Production = Budgeted Sales + Ending FG − Beginning FG",
    "RM to Purchase (lbs) = Production needs + Ending RM − Beginning RM",
    "RM Purchase Cost = Pounds × Cost per Pound",
    "Cash Disbursements = (pay % × this month purchases) + ((1-pay %) × last month purchases)",
    "Accounts Payable = (1 - pay %) × this month purchases",
    "RM Inventory = Ending RM lbs × Cost per Pound",
    "DL Cost = Production × DL Hours per Unit × Wage Rate",
    "Unit Product Cost = DM/unit + DL/unit + Variable MOH/unit",
    "Ending FG Value = Ending FG Units × Unit Product Cost",
    "COGS = Units Sold × Unit Product Cost",
    "Gross Margin = Sales − COGS",
    "S&A Expense = (Variable rate × Units Sold) + Fixed S&A",
    "NOI = Gross Margin − S&A Expense"
  ],
  definitions: [
    { q: "In the production budget, beginning finished goods inventory equals:", choices: ["A. 20% of current month sales", "B. The ending FG inventory from the prior month", "C. Total units produced last month", "D. Zero, since it's a new budget period"], correct: 1, exp: "Beginning FG = prior month's ending FG. The inventory carried over becomes the starting point for the new month." },
    { q: "Which budget must be completed BEFORE the cash disbursements budget?", choices: ["A. Sales budget", "B. Direct labor budget", "C. Raw materials purchases budget", "D. S&A budget"], correct: 2, exp: "Cash disbursements for materials depends on knowing the purchase amounts, which come from the RM purchases budget." }
  ],
  generate: function() {
    var prices = [60, 65, 70, 75, 80, 85, 90];
    var price = prices[Math.floor(Math.random() * prices.length)];

    var baseUnits = [8000, 9000, 10000, 12000, 15000, 18000, 20000];
    var base = baseUnits[Math.floor(Math.random() * baseUnits.length)];
    var units = [
      Math.round(base * 0.5 / 100) * 100,
      base,
      Math.round(base * 1.1 / 100) * 100,
      Math.round(base * 1.15 / 100) * 100
    ];

    var collPct = [30, 40, 50][Math.floor(Math.random() * 3)];
    var fgPct = [20, 25, 30][Math.floor(Math.random() * 3)];
    var lbsPerUnit = [3, 4, 5, 6][Math.floor(Math.random() * 4)];
    var costPerLb = [1.50, 2.00, 2.40, 2.50, 3.00][Math.floor(Math.random() * 5)];
    var rmEndPct = [10, 15, 20][Math.floor(Math.random() * 3)];
    var rmPayPct = [25, 30, 50][Math.floor(Math.random() * 3)];
    var dlHours = [1, 2, 3][Math.floor(Math.random() * 3)];
    var dlRate = [10, 12, 14, 15][Math.floor(Math.random() * 4)];
    var varSA = [1, 2, 3][Math.floor(Math.random() * 3)];
    var fixedSA = [50000, 60000, 69000, 75000, 80000][Math.floor(Math.random() * 5)];
    var varMOH = [5, 8, 10, 12][Math.floor(Math.random() * 4)];

    var sales1 = units[0] * price;
    var sales2 = units[1] * price;

    var endFG = Math.round(units[2] * fgPct / 100 / 100) * 100;
    var beginFG = Math.round(units[1] * fgPct / 100 / 100) * 100;
    var production = units[1] + endFG - beginFG;

    var endFGNext = Math.round(units[3] * fgPct / 100 / 100) * 100;
    var beginFGNext = endFG;
    var productionNext = units[2] + endFGNext - beginFGNext;

    var rmNeeded = production * lbsPerUnit;
    var rmNeededNext = productionNext * lbsPerUnit;
    var endRM = Math.round(rmNeededNext * rmEndPct / 100);
    var beginRM = Math.round(rmNeeded * rmEndPct / 100);
    var rmPurchaseLbs = rmNeeded + endRM - beginRM;
    var rmPurchaseCost = Math.round(rmPurchaseLbs * costPerLb * 100) / 100;

    var priorRmNeeded = units[0] * lbsPerUnit;
    var priorRmPurchaseLbs = priorRmNeeded * 1.05;
    var priorRmCost = Math.round(priorRmPurchaseLbs * costPerLb / 100) * 100;

    var collections = Math.round(collPct / 100 * sales2) + Math.round((100 - collPct) / 100 * sales1);
    var ar = Math.round((100 - collPct) / 100 * sales2);

    var cashDisb = Math.round(rmPayPct / 100 * rmPurchaseCost) + Math.round((100 - rmPayPct) / 100 * priorRmCost);
    var ap = Math.round((100 - rmPayPct) / 100 * rmPurchaseCost);
    var rmInventory = Math.round(endRM * costPerLb * 100) / 100;

    var dlCost = production * dlHours * dlRate;

    var dmUnit = lbsPerUnit * costPerLb;
    var dlUnit = dlHours * dlRate;
    var vmohUnit = dlHours * varMOH;
    var unitCost = dmUnit + dlUnit + vmohUnit;

    var endFGValue = Math.round(endFG * unitCost);
    var cogs = units[1] * unitCost;
    var grossMargin = sales2 - cogs;
    var sa = varSA * units[1] + fixedSA;
    var noi = grossMargin - sa;

    var fmt = function(n) { return '$' + Math.round(n).toLocaleString(); };
    var fmtN = function(n) { return Math.round(n).toLocaleString(); };

    function mc(correct, wrongs, isDollar) {
      if (isDollar === undefined) isDollar = true;
      var f = isDollar ? fmt : function(n) { return n.toLocaleString(); };
      var pool = [correct].concat(wrongs.filter(function(w) { return w !== correct && w > 0; })).slice(0, 4);
      while (pool.length < 4) pool.push(Math.abs(correct) * 1.1 * pool.length);
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var letters = ['A', 'B', 'C', 'D'];
      return { choices: s.map(function(v, i) { return letters[i] + '. ' + f(Math.round(v)); }), correct: s.indexOf(correct) };
    }

    var collFromCurrent = Math.round(collPct / 100 * sales2);
    var collFromPrior = Math.round((100 - collPct) / 100 * sales1);

    return {
      data: { price: price, units: units, collPct: collPct, fgPct: fgPct, lbsPerUnit: lbsPerUnit, costPerLb: costPerLb, rmEndPct: rmEndPct, rmPayPct: rmPayPct, dlHours: dlHours, dlRate: dlRate, varSA: varSA, fixedSA: fixedSA, varMOH: varMOH, priorRmCost: priorRmCost, rmNeededNext: rmNeededNext },
      dataTable: [
        ["Selling price", fmt(price) + "/unit"],
        ["Prior / Current / Next / After units", fmtN(units[0]) + " / " + fmtN(units[1]) + " / " + fmtN(units[2]) + " / " + fmtN(units[3])],
        ["Collections", collPct + "% same mo · " + (100 - collPct) + "% next mo"],
        ["Ending FG inventory", fgPct + "% of next month unit sales"],
        ["Raw materials per unit", lbsPerUnit + " lbs @ " + fmt(costPerLb) + "/lb"],
        ["Ending RM inventory", rmEndPct + "% of next month RM needs"],
        ["RM payments", rmPayPct + "% same mo · " + (100 - rmPayPct) + "% next mo"],
        ["Direct labor per unit", dlHours + " hr" + (dlHours > 1 ? "s" : "") + " @ " + fmt(dlRate) + "/hr"],
        ["Variable S&A", fmt(varSA) + "/unit sold"],
        ["Fixed S&A", fmt(fixedSA) + "/month"],
        ["Variable MOH", fmt(varMOH) + "/DL-hr"],
        ["Prior month RM purchases (given)", fmt(priorRmCost)],
        ["Next month RM needed (given)", fmtN(rmNeededNext) + " lbs"]
      ],
      questions: [
        {
          title: "Q1 — Budgeted sales for current month",
          steps: [{
            inst: "What are the budgeted sales for the current month?",
            choices: mc(sales2, [sales1, units[2] * price, units[0] * price]).choices,
            correct: mc(sales2, [sales1, units[2] * price, units[0] * price]).correct,
            exp: fmtN(units[1]) + " units × " + fmt(price) + " = " + fmt(sales2),
            result: "Budgeted sales = " + fmt(sales2),
            formula: "Budgeted Sales = Units × Selling Price",
            numbers: "Current month units = " + fmtN(units[1]) + ", Price = " + fmt(price)
          }]
        },
        {
          title: "Q2 — Cash collections for current month",
          steps: [
            {
              inst: "How much cash is collected from current month's own sales?",
              choices: mc(collFromCurrent, [Math.round((100 - collPct) / 100 * sales2), sales2, Math.round(collPct / 100 * sales1)]).choices,
              correct: mc(collFromCurrent, [Math.round((100 - collPct) / 100 * sales2), sales2, Math.round(collPct / 100 * sales1)]).correct,
              exp: collPct + "% × " + fmt(sales2) + " = " + fmt(collFromCurrent),
              result: "Current mo portion = " + fmt(collFromCurrent),
              formula: "Collections from current month = " + collPct + "% × current month sales",
              numbers: "Current month sales = " + fmt(sales2)
            },
            {
              inst: "How much cash is collected from prior month's sales?",
              choices: mc(collFromPrior, [Math.round(collPct / 100 * sales1), sales1, Math.round((100 - collPct) / 100 * sales2)]).choices,
              correct: mc(collFromPrior, [Math.round(collPct / 100 * sales1), sales1, Math.round((100 - collPct) / 100 * sales2)]).correct,
              exp: (100 - collPct) + "% × " + fmt(sales1) + " = " + fmt(collFromPrior),
              result: "Prior mo portion = " + fmt(collFromPrior),
              formula: "Collections from prior month = " + (100 - collPct) + "% × prior month sales",
              numbers: "Prior month sales = " + fmt(sales1)
            },
            {
              inst: "What are the total cash collections for the current month?",
              choices: mc(collections, [Math.round(collections * 0.9), Math.round(collections * 1.1), sales2]).choices,
              correct: mc(collections, [Math.round(collections * 0.9), Math.round(collections * 1.1), sales2]).correct,
              exp: fmt(collFromCurrent) + " + " + fmt(collFromPrior) + " = " + fmt(collections),
              result: "Total collections = " + fmt(collections),
              formula: "Total Collections = current month portion + prior month portion",
              numbers: fmt(collFromCurrent) + " + " + fmt(collFromPrior)
            }
          ]
        },
        {
          title: "Q3 — Accounts receivable at end of month",
          steps: [{
            inst: "What is the accounts receivable balance at the end of the current month?",
            choices: mc(ar, [sales2, Math.round(ar * 0.5), collFromCurrent]).choices,
            correct: mc(ar, [sales2, Math.round(ar * 0.5), collFromCurrent]).correct,
            exp: (100 - collPct) + "% of " + fmt(sales2) + " = " + fmt(ar),
            result: "AR balance = " + fmt(ar),
            formula: "AR = " + (100 - collPct) + "% × current month sales (uncollected portion)",
            numbers: "Current month sales = " + fmt(sales2)
          }]
        },
        {
          title: "Q4 — Production budget (units to produce)",
          steps: [
            {
              inst: "What is the desired ending finished goods inventory (in units)?",
              choices: (function() {
                var pool = [endFG, beginFG, endFGNext, units[1]].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
                while (pool.length < 4) pool.push(endFG + pool.length * 100);
                var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
                return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtN(v) + ' units'; }), correct: s.indexOf(endFG) };
              })().choices,
              correct: (function() {
                var pool = [endFG, beginFG, endFGNext, units[1]].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
                while (pool.length < 4) pool.push(endFG + pool.length * 100);
                var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
                return s.indexOf(endFG);
              })(),
              exp: fgPct + "% × " + fmtN(units[2]) + " next month units = " + fmtN(endFG) + " units",
              result: "Ending FG = " + fmtN(endFG) + " units",
              formula: "Ending FG = " + fgPct + "% × next month's budgeted sales units",
              numbers: "Next month units = " + fmtN(units[2])
            },
            {
              inst: "What is the beginning finished goods inventory (in units)?",
              choices: (function() {
                var pool = [beginFG, endFG, units[0], Math.round(units[0] * fgPct / 100)].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
                while (pool.length < 4) pool.push(beginFG + pool.length * 100);
                var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
                return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtN(v) + ' units'; }), correct: s.indexOf(beginFG) };
              })().choices,
              correct: (function() {
                var pool = [beginFG, endFG, units[0], Math.round(units[0] * fgPct / 100)].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
                while (pool.length < 4) pool.push(beginFG + pool.length * 100);
                var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
                return s.indexOf(beginFG);
              })(),
              exp: fgPct + "% × " + fmtN(units[1]) + " current month units = " + fmtN(beginFG) + " units",
              result: "Beginning FG = " + fmtN(beginFG) + " units",
              formula: "Beginning FG = " + fgPct + "% × current month's budgeted sales units",
              numbers: "Current month units = " + fmtN(units[1])
            },
            {
              inst: "How many units must be produced?",
              choices: (function() {
                var pool = [production, units[1], production + endFG, production - beginFG].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
                while (pool.length < 4) pool.push(production + pool.length * 100);
                var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
                return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtN(v) + ' units'; }), correct: s.indexOf(production) };
              })().choices,
              correct: (function() {
                var pool = [production, units[1], production + endFG, production - beginFG].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
                while (pool.length < 4) pool.push(production + pool.length * 100);
                var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
                return s.indexOf(production);
              })(),
              exp: fmtN(units[1]) + " + " + fmtN(endFG) + " − " + fmtN(beginFG) + " = " + fmtN(production) + " units",
              result: "Production = " + fmtN(production) + " units",
              formula: "Production = Sales + Ending FG − Beginning FG",
              numbers: "Sales = " + fmtN(units[1]) + ", Ending FG = " + fmtN(endFG) + ", Beginning FG = " + fmtN(beginFG)
            }
          ]
        },
        {
          title: "Q5 — Raw materials to purchase (lbs)",
          steps: [
            {
              inst: "How many pounds of raw materials are needed for current month production?",
              choices: (function() {
                var pool = [rmNeeded, rmNeeded + 1000, rmNeeded - 1000, units[1] * lbsPerUnit].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
                while (pool.length < 4) pool.push(rmNeeded + pool.length * 500);
                var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
                return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtN(v) + ' lbs'; }), correct: s.indexOf(rmNeeded) };
              })().choices,
              correct: (function() {
                var pool = [rmNeeded, rmNeeded + 1000, rmNeeded - 1000, units[1] * lbsPerUnit].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
                while (pool.length < 4) pool.push(rmNeeded + pool.length * 500);
                var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
                return s.indexOf(rmNeeded);
              })(),
              exp: fmtN(production) + " units × " + lbsPerUnit + " lbs = " + fmtN(rmNeeded) + " lbs",
              result: "RM needed = " + fmtN(rmNeeded) + " lbs",
              formula: "RM needed = Units to produce × lbs per unit",
              numbers: "Production = " + fmtN(production) + ", Lbs/unit = " + lbsPerUnit
            },
            {
              inst: "What is the desired ending raw materials inventory (lbs)?",
              choices: (function() {
                var pool = [endRM, beginRM, Math.round(rmNeededNext * rmEndPct / 100) + 1000, endRM + 500].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
                while (pool.length < 4) pool.push(endRM + pool.length * 200);
                var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
                return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtN(v) + ' lbs'; }), correct: s.indexOf(endRM) };
              })().choices,
              correct: (function() {
                var pool = [endRM, beginRM, Math.round(rmNeededNext * rmEndPct / 100) + 1000, endRM + 500].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
                while (pool.length < 4) pool.push(endRM + pool.length * 200);
                var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
                return s.indexOf(endRM);
              })(),
              exp: rmEndPct + "% × " + fmtN(rmNeededNext) + " lbs (next month needs) = " + fmtN(endRM) + " lbs",
              result: "Ending RM = " + fmtN(endRM) + " lbs",
              formula: "Ending RM = " + rmEndPct + "% × next month's RM production needs",
              numbers: "Next month RM needs = " + fmtN(rmNeededNext) + " lbs (given)"
            },
            {
              inst: "How many pounds should be purchased? (Beginning RM = " + fmtN(beginRM) + " lbs)",
              choices: (function() {
                var pool = [rmPurchaseLbs, rmNeeded, rmPurchaseLbs + endRM, rmPurchaseLbs - beginRM].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
                while (pool.length < 4) pool.push(rmPurchaseLbs + pool.length * 500);
                var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
                return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtN(v) + ' lbs'; }), correct: s.indexOf(rmPurchaseLbs) };
              })().choices,
              correct: (function() {
                var pool = [rmPurchaseLbs, rmNeeded, rmPurchaseLbs + endRM, rmPurchaseLbs - beginRM].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
                while (pool.length < 4) pool.push(rmPurchaseLbs + pool.length * 500);
                var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
                return s.indexOf(rmPurchaseLbs);
              })(),
              exp: fmtN(rmNeeded) + " + " + fmtN(endRM) + " − " + fmtN(beginRM) + " = " + fmtN(rmPurchaseLbs) + " lbs",
              result: "RM to purchase = " + fmtN(rmPurchaseLbs) + " lbs",
              formula: "Purchases = RM needed + Ending RM − Beginning RM",
              numbers: "RM needed = " + fmtN(rmNeeded) + ", Ending RM = " + fmtN(endRM) + ", Beginning RM = " + fmtN(beginRM)
            }
          ]
        },
        {
          title: "Q6 — Cost of raw materials purchases",
          steps: [{
            inst: "What is the total dollar cost of raw materials to be purchased?",
            choices: mc(rmPurchaseCost, [rmPurchaseLbs, Math.round(rmPurchaseCost * 1.1), Math.round(rmPurchaseCost * 0.9)]).choices,
            correct: mc(rmPurchaseCost, [rmPurchaseLbs, Math.round(rmPurchaseCost * 1.1), Math.round(rmPurchaseCost * 0.9)]).correct,
            exp: fmtN(rmPurchaseLbs) + " lbs × " + fmt(costPerLb) + " = " + fmt(rmPurchaseCost),
            result: "RM cost = " + fmt(rmPurchaseCost),
            formula: "RM Purchase Cost = Pounds × Cost per Pound",
            numbers: "Lbs to purchase = " + fmtN(rmPurchaseLbs) + ", Cost/lb = " + fmt(costPerLb)
          }]
        },
        {
          title: "Q7 — Cash disbursements for raw materials",
          steps: [
            {
              inst: "How much of current month's purchases are paid this month?",
              choices: mc(Math.round(rmPayPct / 100 * rmPurchaseCost), [Math.round((100 - rmPayPct) / 100 * rmPurchaseCost), Math.round(rmPurchaseCost), Math.round(rmPayPct / 100 * priorRmCost)]).choices,
              correct: mc(Math.round(rmPayPct / 100 * rmPurchaseCost), [Math.round((100 - rmPayPct) / 100 * rmPurchaseCost), Math.round(rmPurchaseCost), Math.round(rmPayPct / 100 * priorRmCost)]).correct,
              exp: rmPayPct + "% × " + fmt(rmPurchaseCost) + " = " + fmt(Math.round(rmPayPct / 100 * rmPurchaseCost)),
              result: rmPayPct + "% of current = " + fmt(Math.round(rmPayPct / 100 * rmPurchaseCost)),
              formula: "Pay " + rmPayPct + "% of current month purchases this month",
              numbers: "Current month purchases = " + fmt(rmPurchaseCost)
            },
            {
              inst: "How much of prior month's purchases are paid this month? (Prior purchases = " + fmt(priorRmCost) + ")",
              choices: mc(Math.round((100 - rmPayPct) / 100 * priorRmCost), [Math.round(rmPayPct / 100 * priorRmCost), Math.round(priorRmCost), Math.round((100 - rmPayPct) / 100 * rmPurchaseCost)]).choices,
              correct: mc(Math.round((100 - rmPayPct) / 100 * priorRmCost), [Math.round(rmPayPct / 100 * priorRmCost), Math.round(priorRmCost), Math.round((100 - rmPayPct) / 100 * rmPurchaseCost)]).correct,
              exp: (100 - rmPayPct) + "% × " + fmt(priorRmCost) + " = " + fmt(Math.round((100 - rmPayPct) / 100 * priorRmCost)),
              result: (100 - rmPayPct) + "% of prior = " + fmt(Math.round((100 - rmPayPct) / 100 * priorRmCost)),
              formula: "Pay " + (100 - rmPayPct) + "% of prior month purchases this month",
              numbers: "Prior month purchases = " + fmt(priorRmCost) + " (given)"
            },
            {
              inst: "What are the total cash disbursements for raw materials?",
              choices: mc(cashDisb, [Math.round(cashDisb * 0.9), Math.round(cashDisb * 1.1), Math.round(rmPurchaseCost)]).choices,
              correct: mc(cashDisb, [Math.round(cashDisb * 0.9), Math.round(cashDisb * 1.1), Math.round(rmPurchaseCost)]).correct,
              exp: fmt(Math.round(rmPayPct / 100 * rmPurchaseCost)) + " + " + fmt(Math.round((100 - rmPayPct) / 100 * priorRmCost)) + " = " + fmt(cashDisb),
              result: "Total disbursements = " + fmt(cashDisb),
              formula: "Total = current month paid + prior month paid",
              numbers: fmt(Math.round(rmPayPct / 100 * rmPurchaseCost)) + " + " + fmt(Math.round((100 - rmPayPct) / 100 * priorRmCost))
            }
          ]
        },
        {
          title: "Q8 — Accounts payable at end of month",
          steps: [{
            inst: "How much of current month's purchases remain unpaid at month-end?",
            choices: mc(ap, [Math.round(rmPurchaseCost), Math.round(rmPayPct / 100 * rmPurchaseCost), Math.round(priorRmCost)]).choices,
            correct: mc(ap, [Math.round(rmPurchaseCost), Math.round(rmPayPct / 100 * rmPurchaseCost), Math.round(priorRmCost)]).correct,
            exp: (100 - rmPayPct) + "% × " + fmt(rmPurchaseCost) + " = " + fmt(ap),
            result: "AP balance = " + fmt(ap),
            formula: "AP = " + (100 - rmPayPct) + "% × current month purchases",
            numbers: "Current month purchases = " + fmt(rmPurchaseCost)
          }]
        },
        {
          title: "Q9 — Raw materials inventory at end of month",
          steps: [{
            inst: "What is the dollar value of the ending raw materials inventory?",
            choices: mc(rmInventory, [endRM, Math.round(rmInventory * 1.1), Math.round(beginRM * costPerLb)]).choices,
            correct: mc(rmInventory, [endRM, Math.round(rmInventory * 1.1), Math.round(beginRM * costPerLb)]).correct,
            exp: fmtN(endRM) + " lbs × " + fmt(costPerLb) + "/lb = " + fmt(rmInventory),
            result: "RM inventory = " + fmt(rmInventory),
            formula: "RM Inventory = Ending RM lbs × Cost per Pound",
            numbers: "Ending RM = " + fmtN(endRM) + " lbs, Cost/lb = " + fmt(costPerLb)
          }]
        },
        {
          title: "Q10 — Total direct labor cost",
          steps: [{
            inst: "What is the total direct labor cost for current month production?",
            choices: mc(dlCost, [production * dlRate, Math.round(dlCost * 1.1), Math.round(dlCost * 0.9)]).choices,
            correct: mc(dlCost, [production * dlRate, Math.round(dlCost * 1.1), Math.round(dlCost * 0.9)]).correct,
            exp: fmtN(production) + " units × " + dlHours + " hr" + (dlHours > 1 ? "s" : "") + " × " + fmt(dlRate) + " = " + fmt(dlCost),
            result: "DL cost = " + fmt(dlCost),
            formula: "DL Cost = Production × Hours per Unit × Wage Rate",
            numbers: "Production = " + fmtN(production) + ", Hours/unit = " + dlHours + ", Rate = " + fmt(dlRate) + "/hr"
          }]
        },
        {
          title: "Q11 — Unit product cost",
          steps: [
            {
              inst: "What is the direct materials cost per unit?",
              choices: mc(dmUnit, [lbsPerUnit, costPerLb, dmUnit + 1]).choices,
              correct: mc(dmUnit, [lbsPerUnit, costPerLb, dmUnit + 1]).correct,
              exp: lbsPerUnit + " lbs × " + fmt(costPerLb) + "/lb = " + fmt(dmUnit),
              result: "DM = " + fmt(dmUnit) + "/unit",
              formula: "DM per unit = lbs per unit × cost per lb",
              numbers: "Lbs/unit = " + lbsPerUnit + ", Cost/lb = " + fmt(costPerLb)
            },
            {
              inst: "What is the direct labor cost per unit?",
              choices: mc(dlUnit, [dlHours, dlRate, dlUnit + 2]).choices,
              correct: mc(dlUnit, [dlHours, dlRate, dlUnit + 2]).correct,
              exp: dlHours + " hr" + (dlHours > 1 ? "s" : "") + " × " + fmt(dlRate) + "/hr = " + fmt(dlUnit),
              result: "DL = " + fmt(dlUnit) + "/unit",
              formula: "DL per unit = Hours per unit × Wage rate",
              numbers: "Hours/unit = " + dlHours + ", Rate = " + fmt(dlRate) + "/hr"
            },
            {
              inst: "What is the variable manufacturing overhead per unit?",
              choices: mc(vmohUnit, [varMOH, dlHours, vmohUnit + dlHours]).choices,
              correct: mc(vmohUnit, [varMOH, dlHours, vmohUnit + dlHours]).correct,
              exp: dlHours + " DL-hr" + (dlHours > 1 ? "s" : "") + " × " + fmt(varMOH) + "/hr = " + fmt(vmohUnit),
              result: "Var MOH = " + fmt(vmohUnit) + "/unit",
              formula: "Var MOH per unit = DL hours per unit × Variable MOH rate",
              numbers: "DL hours/unit = " + dlHours + ", Var MOH rate = " + fmt(varMOH) + "/DL-hr"
            },
            {
              inst: "What is the total unit product cost?",
              choices: mc(unitCost, [dmUnit + dlUnit, unitCost + vmohUnit, unitCost - dlUnit]).choices,
              correct: mc(unitCost, [dmUnit + dlUnit, unitCost + vmohUnit, unitCost - dlUnit]).correct,
              exp: fmt(dmUnit) + " + " + fmt(dlUnit) + " + " + fmt(vmohUnit) + " = " + fmt(unitCost) + "/unit",
              result: "Unit cost = " + fmt(unitCost),
              formula: "Unit Product Cost = DM + DL + Variable MOH",
              numbers: "DM = " + fmt(dmUnit) + ", DL = " + fmt(dlUnit) + ", Var MOH = " + fmt(vmohUnit)
            }
          ]
        },
        {
          title: "Q12 — Ending finished goods inventory value",
          steps: [{
            inst: "What is the dollar value of the ending finished goods inventory?",
            choices: mc(endFGValue, [endFG * price, Math.round(endFGValue * 1.1), Math.round(production * unitCost)]).choices,
            correct: mc(endFGValue, [endFG * price, Math.round(endFGValue * 1.1), Math.round(production * unitCost)]).correct,
            exp: fmtN(endFG) + " units × " + fmt(unitCost) + "/unit = " + fmt(endFGValue),
            result: "Ending FG = " + fmt(endFGValue),
            formula: "Ending FG Value = Ending FG Units × Unit Product Cost",
            numbers: "Ending FG units = " + fmtN(endFG) + ", Unit cost = " + fmt(unitCost)
          }]
        },
        {
          title: "Q13 — COGS and gross margin",
          steps: [
            {
              inst: "What is the cost of goods sold for the current month?",
              choices: mc(cogs, [Math.round(production * unitCost), Math.round(cogs * 1.1), Math.round(cogs * 0.9)]).choices,
              correct: mc(cogs, [Math.round(production * unitCost), Math.round(cogs * 1.1), Math.round(cogs * 0.9)]).correct,
              exp: fmtN(units[1]) + " units sold × " + fmt(unitCost) + "/unit = " + fmt(cogs),
              result: "COGS = " + fmt(cogs),
              formula: "COGS = Units Sold × Unit Product Cost",
              numbers: "Units sold = " + fmtN(units[1]) + ", Unit cost = " + fmt(unitCost)
            },
            {
              inst: "What is the gross margin for the current month?",
              choices: mc(grossMargin, [Math.round(grossMargin * 0.9), Math.round(grossMargin + fixedSA), Math.round(grossMargin - varSA * units[1])]).choices,
              correct: mc(grossMargin, [Math.round(grossMargin * 0.9), Math.round(grossMargin + fixedSA), Math.round(grossMargin - varSA * units[1])]).correct,
              exp: fmt(sales2) + " − " + fmt(cogs) + " = " + fmt(grossMargin),
              result: "Gross margin = " + fmt(grossMargin),
              formula: "Gross Margin = Sales − COGS",
              numbers: "Sales = " + fmt(sales2) + ", COGS = " + fmt(cogs)
            }
          ]
        },
        {
          title: "Q14 — Total selling and administrative expense",
          steps: [{
            inst: "What is the total S&A expense for the current month?",
            choices: mc(sa, [varSA * units[1], fixedSA, Math.round(sa + fixedSA)]).choices,
            correct: mc(sa, [varSA * units[1], fixedSA, Math.round(sa + fixedSA)]).correct,
            exp: "(" + fmt(varSA) + " × " + fmtN(units[1]) + " units) + " + fmt(fixedSA) + " = " + fmt(sa),
            result: "S&A = " + fmt(sa),
            formula: "S&A = (Variable rate × Units Sold) + Fixed S&A",
            numbers: "Var rate = " + fmt(varSA) + "/unit, Units sold = " + fmtN(units[1]) + ", Fixed = " + fmt(fixedSA)
          }]
        },
        {
          title: "Q15 — Net operating income",
          steps: [{
            inst: "What is the net operating income for the current month?",
            choices: mc(noi, [grossMargin, Math.round(noi + sa), Math.round(noi - fixedSA)]).choices,
            correct: mc(noi, [grossMargin, Math.round(noi + sa), Math.round(noi - fixedSA)]).correct,
            exp: fmt(grossMargin) + " − " + fmt(sa) + " = " + fmt(noi),
            result: "NOI = " + fmt(noi),
            formula: "NOI = Gross Margin − S&A Expense",
            numbers: "Gross margin = " + fmt(grossMargin) + ", S&A = " + fmt(sa)
          }]
        }
      ]
    };
  }
};
