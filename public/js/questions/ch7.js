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
        }
      ]
    };
  }
};
