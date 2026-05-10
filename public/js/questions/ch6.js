window.CH6 = {
  title: "Chapter 6 — Cost-Volume-Profit Analysis",
  description: "Contribution margin, break-even analysis, target profit, and margin of safety",
  formulas: [
    "CM per unit = Selling Price − Variable Cost per Unit",
    "CM Ratio = CM per Unit ÷ Selling Price",
    "Break-Even Units = Fixed Costs ÷ CM per Unit",
    "Break-Even Sales $ = Fixed Costs ÷ CM Ratio",
    "Target Profit Units = (Fixed Costs + Target Profit) ÷ CM per Unit",
    "Margin of Safety = Actual Sales − Break-Even Sales"
  ],
  definitions: [
    { q: "What does the contribution margin represent?", choices: ["A. Profit after all expenses", "B. Revenue minus variable costs — the amount available to cover fixed costs", "C. Revenue minus fixed costs", "D. Total revenue minus COGS"], correct: 1, exp: "CM = Sales − Variable Costs. It contributes toward covering fixed costs, then generating profit." },
    { q: "When a company is at break-even, net operating income is:", choices: ["A. Equal to fixed costs", "B. Equal to contribution margin", "C. Zero", "D. Negative"], correct: 2, exp: "At break-even, total contribution margin exactly equals total fixed costs, leaving zero profit." },
    { q: "The margin of safety measures:", choices: ["A. How much fixed costs can increase before a loss occurs", "B. How far sales can fall before the company reaches break-even", "C. The ratio of variable to fixed costs", "D. Contribution margin as a % of sales"], correct: 1, exp: "Margin of safety = Actual sales − Break-even sales. It shows how much of a buffer exists above break-even." },
    { q: "If the CM ratio is 40%, what does that mean?", choices: ["A. 40% of each sales dollar goes to variable costs", "B. Fixed costs are 40% of sales", "C. 40 cents of every sales dollar contributes to covering fixed costs and profit", "D. The break-even point is at 40% capacity"], correct: 2, exp: "CM Ratio = CM ÷ Sales. A 40% CM ratio means $0.40 of every $1 in sales is available to cover fixed costs and profit." }
  ],
  generate: function() {
    var prices = [40, 45, 50, 55, 60, 65, 70, 75, 80, 90, 100];
    var varPcts = [0.40, 0.44, 0.48, 0.50, 0.55, 0.60];

    var price = prices[Math.floor(Math.random() * prices.length)];
    var varPct = varPcts[Math.floor(Math.random() * varPcts.length)];
    var varCost = Math.round(price * varPct);
    var cm = price - varCost;

    var beqOptions = [1000, 1500, 2000, 2500, 3000, 4000, 5000];
    var beq = beqOptions[Math.floor(Math.random() * beqOptions.length)];
    var fixedCosts = beq * cm;

    var tpMultiples = [500, 1000, 1500, 2000, 2500];
    var tpExtra = tpMultiples[Math.floor(Math.random() * tpMultiples.length)];
    var targetProfit = tpExtra * cm;
    var targetUnits = beq + tpExtra;

    var actualMultiplier = [1.2, 1.3, 1.4, 1.5, 1.6][Math.floor(Math.random() * 5)];
    var bepSales = fixedCosts / (cm / price);
    var actualSales = Math.round(bepSales * actualMultiplier / 1000) * 1000;
    var mosSales = actualSales - bepSales;

    var fmt = function(n) { return '$' + Math.round(n).toLocaleString(); };
    var fmtN = function(n) { return Math.round(n).toLocaleString(); };

    function makeChoices(correct, wrongs) {
      var pool = [correct].concat(wrongs.filter(function(w) { return w !== correct && w > 0; }).slice(0, 3));
      while (pool.length < 4) pool.push(correct + pool.length * cm);
      var shuffled = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var idx = shuffled.indexOf(correct);
      var letters = ['A', 'B', 'C', 'D'];
      return { choices: shuffled.map(function(v, i) { return letters[i] + '. ' + fmt(v); }), correct: idx };
    }

    var q1 = makeChoices(cm, [price, varCost, price + varCost]);
    var cmRatioPct = Math.round((cm / price) * 100);

    // Q2 choices as percentage strings
    var q2pool = [cmRatioPct, Math.round(varPct * 100), 100 - cmRatioPct, 50].filter(function(v, i, arr) { return arr.indexOf(v) === i; });
    while (q2pool.length < 4) q2pool.push(cmRatioPct + q2pool.length);
    var q2shuffled = q2pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
    var q2correct = q2shuffled.indexOf(cmRatioPct);
    var q2 = { choices: q2shuffled.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + v + '%'; }), correct: q2correct };

    return {
      data: { price: price, varCost: varCost, fixedCosts: fixedCosts, targetProfit: targetProfit, actualSales: actualSales, cm: cm, beq: beq },
      dataTable: [
        ["Selling price per unit", fmt(price)],
        ["Variable cost per unit", fmt(varCost)],
        ["Total fixed costs", fmt(fixedCosts)],
        ["Target profit", fmt(targetProfit)],
        ["Actual sales", fmt(actualSales)]
      ],
      questions: [
        {
          title: "Q1 — Contribution Margin per Unit",
          steps: [{
            inst: "The company sells a product for " + fmt(price) + " per unit. Variable costs are " + fmt(varCost) + " per unit. What is the contribution margin per unit?",
            choices: q1.choices,
            correct: q1.correct,
            exp: fmt(price) + " − " + fmt(varCost) + " = " + fmt(cm) + " per unit",
            result: "CM per unit = " + fmt(cm),
            formula: "CM per unit = Selling Price − Variable Cost per Unit",
            numbers: "Selling price = " + fmt(price) + ", Variable cost = " + fmt(varCost)
          }]
        },
        {
          title: "Q2 — Contribution Margin Ratio",
          steps: [{
            inst: "The contribution margin per unit is " + fmt(cm) + " and the selling price is " + fmt(price) + ". What is the contribution margin ratio?",
            choices: q2.choices,
            correct: q2.correct,
            exp: fmt(cm) + " ÷ " + fmt(price) + " = " + cmRatioPct + "%",
            result: "CM Ratio = " + cmRatioPct + "%",
            formula: "CM Ratio = CM per Unit ÷ Selling Price",
            numbers: "CM per unit = " + fmt(cm) + ", Selling price = " + fmt(price)
          }]
        },
        {
          title: "Q3 — Break-Even Point (Units)",
          steps: [{
            inst: "Fixed costs are " + fmt(fixedCosts) + " and the contribution margin per unit is " + fmt(cm) + ". How many units must be sold to break even?",
            choices: (function() {
              var pool = [beq, beq - 500, beq + 500, Math.round(fixedCosts / price)].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
              while (pool.length < 4) pool.push(beq + pool.length * 200);
              var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
              var ci = s.indexOf(beq);
              return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtN(v) + ' units'; }), correct: ci };
            })().choices,
            correct: (function() {
              var pool = [beq, beq - 500, beq + 500, Math.round(fixedCosts / price)].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
              while (pool.length < 4) pool.push(beq + pool.length * 200);
              var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
              return s.indexOf(beq);
            })(),
            exp: fmt(fixedCosts) + " ÷ " + fmt(cm) + " = " + fmtN(beq) + " units",
            result: "Break-even = " + fmtN(beq) + " units",
            formula: "Break-Even Units = Fixed Costs ÷ CM per Unit",
            numbers: "Fixed costs = " + fmt(fixedCosts) + ", CM per unit = " + fmt(cm)
          }]
        },
        {
          title: "Q4 — Break-Even Point (Sales Dollars)",
          steps: [{
            inst: "Fixed costs are " + fmt(fixedCosts) + " and the CM ratio is " + cmRatioPct + "%. What is the break-even point in sales dollars?",
            choices: (function() {
              var pool = [bepSales, bepSales * 0.8, bepSales * 1.25, fixedCosts].map(Math.round).filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
              while (pool.length < 4) pool.push(Math.round(bepSales * (1 + pool.length * 0.15)));
              var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
              var ci = s.map(Math.round).indexOf(Math.round(bepSales));
              return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmt(v); }), correct: ci };
            })().choices,
            correct: (function() {
              var pool = [bepSales, bepSales * 0.8, bepSales * 1.25, fixedCosts].map(Math.round).filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
              while (pool.length < 4) pool.push(Math.round(bepSales * (1 + pool.length * 0.15)));
              var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
              return s.map(Math.round).indexOf(Math.round(bepSales));
            })(),
            exp: fmt(fixedCosts) + " ÷ " + cmRatioPct + "% = " + fmt(bepSales),
            result: "Break-even sales = " + fmt(bepSales),
            formula: "Break-Even Sales $ = Fixed Costs ÷ CM Ratio",
            numbers: "Fixed costs = " + fmt(fixedCosts) + ", CM ratio = " + cmRatioPct + "%"
          }]
        },
        {
          title: "Q5 — Units Needed to Hit Target Profit",
          steps: [{
            inst: "The company wants to earn a profit of " + fmt(targetProfit) + ". Fixed costs are " + fmt(fixedCosts) + " and CM per unit is " + fmt(cm) + ". How many units must be sold?",
            choices: (function() {
              var pool = [targetUnits, beq, targetUnits + 500, targetUnits - 500].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
              while (pool.length < 4) pool.push(targetUnits + pool.length * 300);
              var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
              var ci = s.indexOf(targetUnits);
              return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtN(v) + ' units'; }), correct: ci };
            })().choices,
            correct: (function() {
              var pool = [targetUnits, beq, targetUnits + 500, targetUnits - 500].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
              while (pool.length < 4) pool.push(targetUnits + pool.length * 300);
              var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
              return s.indexOf(targetUnits);
            })(),
            exp: "(" + fmt(fixedCosts) + " + " + fmt(targetProfit) + ") ÷ " + fmt(cm) + " = " + fmtN(targetUnits) + " units",
            result: "Target profit units = " + fmtN(targetUnits),
            formula: "Target Profit Units = (Fixed Costs + Target Profit) ÷ CM per Unit",
            numbers: "Fixed costs = " + fmt(fixedCosts) + ", Target profit = " + fmt(targetProfit) + ", CM per unit = " + fmt(cm)
          }]
        },
        {
          title: "Q6 — Margin of Safety",
          steps: [{
            inst: "Actual sales are " + fmt(actualSales) + ". The break-even point in sales dollars is " + fmt(bepSales) + ". What is the margin of safety?",
            choices: (function() {
              var pool = [mosSales, actualSales, fixedCosts, targetProfit].map(Math.round).filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
              while (pool.length < 4) pool.push(Math.round(mosSales * (1 + pool.length * 0.2)));
              var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
              var ci = s.map(Math.round).indexOf(Math.round(mosSales));
              return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmt(v); }), correct: ci };
            })().choices,
            correct: (function() {
              var pool = [mosSales, actualSales, fixedCosts, targetProfit].map(Math.round).filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
              while (pool.length < 4) pool.push(Math.round(mosSales * (1 + pool.length * 0.2)));
              var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
              return s.map(Math.round).indexOf(Math.round(mosSales));
            })(),
            exp: fmt(actualSales) + " − " + fmt(bepSales) + " = " + fmt(mosSales),
            result: "Margin of safety = " + fmt(mosSales),
            formula: "Margin of Safety = Actual Sales − Break-Even Sales",
            numbers: "Actual sales = " + fmt(actualSales) + ", Break-even sales = " + fmt(bepSales)
          }]
        }
      ]
    };
  }
};
