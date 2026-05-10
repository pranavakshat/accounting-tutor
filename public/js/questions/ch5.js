window.CH5 = {
  title: "Chapter 5 — Process Costing (Weighted Average)",
  description: "Equivalent units, cost per EU, and cost reconciliation using the weighted average method",
  formulas: [
    "Units Completed = Beginning WIP + Units Started − Ending WIP",
    "EU for Materials = Units Completed + Ending WIP × Material Completion %",
    "EU for Conversion = Units Completed + Ending WIP × Conversion Completion %",
    "Total Cost = Beginning Balance + Costs Added This Period",
    "Cost per EU = Total Cost / Equivalent Units",
    "Cost of Ending WIP = EU in Ending WIP × Cost per EU",
    "Cost Transferred Out = Units Completed × Cost per EU"
  ],
  definitions: [
    { q: "Under the weighted average method, equivalent units include:", choices: ["A. Only units started and completed this period", "B. Units in beginning WIP plus units started this period", "C. Units completed plus ending WIP equivalent units (combining beg WIP costs with current costs)", "D. Only fully completed units"], correct: 2, exp: "Weighted average blends beginning WIP costs with current period costs. EU = Units completed + Ending WIP × completion %. Beginning WIP EU is NOT subtracted out." },
    { q: "If ending WIP is 100% complete for materials and 40% complete for conversion, the equivalent units for conversion in ending WIP is:", choices: ["A. 100% of ending WIP units", "B. 40% of ending WIP units", "C. 60% of ending WIP units", "D. Zero — not yet complete"], correct: 1, exp: "EU for conversion = Ending WIP units × conversion completion % = Ending WIP × 40%. Materials would be full 100%." },
    { q: "The cost reconciliation check verifies that:", choices: ["A. Total EU for materials equals total EU for conversion", "B. Total costs to account for equal total costs accounted for", "C. Beginning WIP costs equal ending WIP costs", "D. Units started equal units completed"], correct: 1, exp: "Reconciliation: Total Cost to Account For (beg WIP cost + costs added) must equal Total Cost Accounted For (cost of FG transferred + cost of ending WIP)." }
  ],
  generate: function() {
    var multipliers = [0.85, 0.90, 1.0, 1.05, 1.10, 1.15];
    var m = multipliers[Math.floor(Math.random() * multipliers.length)];

    // Base: Clopack scenario
    var begUnits    = Math.round(5700  * m / 100) * 100;
    var unitsStarted = Math.round(38200 * m / 100) * 100;
    var endUnits    = Math.round(9400  * m / 100) * 100;
    var completedUnits = begUnits + unitsStarted - endUnits;

    // Completion percentages
    var matPctBeg  = 1.00;  // 100% materials in beg WIP
    var convPctBeg = 0.60;  // 60% conversion in beg WIP
    var matPctEnd  = 1.00;  // 100% materials in end WIP
    var convPctEndOptions = [0.40, 0.45, 0.50, 0.55, 0.60];
    var convPctEnd = convPctEndOptions[Math.floor(Math.random() * convPctEndOptions.length)];

    // Beginning WIP costs
    var begMatCost  = Math.round(21780 * m / 100) * 100;
    var begConvCost = Math.round(19220 * m / 100) * 100;
    var begTotalCost = begMatCost + begConvCost;

    // Costs added this period
    var matAdded  = Math.round(134065 * m / 100) * 100;
    var dlAdded   = Math.round(86500  * m / 100) * 100;
    var ohAdded   = Math.round(104000 * m / 100) * 100;
    var convAdded = dlAdded + ohAdded;

    // Weighted average — EU
    var eu_mat  = completedUnits + Math.round(endUnits * matPctEnd);
    var eu_conv = completedUnits + Math.round(endUnits * convPctEnd);

    // Total costs
    var totalMatCost  = begMatCost  + matAdded;
    var totalConvCost = begConvCost + convAdded;
    var grandTotalCost = totalMatCost + totalConvCost;

    // Cost per EU
    var cpeu_mat  = totalMatCost  / eu_mat;
    var cpeu_conv = totalConvCost / eu_conv;

    // Ending WIP cost
    var ewip_mat  = Math.round(endUnits * matPctEnd  * cpeu_mat);
    var ewip_conv = Math.round(endUnits * convPctEnd * cpeu_conv);
    var ewip_total = ewip_mat + ewip_conv;

    // Transferred to FG
    var fg_mat  = Math.round(completedUnits * cpeu_mat);
    var fg_conv = Math.round(completedUnits * cpeu_conv);
    var fg_total = fg_mat + fg_conv;

    var fmt  = function(n) { return '$' + Math.round(n).toLocaleString(); };
    var fmtD = function(n) { return '$' + (Math.round(n * 100) / 100).toFixed(2); };
    var fmtPct = function(p) { return Math.round(p * 100) + '%'; };

    function mc(correct, wrongs) {
      var cR = Math.round(correct);
      var pool = [cR].concat(wrongs.map(Math.round).filter(function(w) { return w !== cR && w > 0; })).slice(0, 4);
      while (pool.length < 4) pool.push(Math.round(cR * (1 + 0.12 * pool.length)));
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var idx = s.indexOf(cR);
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmt(v); }), correct: idx };
    }

    function mcUnits(correct, wrongs) {
      var pool = [correct].concat(wrongs.filter(function(w) { return w !== correct && w > 0; })).slice(0, 4);
      while (pool.length < 4) pool.push(correct + pool.length * 500);
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var idx = s.indexOf(correct);
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + v.toLocaleString() + ' units'; }), correct: idx };
    }

    function mcCpeu(correct, wrong1, wrong2, wrong3) {
      var pool = [correct, wrong1, wrong2, wrong3];
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var cR = Math.round(correct * 100);
      var idx = s.findIndex(function(v) { return Math.round(v * 100) === cR; });
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtD(v); }), correct: idx };
    }

    function mcJournal(correct, choices_arr) {
      var idx = choices_arr.indexOf(correct);
      return { choices: choices_arr.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + v; }), correct: idx };
    }

    // Journal entry choices (conceptual)
    var jeMatChoices = [
      "Debit Work in Process, Credit Raw Materials",
      "Debit Raw Materials, Credit Work in Process",
      "Debit Work in Process, Credit Cost of Goods Sold",
      "Debit Manufacturing Overhead, Credit Raw Materials"
    ];
    var jeOhChoices = [
      "Debit Work in Process, Credit Manufacturing Overhead",
      "Debit Manufacturing Overhead, Credit Work in Process",
      "Debit Work in Process, Credit Cash",
      "Debit Cost of Goods Sold, Credit Manufacturing Overhead"
    ];

    return {
      data: {
        begUnits: begUnits, unitsStarted: unitsStarted, endUnits: endUnits, completedUnits: completedUnits,
        convPctEnd: convPctEnd, eu_mat: eu_mat, eu_conv: eu_conv,
        totalMatCost: totalMatCost, totalConvCost: totalConvCost,
        cpeu_mat: cpeu_mat, cpeu_conv: cpeu_conv,
        ewip_total: ewip_total, fg_total: fg_total
      },
      dataTable: [
        ["Beginning WIP units", begUnits.toLocaleString() + " units"],
        ["Beginning WIP completion (materials / conversion)", fmtPct(matPctBeg) + " / " + fmtPct(convPctBeg)],
        ["Beginning WIP cost — Materials", fmt(begMatCost)],
        ["Beginning WIP cost — Conversion", fmt(begConvCost)],
        ["Units started this period", unitsStarted.toLocaleString() + " units"],
        ["Ending WIP units", endUnits.toLocaleString() + " units"],
        ["Ending WIP completion (materials / conversion)", fmtPct(matPctEnd) + " / " + fmtPct(convPctEnd)],
        ["Costs added — Materials", fmt(matAdded)],
        ["Costs added — Direct Labor", fmt(dlAdded)],
        ["Costs added — Manufacturing OH", fmt(ohAdded)]
      ],
      questions: [
        {
          title: "Q1 — Journal Entry for Raw Materials Used",
          steps: [{
            inst: "When raw materials are issued to production in a process costing system, which journal entry is made?",
            choices: jeMatChoices.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + v; }),
            correct: 0,
            exp: "Raw materials issued to production: Debit Work in Process (to add cost to WIP), Credit Raw Materials Inventory (to reduce the inventory).",
            result: "JE Raw Materials: Dr. WIP / Cr. Raw Materials",
            formula: "Materials used → transferred from Raw Materials Inventory to Work in Process",
            numbers: "Cost of materials added = " + fmt(matAdded)
          }]
        },
        {
          title: "Q2 — Journal Entry for Overhead Applied",
          steps: [{
            inst: "When manufacturing overhead is applied to production, which journal entry is made?",
            choices: jeOhChoices.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + v; }),
            correct: 0,
            exp: "Applied overhead: Debit Work in Process (adds overhead to production costs), Credit Manufacturing Overhead (clears the overhead account).",
            result: "JE OH Applied: Dr. WIP / Cr. Manufacturing Overhead",
            formula: "OH applied → transferred from Manufacturing Overhead to Work in Process",
            numbers: "OH applied this period = " + fmt(ohAdded)
          }]
        },
        {
          title: "Q3 — Units Completed and Transferred",
          steps: [{
            inst: "Beginning WIP is " + begUnits.toLocaleString() + " units, units started are " + unitsStarted.toLocaleString() + ", and ending WIP is " + endUnits.toLocaleString() + ". How many units were completed and transferred to Finished Goods?",
            choices: mcUnits(completedUnits, [begUnits + unitsStarted, unitsStarted - endUnits, completedUnits + endUnits]).choices,
            correct: mcUnits(completedUnits, [begUnits + unitsStarted, unitsStarted - endUnits, completedUnits + endUnits]).correct,
            exp: begUnits.toLocaleString() + " + " + unitsStarted.toLocaleString() + " − " + endUnits.toLocaleString() + " = " + completedUnits.toLocaleString() + " units completed",
            result: "Units completed = " + completedUnits.toLocaleString(),
            formula: "Units Completed = Beg WIP + Started − Ending WIP",
            numbers: "Beg WIP = " + begUnits.toLocaleString() + ", Started = " + unitsStarted.toLocaleString() + ", End WIP = " + endUnits.toLocaleString()
          }]
        },
        {
          title: "Q4 — Equivalent Units for Materials",
          steps: [{
            inst: "Completed units = " + completedUnits.toLocaleString() + ". Ending WIP = " + endUnits.toLocaleString() + " units, " + fmtPct(matPctEnd) + " complete for materials. What are the equivalent units for materials?",
            choices: mcUnits(eu_mat, [eu_conv, completedUnits, endUnits + completedUnits]).choices,
            correct: mcUnits(eu_mat, [eu_conv, completedUnits, endUnits + completedUnits]).correct,
            exp: completedUnits.toLocaleString() + " + (" + endUnits.toLocaleString() + " × " + fmtPct(matPctEnd) + ") = " + eu_mat.toLocaleString() + " EU",
            result: "EU for Materials = " + eu_mat.toLocaleString(),
            formula: "EU Materials = Units Completed + Ending WIP × Material %",
            numbers: "Completed = " + completedUnits.toLocaleString() + ", End WIP = " + endUnits.toLocaleString() + ", Mat % = " + fmtPct(matPctEnd)
          }]
        },
        {
          title: "Q5 — Equivalent Units for Conversion",
          steps: [{
            inst: "Completed units = " + completedUnits.toLocaleString() + ". Ending WIP = " + endUnits.toLocaleString() + " units, " + fmtPct(convPctEnd) + " complete for conversion. What are the equivalent units for conversion?",
            choices: mcUnits(eu_conv, [eu_mat, completedUnits, Math.round(endUnits * convPctEnd)]).choices,
            correct: mcUnits(eu_conv, [eu_mat, completedUnits, Math.round(endUnits * convPctEnd)]).correct,
            exp: completedUnits.toLocaleString() + " + (" + endUnits.toLocaleString() + " × " + fmtPct(convPctEnd) + ") = " + eu_conv.toLocaleString() + " EU",
            result: "EU for Conversion = " + eu_conv.toLocaleString(),
            formula: "EU Conversion = Units Completed + Ending WIP × Conversion %",
            numbers: "Completed = " + completedUnits.toLocaleString() + ", End WIP = " + endUnits.toLocaleString() + ", Conv % = " + fmtPct(convPctEnd)
          }]
        },
        {
          title: "Q6 — Total Cost of Materials (Weighted Average)",
          steps: [{
            inst: "Beginning WIP had " + fmt(begMatCost) + " in materials cost. Materials added this period: " + fmt(matAdded) + ". What is the total materials cost to account for?",
            choices: mc(totalMatCost, [matAdded, begMatCost, totalConvCost]).choices,
            correct: mc(totalMatCost, [matAdded, begMatCost, totalConvCost]).correct,
            exp: fmt(begMatCost) + " + " + fmt(matAdded) + " = " + fmt(totalMatCost),
            result: "Total materials cost = " + fmt(totalMatCost),
            formula: "Total Cost = Beginning WIP Cost + Cost Added This Period",
            numbers: "Beg WIP materials = " + fmt(begMatCost) + ", Materials added = " + fmt(matAdded)
          }]
        },
        {
          title: "Q7 — Total Cost of Conversion (Weighted Average)",
          steps: [{
            inst: "Beginning WIP had " + fmt(begConvCost) + " in conversion cost. DL added: " + fmt(dlAdded) + ", OH added: " + fmt(ohAdded) + ". What is the total conversion cost to account for?",
            choices: mc(totalConvCost, [convAdded, begConvCost, totalMatCost]).choices,
            correct: mc(totalConvCost, [convAdded, begConvCost, totalMatCost]).correct,
            exp: fmt(begConvCost) + " + " + fmt(dlAdded) + " + " + fmt(ohAdded) + " = " + fmt(totalConvCost),
            result: "Total conversion cost = " + fmt(totalConvCost),
            formula: "Total Conversion Cost = Beg WIP Conv + DL Added + OH Added",
            numbers: "Beg conv = " + fmt(begConvCost) + ", DL = " + fmt(dlAdded) + ", OH = " + fmt(ohAdded)
          }]
        },
        {
          title: "Q8 — Cost per Equivalent Unit: Materials",
          steps: [{
            inst: "Total materials cost is " + fmt(totalMatCost) + " and equivalent units for materials are " + eu_mat.toLocaleString() + ". What is the cost per equivalent unit for materials?",
            choices: mcCpeu(cpeu_mat, cpeu_conv, cpeu_mat * 1.1, cpeu_mat * 0.9).choices,
            correct: mcCpeu(cpeu_mat, cpeu_conv, cpeu_mat * 1.1, cpeu_mat * 0.9).correct,
            exp: fmt(totalMatCost) + " ÷ " + eu_mat.toLocaleString() + " EU = " + fmtD(cpeu_mat) + " per EU",
            result: "Cost/EU Materials = " + fmtD(cpeu_mat),
            formula: "Cost per EU = Total Cost / Equivalent Units",
            numbers: "Total materials cost = " + fmt(totalMatCost) + ", EU = " + eu_mat.toLocaleString()
          }]
        },
        {
          title: "Q9 — Cost per Equivalent Unit: Conversion",
          steps: [{
            inst: "Total conversion cost is " + fmt(totalConvCost) + " and equivalent units for conversion are " + eu_conv.toLocaleString() + ". What is the cost per equivalent unit for conversion?",
            choices: mcCpeu(cpeu_conv, cpeu_mat, cpeu_conv * 1.1, cpeu_conv * 0.9).choices,
            correct: mcCpeu(cpeu_conv, cpeu_mat, cpeu_conv * 1.1, cpeu_conv * 0.9).correct,
            exp: fmt(totalConvCost) + " ÷ " + eu_conv.toLocaleString() + " EU = " + fmtD(cpeu_conv) + " per EU",
            result: "Cost/EU Conversion = " + fmtD(cpeu_conv),
            formula: "Cost per EU = Total Cost / Equivalent Units",
            numbers: "Total conversion cost = " + fmt(totalConvCost) + ", EU = " + eu_conv.toLocaleString()
          }]
        },
        {
          title: "Q10 — Cost of Ending WIP: Materials",
          steps: [{
            inst: "Ending WIP has " + endUnits.toLocaleString() + " units at " + fmtPct(matPctEnd) + " completion for materials. Cost per EU for materials = " + fmtD(cpeu_mat) + ". What is the materials cost in ending WIP?",
            choices: mc(ewip_mat, [ewip_conv, ewip_total, ewip_mat * 1.1]).choices,
            correct: mc(ewip_mat, [ewip_conv, ewip_total, ewip_mat * 1.1]).correct,
            exp: endUnits.toLocaleString() + " × " + fmtPct(matPctEnd) + " × " + fmtD(cpeu_mat) + " = " + fmt(ewip_mat),
            result: "Ending WIP materials cost = " + fmt(ewip_mat),
            formula: "Ending WIP Materials = End Units × Mat % × Cost/EU Mat",
            numbers: "End WIP = " + endUnits.toLocaleString() + ", Mat % = " + fmtPct(matPctEnd) + ", Cost/EU = " + fmtD(cpeu_mat)
          }]
        },
        {
          title: "Q11 — Cost of Ending WIP: Conversion",
          steps: [{
            inst: "Ending WIP has " + endUnits.toLocaleString() + " units at " + fmtPct(convPctEnd) + " completion for conversion. Cost per EU for conversion = " + fmtD(cpeu_conv) + ". What is the conversion cost in ending WIP?",
            choices: mc(ewip_conv, [ewip_mat, ewip_total, ewip_conv * 1.1]).choices,
            correct: mc(ewip_conv, [ewip_mat, ewip_total, ewip_conv * 1.1]).correct,
            exp: endUnits.toLocaleString() + " × " + fmtPct(convPctEnd) + " × " + fmtD(cpeu_conv) + " = " + fmt(ewip_conv),
            result: "Ending WIP conversion cost = " + fmt(ewip_conv),
            formula: "Ending WIP Conversion = End Units × Conv % × Cost/EU Conv",
            numbers: "End WIP = " + endUnits.toLocaleString() + ", Conv % = " + fmtPct(convPctEnd) + ", Cost/EU = " + fmtD(cpeu_conv)
          }]
        },
        {
          title: "Q12 — Cost Transferred to FG: Materials",
          steps: [{
            inst: "Completed and transferred units = " + completedUnits.toLocaleString() + ". Cost per EU for materials = " + fmtD(cpeu_mat) + ". What is the materials cost transferred to Finished Goods?",
            choices: mc(fg_mat, [fg_conv, ewip_mat, fg_mat * 1.05]).choices,
            correct: mc(fg_mat, [fg_conv, ewip_mat, fg_mat * 1.05]).correct,
            exp: completedUnits.toLocaleString() + " × " + fmtD(cpeu_mat) + " = " + fmt(fg_mat),
            result: "FG materials cost transferred = " + fmt(fg_mat),
            formula: "Cost Transferred (Mat) = Units Completed × Cost/EU Mat",
            numbers: "Units completed = " + completedUnits.toLocaleString() + ", Cost/EU = " + fmtD(cpeu_mat)
          }]
        },
        {
          title: "Q13 — Cost Transferred to FG: Conversion",
          steps: [{
            inst: "Completed and transferred units = " + completedUnits.toLocaleString() + ". Cost per EU for conversion = " + fmtD(cpeu_conv) + ". What is the conversion cost transferred to Finished Goods?",
            choices: mc(fg_conv, [fg_mat, ewip_conv, fg_conv * 1.05]).choices,
            correct: mc(fg_conv, [fg_mat, ewip_conv, fg_conv * 1.05]).correct,
            exp: completedUnits.toLocaleString() + " × " + fmtD(cpeu_conv) + " = " + fmt(fg_conv),
            result: "FG conversion cost transferred = " + fmt(fg_conv),
            formula: "Cost Transferred (Conv) = Units Completed × Cost/EU Conv",
            numbers: "Units completed = " + completedUnits.toLocaleString() + ", Cost/EU = " + fmtD(cpeu_conv)
          }]
        },
        {
          title: "Q14 — Total Cost Transferred to Finished Goods",
          steps: [{
            inst: "Materials cost transferred = " + fmt(fg_mat) + ". Conversion cost transferred = " + fmt(fg_conv) + ". What is the total cost transferred to Finished Goods?",
            choices: mc(fg_total, [ewip_total, grandTotalCost, fg_total * 1.05]).choices,
            correct: mc(fg_total, [ewip_total, grandTotalCost, fg_total * 1.05]).correct,
            exp: fmt(fg_mat) + " + " + fmt(fg_conv) + " = " + fmt(fg_total),
            result: "Total cost transferred to FG = " + fmt(fg_total),
            formula: "Total FG Cost = Materials Transferred + Conversion Transferred",
            numbers: "FG materials = " + fmt(fg_mat) + ", FG conversion = " + fmt(fg_conv)
          }]
        },
        {
          title: "Q15 — Cost Reconciliation",
          steps: [{
            inst: "Total cost to account for = " + fmt(grandTotalCost) + ". Cost transferred to FG = " + fmt(fg_total) + ", ending WIP cost = " + fmt(ewip_total) + ". Do costs reconcile (cost accounted for = " + fmt(fg_total + ewip_total) + ")?",
            choices: [
              "A. Yes — total accounted for equals total to account for",
              "B. No — there is an unaccounted balance",
              "C. Cannot be determined without actual overhead",
              "D. Only if beginning WIP was zero"
            ],
            correct: 0,
            exp: "FG transferred " + fmt(fg_total) + " + Ending WIP " + fmt(ewip_total) + " = " + fmt(fg_total + ewip_total) + ". Total to account for = " + fmt(grandTotalCost) + ". The small difference (if any) is rounding. Costs reconcile.",
            result: "Reconciliation: " + fmt(fg_total) + " (FG) + " + fmt(ewip_total) + " (End WIP) = " + fmt(fg_total + ewip_total),
            formula: "Total Cost Accounted For = Cost Transferred + Ending WIP Cost",
            numbers: "FG cost = " + fmt(fg_total) + ", End WIP cost = " + fmt(ewip_total) + ", Total to account for = " + fmt(grandTotalCost)
          }]
        }
      ]
    };
  }
};
