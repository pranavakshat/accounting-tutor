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

    // Precompute Q3-Q14 IIFE results to avoid double-call shuffle bug
    var q3 = (function() {
      var pool = [beq, beq - 500, beq + 500, Math.round(fixedCosts / price)].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
      while (pool.length < 4) pool.push(beq + pool.length * 200);
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var ci = s.indexOf(beq);
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtN(v) + ' units'; }), correct: ci };
    })();
    var q4 = (function() {
      var pool = [bepSales, bepSales * 0.8, bepSales * 1.25, fixedCosts].map(Math.round).filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
      while (pool.length < 4) pool.push(Math.round(bepSales * (1 + pool.length * 0.15)));
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var ci = s.map(Math.round).indexOf(Math.round(bepSales));
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmt(v); }), correct: ci };
    })();
    var q5 = (function() {
      var pool = [targetUnits, beq, targetUnits + 500, targetUnits - 500].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
      while (pool.length < 4) pool.push(targetUnits + pool.length * 300);
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var ci = s.indexOf(targetUnits);
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtN(v) + ' units'; }), correct: ci };
    })();
    var q6 = (function() {
      var pool = [mosSales, actualSales, fixedCosts, targetProfit].map(Math.round).filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
      while (pool.length < 4) pool.push(Math.round(mosSales * (1 + pool.length * 0.2)));
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var ci = s.map(Math.round).indexOf(Math.round(mosSales));
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmt(v); }), correct: ci };
    })();
    var q7 = (function() {
      var mosPct = Math.round((mosSales / actualSales) * 100);
      var pool = [mosPct, Math.round(mosPct * 0.75), Math.round(mosPct * 1.25), 100 - mosPct].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
      while(pool.length<4) pool.push(mosPct + pool.length*5);
      var s = pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return { choices: s.map(function(v,i){return ['A','B','C','D'][i]+'. '+v+'%';}), correct: s.indexOf(mosPct) };
    })();
    var q8 = (function() {
      var totalCM = Math.round(actualSales * (cm/price));
      var noi = totalCM - fixedCosts;
      if(noi <= 0) noi = totalCM * 0.4;
      var dol = Math.round(totalCM / noi * 10) / 10;
      var pool = [dol, Math.round(dol*1.3*10)/10, Math.round(dol*0.7*10)/10, Math.round(dol*1.6*10)/10].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
      while(pool.length<4) pool.push(dol + pool.length*0.5);
      var s = pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return { choices: s.map(function(v,i){return ['A','B','C','D'][i]+'. '+v+'x';}), correct: s.indexOf(dol) };
    })();
    var q9 = (function() {
      var totalCM = Math.round(actualSales * (cm/price));
      var noi = totalCM - fixedCosts;
      var pool = [noi, totalCM, noi + fixedCosts/2, noi - fixedCosts/4].map(Math.round).filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,4);
      while(pool.length<4) pool.push(noi + pool.length * 5000);
      var s = pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return { choices: s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}), correct: s.map(Math.round).indexOf(Math.round(noi)) };
    })();
    var q10 = (function() {
      var noi = Math.max(Math.round(actualSales*(cm/price))-fixedCosts,1);
      var dol = Math.round(Math.round(actualSales*(cm/price))/noi*10)/10;
      var incr = Math.round(noi * dol * 0.10);
      var pool = [incr, Math.round(noi*0.10), Math.round(actualSales*0.10), Math.round(incr*1.5)].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
      while(pool.length<4) pool.push(incr + pool.length*2000);
      var s = pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return { choices: s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}), correct: s.indexOf(incr) };
    })();
    var q11 = (function() {
      var units = Math.round(actualSales/price);
      var tvc = units * varCost;
      var pool = [tvc, units*price, tvc+fixedCosts, Math.round(tvc*0.8)].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
      while(pool.length<4) pool.push(tvc + pool.length * 10000);
      var s = pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return { choices: s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}), correct: s.indexOf(tvc) };
    })();
    var q12 = (function() {
      var targetSales = Math.round((fixedCosts + targetProfit) / (cmRatioPct/100));
      var pool = [targetSales, Math.round(fixedCosts/(cmRatioPct/100)), Math.round(targetSales*1.2), Math.round(targetSales*0.8)].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
      while(pool.length<4) pool.push(targetSales + pool.length * 20000);
      var s = pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return { choices: s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}), correct: s.indexOf(targetSales) };
    })();
    var q13 = (function() {
      var units = beq + Math.round(targetProfit/cm);
      var tcm = units * cm;
      var pool = [tcm, fixedCosts, tcm+fixedCosts, Math.round(tcm*0.8)].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
      while(pool.length<4) pool.push(tcm + pool.length*5000);
      var s = pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return { choices: s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}), correct: s.indexOf(tcm) };
    })();
    var q14 = (function() {
      var vcr = Math.round((varCost/price)*100);
      var pool = [vcr, cmRatioPct, 100-cmRatioPct+5, Math.round(vcr*0.8)].filter(function(v,i,a){return a.indexOf(v)===i&&v>0&&v<=100;}).slice(0,4);
      while(pool.length<4) pool.push(vcr + pool.length*5);
      var s = pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return { choices: s.map(function(v,i){return ['A','B','C','D'][i]+'. '+v+'%';}), correct: s.indexOf(vcr) };
    })();

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
            choices: q3.choices,
            correct: q3.correct,
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
            choices: q4.choices,
            correct: q4.correct,
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
            choices: q5.choices,
            correct: q5.correct,
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
            choices: q6.choices,
            correct: q6.correct,
            exp: fmt(actualSales) + " − " + fmt(bepSales) + " = " + fmt(mosSales),
            result: "Margin of safety = " + fmt(mosSales),
            formula: "Margin of Safety = Actual Sales − Break-Even Sales",
            numbers: "Actual sales = " + fmt(actualSales) + ", Break-even sales = " + fmt(bepSales)
          }]
        },
        {
          title: "Q7 — Margin of Safety Percentage",
          steps: [{
            inst: "Actual sales are " + fmt(actualSales) + " and break-even sales are " + fmt(bepSales) + ". What is the margin of safety as a percentage of actual sales?",
            choices: q7.choices,
            correct: q7.correct,
            exp: fmt(mosSales) + " ÷ " + fmt(actualSales) + " = " + Math.round((mosSales/actualSales)*100) + "%",
            result: "MOS% = " + Math.round((mosSales/actualSales)*100) + "%",
            formula: "MOS% = Margin of Safety ÷ Actual Sales",
            numbers: "MOS = " + fmt(mosSales) + ", Actual sales = " + fmt(actualSales)
          }]
        },
        {
          title: "Q8 — Degree of Operating Leverage",
          steps: [{
            inst: "Contribution margin is " + fmt(actualSales * (cm/price)) + " and net operating income is " + fmt(actualSales * (cm/price) - fixedCosts) + ". What is the degree of operating leverage?",
            choices: q8.choices,
            correct: q8.correct,
            exp: "DOL = Total CM ÷ Net Operating Income = " + fmt(Math.round(actualSales*(cm/price))) + " ÷ " + fmt(Math.max(Math.round(actualSales*(cm/price))-fixedCosts,1)),
            result: "DOL = " + (Math.round(Math.round(actualSales*(cm/price)) / Math.max(Math.round(actualSales*(cm/price))-fixedCosts,1) * 10)/10) + "x",
            formula: "DOL = Contribution Margin ÷ Net Operating Income",
            numbers: "CM = " + fmt(Math.round(actualSales*(cm/price))) + ", NOI = " + fmt(Math.max(Math.round(actualSales*(cm/price))-fixedCosts,1))
          }]
        },
        {
          title: "Q9 — Net Operating Income",
          steps: [{
            inst: "Sales are " + fmt(actualSales) + ", variable costs are " + Math.round((1-(cm/price))*100) + "% of sales, and fixed costs are " + fmt(fixedCosts) + ". What is net operating income?",
            choices: q9.choices,
            correct: q9.correct,
            exp: fmt(actualSales) + " × " + Math.round((cm/price)*100) + "% CM ratio = " + fmt(Math.round(actualSales*(cm/price))) + " CM − " + fmt(fixedCosts) + " fixed = " + fmt(Math.round(actualSales*(cm/price))-fixedCosts),
            result: "NOI = " + fmt(Math.round(actualSales*(cm/price))-fixedCosts),
            formula: "NOI = Total CM − Fixed Costs",
            numbers: "CM ratio = " + Math.round((cm/price)*100) + "%, Sales = " + fmt(actualSales) + ", Fixed costs = " + fmt(fixedCosts)
          }]
        },
        {
          title: "Q10 — Effect of Sales Increase on Income",
          steps: [{
            inst: "If sales increase by 10% from " + fmt(actualSales) + ", how much will net operating income increase? (Current NOI = " + fmt(Math.max(Math.round(actualSales*(cm/price))-fixedCosts,1)) + ", DOL = " + (Math.round(Math.round(actualSales*(cm/price))/Math.max(Math.round(actualSales*(cm/price))-fixedCosts,1)*10)/10) + "x)",
            choices: q10.choices,
            correct: q10.correct,
            exp: "10% sales increase × DOL = % increase in NOI. NOI increase = current NOI × DOL × 10%",
            result: "NOI increase = " + fmt(Math.round(Math.max(Math.round(actualSales*(cm/price))-fixedCosts,1) * (Math.round(Math.round(actualSales*(cm/price))/Math.max(Math.round(actualSales*(cm/price))-fixedCosts,1)*10)/10) * 0.10)),
            formula: "% Change in NOI = DOL × % Change in Sales",
            numbers: "DOL = " + (Math.round(Math.round(actualSales*(cm/price))/Math.max(Math.round(actualSales*(cm/price))-fixedCosts,1)*10)/10) + "x, Sales change = 10%"
          }]
        },
        {
          title: "Q11 — Total Variable Costs",
          steps: [{
            inst: "The company sells " + fmtN(Math.round(actualSales/price)) + " units at " + fmt(price) + " each. Variable cost per unit is " + fmt(varCost) + ". What are total variable costs?",
            choices: q11.choices,
            correct: q11.correct,
            exp: fmtN(Math.round(actualSales/price)) + " units × " + fmt(varCost) + " = " + fmt(Math.round(actualSales/price)*varCost),
            result: "Total variable costs = " + fmt(Math.round(actualSales/price)*varCost),
            formula: "Total Variable Costs = Units Sold × Variable Cost per Unit",
            numbers: "Units = " + fmtN(Math.round(actualSales/price)) + ", Var cost/unit = " + fmt(varCost)
          }]
        },
        {
          title: "Q12 — Sales Dollars to Earn Target Profit",
          steps: [{
            inst: "The company wants to earn " + fmt(targetProfit) + " in profit. Fixed costs are " + fmt(fixedCosts) + " and CM ratio is " + cmRatioPct + "%. What sales dollars are needed?",
            choices: q12.choices,
            correct: q12.correct,
            exp: "(" + fmt(fixedCosts) + " + " + fmt(targetProfit) + ") ÷ " + cmRatioPct + "% = " + fmt(Math.round((fixedCosts+targetProfit)/(cmRatioPct/100))),
            result: "Target sales $ = " + fmt(Math.round((fixedCosts+targetProfit)/(cmRatioPct/100))),
            formula: "Target Sales $ = (Fixed Costs + Target Profit) ÷ CM Ratio",
            numbers: "Fixed costs = " + fmt(fixedCosts) + ", Target profit = " + fmt(targetProfit) + ", CM ratio = " + cmRatioPct + "%"
          }]
        },
        {
          title: "Q13 — Total Contribution Margin",
          steps: [{
            inst: "The company sells " + fmtN(beq + Math.round(targetProfit/cm)) + " units at a CM of " + fmt(cm) + " per unit. What is the total contribution margin?",
            choices: q13.choices,
            correct: q13.correct,
            exp: fmtN(beq + Math.round(targetProfit/cm)) + " units × " + fmt(cm) + " = " + fmt((beq + Math.round(targetProfit/cm)) * cm),
            result: "Total CM = " + fmt((beq + Math.round(targetProfit/cm)) * cm),
            formula: "Total CM = Units Sold × CM per Unit",
            numbers: "Units = " + fmtN(beq + Math.round(targetProfit/cm)) + ", CM/unit = " + fmt(cm)
          }]
        },
        {
          title: "Q14 — Variable Cost Ratio",
          steps: [{
            inst: "Selling price is " + fmt(price) + " per unit and variable cost is " + fmt(varCost) + " per unit. What is the variable cost ratio?",
            choices: q14.choices,
            correct: q14.correct,
            exp: fmt(varCost) + " ÷ " + fmt(price) + " = " + Math.round((varCost/price)*100) + "%. Note: Variable Cost Ratio + CM Ratio = 100%",
            result: "Variable cost ratio = " + Math.round((varCost/price)*100) + "%",
            formula: "Variable Cost Ratio = Variable Cost ÷ Selling Price",
            numbers: "Variable cost = " + fmt(varCost) + ", Price = " + fmt(price)
          }]
        },
        {
          title: "Q15 — Which Method to Use",
          steps: [{
            inst: "The company knows total fixed costs are " + fmt(fixedCosts) + " and CM ratio is " + cmRatioPct + "%. Which formula finds break-even in sales dollars?",
            choices: [
              "A. Fixed Costs ÷ CM per Unit",
              "B. Fixed Costs ÷ CM Ratio",
              "C. Fixed Costs × CM Ratio",
              "D. CM Ratio ÷ Fixed Costs"
            ],
            correct: 1,
            exp: "When you know the CM ratio (not per-unit CM), use: Break-Even $ = Fixed Costs ÷ CM Ratio. This gives " + fmt(fixedCosts) + " ÷ " + cmRatioPct + "% = " + fmt(Math.round(fixedCosts/(cmRatioPct/100))),
            result: "B. Fixed Costs ÷ CM Ratio",
            formula: "Break-Even Sales $ = Fixed Costs ÷ CM Ratio",
            numbers: "Fixed costs = " + fmt(fixedCosts) + ", CM ratio = " + cmRatioPct + "%"
          }]
        }
      ]
    };
  }
};
