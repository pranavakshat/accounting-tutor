window.CH7 = {
  title: "Chapter 7 — Variable vs. Absorption Costing",
  description: "Unit product cost, income differences, and costing method comparison",
  formulas: [
    "Variable Costing Unit Cost = DM + DL + Variable MOH (NO fixed MOH)",
    "Absorption Costing Unit Cost = DM + DL + Variable MOH + (Fixed MOH ÷ Units Produced)",
    "Income Difference = Unsold Units × Fixed MOH per Unit",
    "When Production > Sales: Absorption income is HIGHER",
    "When Production < Sales: Variable costing income is HIGHER"
  ],
  definitions: [
    { q: "Under variable costing, fixed manufacturing overhead is treated as:", choices: ["A. A product cost included in unit cost", "B. A period cost expensed immediately", "C. An asset on the balance sheet", "D. Part of cost of goods sold only"], correct: 1, exp: "Under variable costing, fixed MOH is a period cost — expensed in full in the period incurred, regardless of how many units are sold." },
    { q: "When production equals sales, absorption costing income compared to variable costing income is:", choices: ["A. Always higher", "B. Always lower", "C. The same", "D. Cannot be determined"], correct: 2, exp: "When all units produced are sold, there is no ending inventory to defer fixed costs into. Both methods expense the same total fixed MOH." }
  ],
  generate: function() {
    var dmOptions = [10, 12, 14, 15, 18, 20, 22, 25];
    var dlOptions = [6, 8, 9, 10, 12, 14, 15];
    var vmohOptions = [2, 3, 4, 5, 6];
    var prodOptions = [8000, 10000, 12000, 15000, 20000, 25000, 30000];
    var soldPctOptions = [0.70, 0.75, 0.80, 0.85];

    var dm = dmOptions[Math.floor(Math.random() * dmOptions.length)];
    var dl = dlOptions[Math.floor(Math.random() * dlOptions.length)];
    var vmoh = vmohOptions[Math.floor(Math.random() * vmohOptions.length)];
    var produced = prodOptions[Math.floor(Math.random() * prodOptions.length)];
    var soldPct = soldPctOptions[Math.floor(Math.random() * soldPctOptions.length)];
    var sold = Math.round(produced * soldPct / 1000) * 1000;
    var unsold = produced - sold;

    var fmohPerUnitOptions = [4, 5, 6, 8, 10, 12];
    var fmohPerUnit = fmohPerUnitOptions[Math.floor(Math.random() * fmohPerUnitOptions.length)];
    var fixedMOH = produced * fmohPerUnit;

    var varUnitCost = dm + dl + vmoh;
    var absUnitCost = varUnitCost + fmohPerUnit;
    var incomeDiff = unsold * fmohPerUnit;

    var fmt = function(n) { return '$' + n.toLocaleString(); };

    function mc(correct, wrongs) {
      var pool = [correct].concat(wrongs.filter(function(w) { return w !== correct && w > 0; })).slice(0, 4);
      while (pool.length < 4) pool.push(correct + pool.length);
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var letters = ['A', 'B', 'C', 'D'];
      return { choices: s.map(function(v, i) { return letters[i] + '. ' + fmt(v); }), correct: s.indexOf(correct) };
    }

    return {
      data: { dm: dm, dl: dl, vmoh: vmoh, fixedMOH: fixedMOH, produced: produced, sold: sold },
      dataTable: [
        ["Direct materials", fmt(dm) + " per unit"],
        ["Direct labor", fmt(dl) + " per unit"],
        ["Variable MOH", fmt(vmoh) + " per unit"],
        ["Fixed MOH (total)", fmt(fixedMOH)],
        ["Units produced", produced.toLocaleString()],
        ["Units sold", sold.toLocaleString()]
      ],
      questions: [
        {
          title: "Q1 — Unit Product Cost (Variable Costing)",
          steps: [{
            inst: "A company has the costs shown in the data table. What is the unit product cost under variable costing?",
            choices: mc(varUnitCost, [dm + dl, absUnitCost, dm + vmoh]).choices,
            correct: mc(varUnitCost, [dm + dl, absUnitCost, dm + vmoh]).correct,
            exp: fmt(dm) + " + " + fmt(dl) + " + " + fmt(vmoh) + " = " + fmt(varUnitCost) + " per unit. Fixed MOH is excluded.",
            result: "Variable unit cost = " + fmt(varUnitCost),
            formula: "Variable Costing Unit Cost = DM + DL + Variable MOH (exclude fixed MOH)",
            numbers: "DM = " + fmt(dm) + ", DL = " + fmt(dl) + ", Variable MOH = " + fmt(vmoh)
          }]
        },
        {
          title: "Q2 — Fixed MOH per Unit",
          steps: [{
            inst: "Total fixed manufacturing overhead is " + fmt(fixedMOH) + " and " + produced.toLocaleString() + " units were produced. What is the fixed MOH per unit?",
            choices: mc(fmohPerUnit, [fmohPerUnit + 2, fmohPerUnit - 2, Math.round(fixedMOH / sold)]).choices,
            correct: mc(fmohPerUnit, [fmohPerUnit + 2, fmohPerUnit - 2, Math.round(fixedMOH / sold)]).correct,
            exp: fmt(fixedMOH) + " ÷ " + produced.toLocaleString() + " = " + fmt(fmohPerUnit) + " per unit",
            result: "Fixed MOH per unit = " + fmt(fmohPerUnit),
            formula: "Fixed MOH per unit = Total Fixed MOH ÷ Units Produced",
            numbers: "Total fixed MOH = " + fmt(fixedMOH) + ", Units produced = " + produced.toLocaleString()
          }]
        },
        {
          title: "Q3 — Unit Product Cost (Absorption Costing)",
          steps: [{
            inst: "Variable unit cost is " + fmt(varUnitCost) + " and fixed MOH per unit is " + fmt(fmohPerUnit) + ". What is the unit product cost under absorption costing?",
            choices: mc(absUnitCost, [varUnitCost, absUnitCost + fmohPerUnit, absUnitCost - vmoh]).choices,
            correct: mc(absUnitCost, [varUnitCost, absUnitCost + fmohPerUnit, absUnitCost - vmoh]).correct,
            exp: fmt(varUnitCost) + " + " + fmt(fmohPerUnit) + " = " + fmt(absUnitCost) + " per unit",
            result: "Absorption unit cost = " + fmt(absUnitCost),
            formula: "Absorption Unit Cost = Variable Unit Cost + Fixed MOH per Unit",
            numbers: "Variable unit cost = " + fmt(varUnitCost) + ", Fixed MOH per unit = " + fmt(fmohPerUnit)
          }]
        },
        {
          title: "Q4 — Unsold Units",
          steps: [{
            inst: produced.toLocaleString() + " units were produced and " + sold.toLocaleString() + " units were sold. How many units are unsold?",
            choices: (function() {
              var pool = [unsold, produced, sold, unsold + 1000].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
              while (pool.length < 4) pool.push(unsold + pool.length * 500);
              var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
              var ci = s.indexOf(unsold);
              return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + v.toLocaleString() + ' units'; }), correct: ci };
            })().choices,
            correct: (function() {
              var pool = [unsold, produced, sold, unsold + 1000].filter(function(v, i, arr) { return arr.indexOf(v) === i && v > 0; }).slice(0, 4);
              while (pool.length < 4) pool.push(unsold + pool.length * 500);
              var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
              return s.indexOf(unsold);
            })(),
            exp: produced.toLocaleString() + " − " + sold.toLocaleString() + " = " + unsold.toLocaleString() + " units",
            result: "Unsold units = " + unsold.toLocaleString(),
            formula: "Unsold Units = Units Produced − Units Sold",
            numbers: "Units produced = " + produced.toLocaleString() + ", Units sold = " + sold.toLocaleString()
          }]
        },
        {
          title: "Q5 — Income Difference Between Methods",
          steps: [{
            inst: "There are " + unsold.toLocaleString() + " unsold units and fixed MOH per unit is " + fmt(fmohPerUnit) + ". By how much does absorption costing income exceed variable costing income?",
            choices: mc(incomeDiff, [fixedMOH, incomeDiff * 2, incomeDiff / 2]).choices,
            correct: mc(incomeDiff, [fixedMOH, incomeDiff * 2, incomeDiff / 2]).correct,
            exp: unsold.toLocaleString() + " unsold units × " + fmt(fmohPerUnit) + " fixed MOH per unit = " + fmt(incomeDiff),
            result: "Income difference = " + fmt(incomeDiff),
            formula: "Income Difference = Unsold Units × Fixed MOH per Unit",
            numbers: "Unsold units = " + unsold.toLocaleString() + ", Fixed MOH per unit = " + fmt(fmohPerUnit)
          }]
        },
        {
          title: "Q6 — Which Method Shows Higher Income?",
          steps: [{
            inst: "Production (" + produced.toLocaleString() + ") exceeds sales (" + sold.toLocaleString() + "). Which costing method reports higher net income?",
            choices: ["A. Variable costing", "B. Absorption costing", "C. They are always the same", "D. Cannot be determined"],
            correct: 1,
            exp: "When production > sales, units sit in ending inventory. Absorption costing defers fixed MOH in those unsold units, making absorption income higher by " + fmt(incomeDiff) + ".",
            result: "B. Absorption costing",
            formula: "Prod > Sales → Absorption income higher | Prod < Sales → Variable costing income higher",
            numbers: "Produced = " + produced.toLocaleString() + ", Sold = " + sold.toLocaleString()
          }]
        },
        {
          title: "Q7 — Variable Costing Income Statement: Sales",
          steps: [{
            inst: "The company sells " + sold.toLocaleString() + " units at " + fmt(varUnitCost + fmohPerUnit + 8) + " per unit. What is total sales revenue?",
            choices: (function() {
              var sp = varUnitCost + fmohPerUnit + 8;
              var rev = sold * sp;
              var pool = [rev, produced*sp, rev-fixedMOH, Math.round(rev*0.9)].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
              while(pool.length<4) pool.push(rev+pool.length*10000);
              var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
              return {choices:s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}),correct:s.indexOf(rev)};
            })().choices,
            correct: (function() {
              var sp = varUnitCost + fmohPerUnit + 8;
              var rev = sold * sp;
              var pool = [rev, produced*sp, rev-fixedMOH, Math.round(rev*0.9)].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
              while(pool.length<4) pool.push(rev+pool.length*10000);
              var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
              return s.indexOf(rev);
            })(),
            exp: sold.toLocaleString() + " units × " + fmt(varUnitCost+fmohPerUnit+8) + " = " + fmt(sold*(varUnitCost+fmohPerUnit+8)),
            result: "Sales = " + fmt(sold*(varUnitCost+fmohPerUnit+8)),
            formula: "Sales = Units Sold × Selling Price",
            numbers: "Units sold = " + sold.toLocaleString() + ", Price = " + fmt(varUnitCost+fmohPerUnit+8)
          }]
        },
        {
          title: "Q8 — Variable COGS",
          steps: [{
            inst: "Variable unit cost is " + fmt(varUnitCost) + " and " + sold.toLocaleString() + " units were sold. What is variable cost of goods sold?",
            choices: mc(sold * varUnitCost, [produced * varUnitCost, sold * absUnitCost, unsold * varUnitCost]).choices,
            correct: mc(sold * varUnitCost, [produced * varUnitCost, sold * absUnitCost, unsold * varUnitCost]).correct,
            exp: sold.toLocaleString() + " × " + fmt(varUnitCost) + " = " + fmt(sold*varUnitCost),
            result: "Variable COGS = " + fmt(sold*varUnitCost),
            formula: "Variable COGS = Units Sold × Variable Unit Cost",
            numbers: "Units sold = " + sold.toLocaleString() + ", Variable unit cost = " + fmt(varUnitCost)
          }]
        },
        {
          title: "Q9 — Variable Costing: Contribution Margin",
          steps: [{
            inst: "Sales are " + fmt(sold*(varUnitCost+fmohPerUnit+8)) + " and variable COGS is " + fmt(sold*varUnitCost) + ". What is the contribution margin?",
            choices: (function() {
              var sp = varUnitCost + fmohPerUnit + 8;
              var rev = sold * sp;
              var vcogs = sold * varUnitCost;
              var tcm = rev - vcogs;
              var pool = [tcm, rev, vcogs, tcm-fixedMOH].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
              while(pool.length<4) pool.push(tcm+pool.length*5000);
              var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
              return {choices:s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}),correct:s.indexOf(tcm)};
            })().choices,
            correct: (function() {
              var sp = varUnitCost + fmohPerUnit + 8;
              var rev = sold * sp;
              var vcogs = sold * varUnitCost;
              var tcm = rev - vcogs;
              var pool = [tcm, rev, vcogs, tcm-fixedMOH].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
              while(pool.length<4) pool.push(tcm+pool.length*5000);
              var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
              return s.indexOf(tcm);
            })(),
            exp: fmt(sold*(varUnitCost+fmohPerUnit+8)) + " − " + fmt(sold*varUnitCost) + " = " + fmt(sold*(varUnitCost+fmohPerUnit+8)-sold*varUnitCost),
            result: "Contribution margin = " + fmt(sold*(varUnitCost+fmohPerUnit+8)-sold*varUnitCost),
            formula: "CM = Sales − Variable Costs",
            numbers: "Sales = " + fmt(sold*(varUnitCost+fmohPerUnit+8)) + ", Variable COGS = " + fmt(sold*varUnitCost)
          }]
        },
        {
          title: "Q10 — Variable Costing Net Income",
          steps: [{
            inst: "Contribution margin is " + fmt(sold*(varUnitCost+fmohPerUnit+8)-sold*varUnitCost) + " and total fixed costs (MOH + selling/admin) are " + fmt(fixedMOH + sold*2) + ". What is net income under variable costing?",
            choices: (function() {
              var cm = sold*(varUnitCost+fmohPerUnit+8)-sold*varUnitCost;
              var fc = fixedMOH + sold*2;
              var ni = cm - fc;
              var pool = [ni, cm, ni+fixedMOH, Math.round(ni*0.7)].filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,4);
              while(pool.length<4) pool.push(ni+pool.length*5000);
              var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
              return {choices:s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}),correct:s.map(Math.round).indexOf(Math.round(ni))};
            })().choices,
            correct: (function() {
              var cm = sold*(varUnitCost+fmohPerUnit+8)-sold*varUnitCost;
              var fc = fixedMOH + sold*2;
              var ni = cm - fc;
              var pool = [ni, cm, ni+fixedMOH, Math.round(ni*0.7)].filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,4);
              while(pool.length<4) pool.push(ni+pool.length*5000);
              var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
              return s.map(Math.round).indexOf(Math.round(ni));
            })(),
            exp: fmt(sold*(varUnitCost+fmohPerUnit+8)-sold*varUnitCost) + " − " + fmt(fixedMOH+sold*2) + " = " + fmt(sold*(varUnitCost+fmohPerUnit+8)-sold*varUnitCost-fixedMOH-sold*2),
            result: "Variable costing NI = " + fmt(sold*(varUnitCost+fmohPerUnit+8)-sold*varUnitCost-fixedMOH-sold*2),
            formula: "Net Income (Variable) = CM − Total Fixed Costs",
            numbers: "CM = " + fmt(sold*(varUnitCost+fmohPerUnit+8)-sold*varUnitCost) + ", Fixed costs = " + fmt(fixedMOH+sold*2)
          }]
        },
        {
          title: "Q11 — Absorption Costing COGS",
          steps: [{
            inst: "Absorption unit cost is " + fmt(absUnitCost) + " and " + sold.toLocaleString() + " units were sold. What is absorption costing COGS?",
            choices: mc(sold*absUnitCost, [produced*absUnitCost, sold*varUnitCost, unsold*absUnitCost]).choices,
            correct: mc(sold*absUnitCost, [produced*absUnitCost, sold*varUnitCost, unsold*absUnitCost]).correct,
            exp: sold.toLocaleString() + " × " + fmt(absUnitCost) + " = " + fmt(sold*absUnitCost),
            result: "Absorption COGS = " + fmt(sold*absUnitCost),
            formula: "Absorption COGS = Units Sold × Absorption Unit Cost",
            numbers: "Units sold = " + sold.toLocaleString() + ", Absorption unit cost = " + fmt(absUnitCost)
          }]
        },
        {
          title: "Q12 — Ending Inventory (Variable Costing)",
          steps: [{
            inst: unsold.toLocaleString() + " units remain in ending inventory. Under variable costing, what is their value?",
            choices: mc(unsold*varUnitCost, [unsold*absUnitCost, produced*varUnitCost, unsold*fmohPerUnit]).choices,
            correct: mc(unsold*varUnitCost, [unsold*absUnitCost, produced*varUnitCost, unsold*fmohPerUnit]).correct,
            exp: unsold.toLocaleString() + " × " + fmt(varUnitCost) + " = " + fmt(unsold*varUnitCost) + ". Fixed MOH is NOT included under variable costing.",
            result: "Ending inventory (variable) = " + fmt(unsold*varUnitCost),
            formula: "Ending Inventory (Variable) = Unsold Units × Variable Unit Cost",
            numbers: "Unsold units = " + unsold.toLocaleString() + ", Variable unit cost = " + fmt(varUnitCost)
          }]
        },
        {
          title: "Q13 — Ending Inventory (Absorption Costing)",
          steps: [{
            inst: unsold.toLocaleString() + " units remain in ending inventory. Under absorption costing, what is their value?",
            choices: mc(unsold*absUnitCost, [unsold*varUnitCost, produced*absUnitCost, unsold*fmohPerUnit]).choices,
            correct: mc(unsold*absUnitCost, [unsold*varUnitCost, produced*absUnitCost, unsold*fmohPerUnit]).correct,
            exp: unsold.toLocaleString() + " × " + fmt(absUnitCost) + " = " + fmt(unsold*absUnitCost) + ". Absorption includes " + fmt(fmohPerUnit) + " fixed MOH per unit.",
            result: "Ending inventory (absorption) = " + fmt(unsold*absUnitCost),
            formula: "Ending Inventory (Absorption) = Unsold Units × Absorption Unit Cost",
            numbers: "Unsold units = " + unsold.toLocaleString() + ", Absorption unit cost = " + fmt(absUnitCost)
          }]
        },
        {
          title: "Q14 — Inventory Value Difference",
          steps: [{
            inst: "Ending inventory under absorption costing is " + fmt(unsold*absUnitCost) + " and under variable costing is " + fmt(unsold*varUnitCost) + ". What is the difference?",
            choices: mc(incomeDiff, [fixedMOH, incomeDiff*2, unsold*varUnitCost]).choices,
            correct: mc(incomeDiff, [fixedMOH, incomeDiff*2, unsold*varUnitCost]).correct,
            exp: fmt(unsold*absUnitCost) + " − " + fmt(unsold*varUnitCost) + " = " + fmt(incomeDiff) + ". This equals unsold units × fixed MOH per unit — the deferred fixed costs.",
            result: "Inventory difference = " + fmt(incomeDiff),
            formula: "Difference = Unsold Units × Fixed MOH per Unit",
            numbers: "Absorption EI = " + fmt(unsold*absUnitCost) + ", Variable EI = " + fmt(unsold*varUnitCost)
          }]
        },
        {
          title: "Q15 — Reconcile the Two Methods",
          steps: [{
            inst: "Absorption income exceeds variable costing income by " + fmt(incomeDiff) + ". Which statement explains this?",
            choices: [
              "A. Absorption costing expenses more fixed costs in the current period",
              "B. " + fmt(incomeDiff) + " of fixed MOH is deferred in ending inventory under absorption costing",
              "C. Variable costing always produces higher income when units are unsold",
              "D. The difference equals total fixed MOH for the period"
            ],
            correct: 1,
            exp: "Absorption costing defers " + fmt(fmohPerUnit) + " × " + unsold.toLocaleString() + " = " + fmt(incomeDiff) + " of fixed MOH in ending inventory. Variable costing expenses all fixed MOH immediately, giving lower income.",
            result: "B. Fixed MOH deferred in ending inventory",
            formula: "Absorption Income − Variable Income = Unsold Units × Fixed MOH/unit",
            numbers: "Unsold = " + unsold.toLocaleString() + ", Fixed MOH/unit = " + fmt(fmohPerUnit)
          }]
        }
      ]
    };
  }
};
