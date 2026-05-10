window.CH2 = {
  title: "Chapter 2 — Job Order Costing",
  description: "Plantwide and departmental overhead rates, job costs, and unit product costs",
  formulas: [
    "Plantwide POHR = (Total Fixed OH + Variable OH Rate × Total MH) / Total MH",
    "OH Applied to Job = Job MH × POHR",
    "Total Manufacturing Cost = DM + DL + OH Applied",
    "Unit Product Cost = Total Manufacturing Cost / Units",
    "Departmental POHR = (Dept Fixed OH + Dept Var Rate × Dept MH) / Dept MH",
    "COGS = Sum of all job manufacturing costs (when all jobs sold)"
  ],
  definitions: [
    { q: "A predetermined overhead rate (POHR) is calculated:", choices: ["A. At the end of the year using actual costs", "B. At the beginning of the period using estimated costs", "C. Only for fixed overhead", "D. Using direct labor costs divided by machine hours"], correct: 1, exp: "POHR = Estimated Total OH / Estimated Allocation Base. It is calculated before the period begins using estimates." },
    { q: "Using departmental overhead rates instead of a plantwide rate is more accurate when:", choices: ["A. All departments use the same amount of overhead", "B. The company only has one product", "C. Different departments have different overhead drivers or amounts", "D. Variable costs are the same across all departments"], correct: 2, exp: "Departmental rates are more accurate when departments differ significantly in their overhead costs or activities — each department uses its own base." },
    { q: "Under job order costing, overhead is applied to jobs:", choices: ["A. Based on actual overhead incurred at the end of the period", "B. Using the POHR multiplied by the actual allocation base used by the job", "C. As a flat dollar amount per job", "D. Only when jobs are completed"], correct: 1, exp: "OH Applied = POHR × Actual Allocation Base (e.g., machine hours). This applies estimated overhead proportionally to each job." }
  ],
  generate: function() {
    // Scale multiplier to randomize numbers while keeping relationships clean
    var multipliers = [0.8, 0.9, 1.0, 1.1, 1.2, 1.25];
    var m = multipliers[Math.floor(Math.random() * multipliers.length)];

    // Base scenario: Sweeten Company (scaled)
    var moldMH_total = Math.round(2500 * m / 100) * 100;
    var fabMH_total  = Math.round(1500 * m / 100) * 100;
    var totalMH      = moldMH_total + fabMH_total;

    var fixedMold = Math.round(14000 * m / 100) * 100;
    var fixedFab  = Math.round(17400 * m / 100) * 100;
    var totalFixed = fixedMold + fixedFab;

    var varRatePlant = 3.30;
    var varRateMold  = 3.00;
    var varRateFab   = 3.80;

    // Job P
    var dm_P  = Math.round(29000 * m / 100) * 100;
    var dl_P  = Math.round(33800 * m / 100) * 100;
    var mhMold_P = Math.round(3300 * m / 100) * 100;
    var mhFab_P  = Math.round(2200 * m / 100) * 100;
    var mhTotal_P = mhMold_P + mhFab_P;
    var units_P = 20;

    // Job Q
    var dm_Q  = Math.round(16000 * m / 100) * 100;
    var dl_Q  = Math.round(13900 * m / 100) * 100;
    var mhMold_Q = Math.round(2400 * m / 100) * 100;
    var mhFab_Q  = Math.round(2500 * m / 100) * 100;
    var mhTotal_Q = mhMold_Q + mhFab_Q;
    var units_Q = 30;

    // Plantwide POHR
    var pohr_plant = (totalFixed + varRatePlant * totalMH) / totalMH;

    // OH applied plantwide
    var oh_P_plant = Math.round(mhTotal_P * pohr_plant);
    var oh_Q_plant = Math.round(mhTotal_Q * pohr_plant);

    // Total manufacturing cost plantwide
    var total_P_plant = dm_P + dl_P + oh_P_plant;
    var total_Q_plant = dm_Q + dl_Q + oh_Q_plant;
    var unit_P_plant  = Math.round(total_P_plant / units_P);
    var unit_Q_plant  = Math.round(total_Q_plant / units_Q);
    var cogs_plant    = total_P_plant + total_Q_plant;

    // Departmental POHRs
    var pohr_mold = (fixedMold + varRateMold * moldMH_total) / moldMH_total;
    var pohr_fab  = (fixedFab  + varRateFab  * fabMH_total)  / fabMH_total;

    // OH applied departmental — Job P
    var ohMold_P = Math.round(mhMold_P * pohr_mold);
    var ohFab_P  = Math.round(mhFab_P  * pohr_fab);
    var oh_P_dept = ohMold_P + ohFab_P;

    // OH applied departmental — Job Q
    var ohMold_Q = Math.round(mhMold_Q * pohr_mold);
    var ohFab_Q  = Math.round(mhFab_Q  * pohr_fab);
    var oh_Q_dept = ohMold_Q + ohFab_Q;

    // Total manufacturing cost departmental
    var total_P_dept = dm_P + dl_P + oh_P_dept;
    var total_Q_dept = dm_Q + dl_Q + oh_Q_dept;
    var unit_P_dept  = Math.round(total_P_dept / units_P);
    var unit_Q_dept  = Math.round(total_Q_dept / units_Q);
    var cogs_dept    = total_P_dept + total_Q_dept;

    var fmt  = function(n) { return '$' + Math.round(n).toLocaleString(); };
    var fmtD = function(n) { return '$' + (Math.round(n * 100) / 100).toFixed(2); };

    function mc(correct, wrongs) {
      var pool = [correct].concat(wrongs.filter(function(w) { return Math.round(w) !== Math.round(correct) && w > 0; })).slice(0, 4);
      while (pool.length < 4) pool.push(Math.round(correct * (1 + 0.12 * pool.length)));
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var correctR = Math.round(correct);
      var idx = s.findIndex(function(v) { return Math.round(v) === correctR; });
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmt(v); }), correct: idx };
    }

    function mcRate(correct, wrongs) {
      var pool = [correct].concat(wrongs.filter(function(w) { return Math.abs(Math.round(w * 100) - Math.round(correct * 100)) > 1; })).slice(0, 4);
      while (pool.length < 4) pool.push(correct * (1 + 0.15 * pool.length));
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var correctR = Math.round(correct * 100);
      var idx = s.findIndex(function(v) { return Math.round(v * 100) === correctR; });
      return { choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtD(v) + ' per MH'; }), correct: idx };
    }

    return {
      data: {
        totalMH: totalMH, moldMH_total: moldMH_total, fabMH_total: fabMH_total,
        totalFixed: totalFixed, fixedMold: fixedMold, fixedFab: fixedFab,
        pohr_plant: pohr_plant, pohr_mold: pohr_mold, pohr_fab: pohr_fab,
        dm_P: dm_P, dl_P: dl_P, mhTotal_P: mhTotal_P, units_P: units_P,
        dm_Q: dm_Q, dl_Q: dl_Q, mhTotal_Q: mhTotal_Q, units_Q: units_Q
      },
      dataTable: [
        ["Total estimated machine hours (Plantwide)", totalMH.toLocaleString() + " MH"],
        ["  Molding dept MH", moldMH_total.toLocaleString() + " MH"],
        ["  Fabrication dept MH", fabMH_total.toLocaleString() + " MH"],
        ["Total fixed overhead", fmt(totalFixed)],
        ["  Molding fixed OH", fmt(fixedMold)],
        ["  Fabrication fixed OH", fmt(fixedFab)],
        ["Variable OH rate (plantwide)", fmtD(varRatePlant) + "/MH"],
        ["Variable OH rate (Molding dept)", fmtD(varRateMold) + "/MH"],
        ["Variable OH rate (Fabrication dept)", fmtD(varRateFab) + "/MH"],
        ["Job P — Direct Materials", fmt(dm_P)],
        ["Job P — Direct Labor", fmt(dl_P)],
        ["Job P — Machine Hours (Molding / Fab)", mhMold_P.toLocaleString() + " / " + mhFab_P.toLocaleString()],
        ["Job P — Units produced", units_P + " units"],
        ["Job Q — Direct Materials", fmt(dm_Q)],
        ["Job Q — Direct Labor", fmt(dl_Q)],
        ["Job Q — Machine Hours (Molding / Fab)", mhMold_Q.toLocaleString() + " / " + mhFab_Q.toLocaleString()],
        ["Job Q — Units produced", units_Q + " units"]
      ],
      questions: [
        {
          title: "Q1 — Plantwide Predetermined Overhead Rate",
          steps: [{
            inst: "Total fixed overhead is " + fmt(totalFixed) + ", the variable overhead rate is " + fmtD(varRatePlant) + "/MH, and estimated total machine hours are " + totalMH.toLocaleString() + " MH. What is the plantwide predetermined overhead rate (POHR)?",
            choices: mcRate(pohr_plant, [pohr_plant * 1.1, pohr_plant * 0.9, varRatePlant]).choices,
            correct: mcRate(pohr_plant, [pohr_plant * 1.1, pohr_plant * 0.9, varRatePlant]).correct,
            exp: "(" + fmt(totalFixed) + " + " + fmtD(varRatePlant) + " × " + totalMH.toLocaleString() + ") ÷ " + totalMH.toLocaleString() + " MH = " + fmtD(pohr_plant) + " per MH",
            result: "Plantwide POHR = " + fmtD(pohr_plant) + "/MH",
            formula: "Plantwide POHR = (Total Fixed OH + Variable Rate × Total MH) / Total MH",
            numbers: "Total Fixed OH = " + fmt(totalFixed) + ", Var rate = " + fmtD(varRatePlant) + ", Total MH = " + totalMH.toLocaleString()
          }]
        },
        {
          title: "Q2 — Overhead Applied to Job P (Plantwide)",
          steps: [{
            inst: "Job P used " + mhTotal_P.toLocaleString() + " total machine hours. The plantwide POHR is " + fmtD(pohr_plant) + "/MH. How much overhead is applied to Job P?",
            choices: mc(oh_P_plant, [oh_Q_plant, oh_P_plant * 1.1, dm_P]).choices,
            correct: mc(oh_P_plant, [oh_Q_plant, oh_P_plant * 1.1, dm_P]).correct,
            exp: mhTotal_P.toLocaleString() + " MH × " + fmtD(pohr_plant) + " = " + fmt(oh_P_plant),
            result: "OH applied to Job P (plantwide) = " + fmt(oh_P_plant),
            formula: "OH Applied = Job MH × POHR",
            numbers: "Job P MH = " + mhTotal_P.toLocaleString() + ", POHR = " + fmtD(pohr_plant)
          }]
        },
        {
          title: "Q3 — Overhead Applied to Job Q (Plantwide)",
          steps: [{
            inst: "Job Q used " + mhTotal_Q.toLocaleString() + " total machine hours. The plantwide POHR is " + fmtD(pohr_plant) + "/MH. How much overhead is applied to Job Q?",
            choices: mc(oh_Q_plant, [oh_P_plant, oh_Q_plant * 1.1, dm_Q]).choices,
            correct: mc(oh_Q_plant, [oh_P_plant, oh_Q_plant * 1.1, dm_Q]).correct,
            exp: mhTotal_Q.toLocaleString() + " MH × " + fmtD(pohr_plant) + " = " + fmt(oh_Q_plant),
            result: "OH applied to Job Q (plantwide) = " + fmt(oh_Q_plant),
            formula: "OH Applied = Job MH × POHR",
            numbers: "Job Q MH = " + mhTotal_Q.toLocaleString() + ", POHR = " + fmtD(pohr_plant)
          }]
        },
        {
          title: "Q4 — Total Manufacturing Cost: Job P",
          steps: [{
            inst: "Job P has DM " + fmt(dm_P) + ", DL " + fmt(dl_P) + ", and OH applied " + fmt(oh_P_plant) + ". What is the total manufacturing cost for Job P?",
            choices: mc(total_P_plant, [dm_P + dl_P, total_Q_plant, total_P_plant * 1.05]).choices,
            correct: mc(total_P_plant, [dm_P + dl_P, total_Q_plant, total_P_plant * 1.05]).correct,
            exp: fmt(dm_P) + " + " + fmt(dl_P) + " + " + fmt(oh_P_plant) + " = " + fmt(total_P_plant),
            result: "Total mfg cost Job P = " + fmt(total_P_plant),
            formula: "Total Mfg Cost = DM + DL + OH Applied",
            numbers: "DM = " + fmt(dm_P) + ", DL = " + fmt(dl_P) + ", OH = " + fmt(oh_P_plant)
          }]
        },
        {
          title: "Q5 — Unit Product Cost: Job P (Plantwide)",
          steps: [{
            inst: "Job P's total manufacturing cost is " + fmt(total_P_plant) + " and " + units_P + " units were produced. What is the unit product cost for Job P?",
            choices: mc(unit_P_plant, [unit_Q_plant, Math.round(total_P_plant / (units_P + 5)), unit_P_plant * 1.1]).choices,
            correct: mc(unit_P_plant, [unit_Q_plant, Math.round(total_P_plant / (units_P + 5)), unit_P_plant * 1.1]).correct,
            exp: fmt(total_P_plant) + " ÷ " + units_P + " units = " + fmt(unit_P_plant) + " per unit",
            result: "Unit cost Job P (plantwide) = " + fmt(unit_P_plant),
            formula: "Unit Product Cost = Total Mfg Cost / Units Produced",
            numbers: "Total cost = " + fmt(total_P_plant) + ", Units = " + units_P
          }]
        },
        {
          title: "Q6 — Total Manufacturing Cost: Job Q",
          steps: [{
            inst: "Job Q has DM " + fmt(dm_Q) + ", DL " + fmt(dl_Q) + ", and OH applied " + fmt(oh_Q_plant) + ". What is the total manufacturing cost for Job Q?",
            choices: mc(total_Q_plant, [dm_Q + dl_Q, total_P_plant, total_Q_plant * 1.05]).choices,
            correct: mc(total_Q_plant, [dm_Q + dl_Q, total_P_plant, total_Q_plant * 1.05]).correct,
            exp: fmt(dm_Q) + " + " + fmt(dl_Q) + " + " + fmt(oh_Q_plant) + " = " + fmt(total_Q_plant),
            result: "Total mfg cost Job Q = " + fmt(total_Q_plant),
            formula: "Total Mfg Cost = DM + DL + OH Applied",
            numbers: "DM = " + fmt(dm_Q) + ", DL = " + fmt(dl_Q) + ", OH = " + fmt(oh_Q_plant)
          }]
        },
        {
          title: "Q7 — Unit Product Cost: Job Q (Plantwide)",
          steps: [{
            inst: "Job Q's total manufacturing cost is " + fmt(total_Q_plant) + " and " + units_Q + " units were produced. What is the unit product cost for Job Q?",
            choices: mc(unit_Q_plant, [unit_P_plant, Math.round(total_Q_plant / (units_Q + 5)), unit_Q_plant * 1.1]).choices,
            correct: mc(unit_Q_plant, [unit_P_plant, Math.round(total_Q_plant / (units_Q + 5)), unit_Q_plant * 1.1]).correct,
            exp: fmt(total_Q_plant) + " ÷ " + units_Q + " units = " + fmt(unit_Q_plant) + " per unit",
            result: "Unit cost Job Q (plantwide) = " + fmt(unit_Q_plant),
            formula: "Unit Product Cost = Total Mfg Cost / Units Produced",
            numbers: "Total cost = " + fmt(total_Q_plant) + ", Units = " + units_Q
          }]
        },
        {
          title: "Q8 — Cost of Goods Sold (Plantwide)",
          steps: [{
            inst: "Both Job P and Job Q were completed and sold. Total mfg cost for Job P is " + fmt(total_P_plant) + " and for Job Q is " + fmt(total_Q_plant) + ". What is the total cost of goods sold?",
            choices: mc(cogs_plant, [total_P_plant, total_Q_plant, cogs_plant * 1.08]).choices,
            correct: mc(cogs_plant, [total_P_plant, total_Q_plant, cogs_plant * 1.08]).correct,
            exp: fmt(total_P_plant) + " + " + fmt(total_Q_plant) + " = " + fmt(cogs_plant),
            result: "COGS (plantwide) = " + fmt(cogs_plant),
            formula: "COGS = Sum of all completed job manufacturing costs",
            numbers: "Job P total = " + fmt(total_P_plant) + ", Job Q total = " + fmt(total_Q_plant)
          }]
        },
        {
          title: "Q9 — Departmental POHR: Molding",
          steps: [{
            inst: "Molding dept has fixed OH of " + fmt(fixedMold) + ", variable rate of " + fmtD(varRateMold) + "/MH, and estimated " + moldMH_total.toLocaleString() + " MH. What is the Molding department POHR?",
            choices: mcRate(pohr_mold, [pohr_plant, pohr_fab, varRateMold]).choices,
            correct: mcRate(pohr_mold, [pohr_plant, pohr_fab, varRateMold]).correct,
            exp: "(" + fmt(fixedMold) + " + " + fmtD(varRateMold) + " × " + moldMH_total.toLocaleString() + ") ÷ " + moldMH_total.toLocaleString() + " = " + fmtD(pohr_mold) + "/MH",
            result: "Molding POHR = " + fmtD(pohr_mold) + "/MH",
            formula: "Dept POHR = (Dept Fixed OH + Dept Var Rate × Dept MH) / Dept MH",
            numbers: "Molding fixed OH = " + fmt(fixedMold) + ", Var rate = " + fmtD(varRateMold) + ", Dept MH = " + moldMH_total.toLocaleString()
          }]
        },
        {
          title: "Q10 — Departmental POHR: Fabrication",
          steps: [{
            inst: "Fabrication dept has fixed OH of " + fmt(fixedFab) + ", variable rate of " + fmtD(varRateFab) + "/MH, and estimated " + fabMH_total.toLocaleString() + " MH. What is the Fabrication department POHR?",
            choices: mcRate(pohr_fab, [pohr_plant, pohr_mold, varRateFab]).choices,
            correct: mcRate(pohr_fab, [pohr_plant, pohr_mold, varRateFab]).correct,
            exp: "(" + fmt(fixedFab) + " + " + fmtD(varRateFab) + " × " + fabMH_total.toLocaleString() + ") ÷ " + fabMH_total.toLocaleString() + " = " + fmtD(pohr_fab) + "/MH",
            result: "Fabrication POHR = " + fmtD(pohr_fab) + "/MH",
            formula: "Dept POHR = (Dept Fixed OH + Dept Var Rate × Dept MH) / Dept MH",
            numbers: "Fab fixed OH = " + fmt(fixedFab) + ", Var rate = " + fmtD(varRateFab) + ", Dept MH = " + fabMH_total.toLocaleString()
          }]
        },
        {
          title: "Q11 — Molding OH Applied to Job P and Q",
          steps: [
            {
              inst: "Job P used " + mhMold_P.toLocaleString() + " MH in Molding. The Molding POHR is " + fmtD(pohr_mold) + "/MH. How much Molding OH is applied to Job P?",
              choices: mc(ohMold_P, [ohMold_Q, ohFab_P, ohMold_P * 1.1]).choices,
              correct: mc(ohMold_P, [ohMold_Q, ohFab_P, ohMold_P * 1.1]).correct,
              exp: mhMold_P.toLocaleString() + " MH × " + fmtD(pohr_mold) + " = " + fmt(ohMold_P),
              result: "Molding OH → Job P = " + fmt(ohMold_P),
              formula: "OH Applied = Job Dept MH × Dept POHR",
              numbers: "Job P Molding MH = " + mhMold_P.toLocaleString() + ", Molding POHR = " + fmtD(pohr_mold)
            },
            {
              inst: "Job Q used " + mhMold_Q.toLocaleString() + " MH in Molding. The Molding POHR is " + fmtD(pohr_mold) + "/MH. How much Molding OH is applied to Job Q?",
              choices: mc(ohMold_Q, [ohMold_P, ohFab_Q, ohMold_Q * 1.1]).choices,
              correct: mc(ohMold_Q, [ohMold_P, ohFab_Q, ohMold_Q * 1.1]).correct,
              exp: mhMold_Q.toLocaleString() + " MH × " + fmtD(pohr_mold) + " = " + fmt(ohMold_Q),
              result: "Molding OH → Job Q = " + fmt(ohMold_Q),
              formula: "OH Applied = Job Dept MH × Dept POHR",
              numbers: "Job Q Molding MH = " + mhMold_Q.toLocaleString() + ", Molding POHR = " + fmtD(pohr_mold)
            }
          ]
        },
        {
          title: "Q12 — Fabrication OH Applied to Job P and Q",
          steps: [
            {
              inst: "Job P used " + mhFab_P.toLocaleString() + " MH in Fabrication. The Fabrication POHR is " + fmtD(pohr_fab) + "/MH. How much Fabrication OH is applied to Job P?",
              choices: mc(ohFab_P, [ohFab_Q, ohMold_P, ohFab_P * 1.1]).choices,
              correct: mc(ohFab_P, [ohFab_Q, ohMold_P, ohFab_P * 1.1]).correct,
              exp: mhFab_P.toLocaleString() + " MH × " + fmtD(pohr_fab) + " = " + fmt(ohFab_P),
              result: "Fabrication OH → Job P = " + fmt(ohFab_P),
              formula: "OH Applied = Job Dept MH × Dept POHR",
              numbers: "Job P Fab MH = " + mhFab_P.toLocaleString() + ", Fab POHR = " + fmtD(pohr_fab)
            },
            {
              inst: "Job Q used " + mhFab_Q.toLocaleString() + " MH in Fabrication. The Fabrication POHR is " + fmtD(pohr_fab) + "/MH. How much Fabrication OH is applied to Job Q?",
              choices: mc(ohFab_Q, [ohFab_P, ohMold_Q, ohFab_Q * 1.1]).choices,
              correct: mc(ohFab_Q, [ohFab_P, ohMold_Q, ohFab_Q * 1.1]).correct,
              exp: mhFab_Q.toLocaleString() + " MH × " + fmtD(pohr_fab) + " = " + fmt(ohFab_Q),
              result: "Fabrication OH → Job Q = " + fmt(ohFab_Q),
              formula: "OH Applied = Job Dept MH × Dept POHR",
              numbers: "Job Q Fab MH = " + mhFab_Q.toLocaleString() + ", Fab POHR = " + fmtD(pohr_fab)
            }
          ]
        },
        {
          title: "Q13 — Unit Product Cost: Job P (Departmental Rates)",
          steps: [
            {
              inst: "Using departmental rates: Job P's total OH is Molding OH " + fmt(ohMold_P) + " + Fabrication OH " + fmt(ohFab_P) + ". What is total OH applied to Job P?",
              choices: mc(oh_P_dept, [oh_P_plant, oh_Q_dept, oh_P_dept * 1.05]).choices,
              correct: mc(oh_P_dept, [oh_P_plant, oh_Q_dept, oh_P_dept * 1.05]).correct,
              exp: fmt(ohMold_P) + " + " + fmt(ohFab_P) + " = " + fmt(oh_P_dept),
              result: "Total dept OH → Job P = " + fmt(oh_P_dept),
              formula: "Total OH = Molding OH Applied + Fabrication OH Applied",
              numbers: "Molding OH = " + fmt(ohMold_P) + ", Fab OH = " + fmt(ohFab_P)
            },
            {
              inst: "Job P total manufacturing cost using departmental rates: DM " + fmt(dm_P) + " + DL " + fmt(dl_P) + " + OH " + fmt(oh_P_dept) + ". Divided by " + units_P + " units. What is the unit product cost?",
              choices: mc(unit_P_dept, [unit_P_plant, unit_Q_dept, unit_P_dept * 1.1]).choices,
              correct: mc(unit_P_dept, [unit_P_plant, unit_Q_dept, unit_P_dept * 1.1]).correct,
              exp: "(" + fmt(dm_P) + " + " + fmt(dl_P) + " + " + fmt(oh_P_dept) + ") ÷ " + units_P + " = " + fmt(total_P_dept) + " ÷ " + units_P + " = " + fmt(unit_P_dept) + " per unit",
              result: "Unit cost Job P (dept rates) = " + fmt(unit_P_dept),
              formula: "Unit Cost = (DM + DL + Total Dept OH) / Units",
              numbers: "DM = " + fmt(dm_P) + ", DL = " + fmt(dl_P) + ", OH = " + fmt(oh_P_dept) + ", Units = " + units_P
            }
          ]
        },
        {
          title: "Q14 — Unit Product Cost: Job Q (Departmental Rates)",
          steps: [
            {
              inst: "Using departmental rates: Job Q's Molding OH is " + fmt(ohMold_Q) + " and Fabrication OH is " + fmt(ohFab_Q) + ". What is total OH applied to Job Q?",
              choices: mc(oh_Q_dept, [oh_Q_plant, oh_P_dept, oh_Q_dept * 1.05]).choices,
              correct: mc(oh_Q_dept, [oh_Q_plant, oh_P_dept, oh_Q_dept * 1.05]).correct,
              exp: fmt(ohMold_Q) + " + " + fmt(ohFab_Q) + " = " + fmt(oh_Q_dept),
              result: "Total dept OH → Job Q = " + fmt(oh_Q_dept),
              formula: "Total OH = Molding OH Applied + Fabrication OH Applied",
              numbers: "Molding OH = " + fmt(ohMold_Q) + ", Fab OH = " + fmt(ohFab_Q)
            },
            {
              inst: "Job Q total manufacturing cost using departmental rates: DM " + fmt(dm_Q) + " + DL " + fmt(dl_Q) + " + OH " + fmt(oh_Q_dept) + ". Divided by " + units_Q + " units. What is the unit product cost?",
              choices: mc(unit_Q_dept, [unit_Q_plant, unit_P_dept, unit_Q_dept * 1.1]).choices,
              correct: mc(unit_Q_dept, [unit_Q_plant, unit_P_dept, unit_Q_dept * 1.1]).correct,
              exp: "(" + fmt(dm_Q) + " + " + fmt(dl_Q) + " + " + fmt(oh_Q_dept) + ") ÷ " + units_Q + " = " + fmt(total_Q_dept) + " ÷ " + units_Q + " = " + fmt(unit_Q_dept) + " per unit",
              result: "Unit cost Job Q (dept rates) = " + fmt(unit_Q_dept),
              formula: "Unit Cost = (DM + DL + Total Dept OH) / Units",
              numbers: "DM = " + fmt(dm_Q) + ", DL = " + fmt(dl_Q) + ", OH = " + fmt(oh_Q_dept) + ", Units = " + units_Q
            }
          ]
        },
        {
          title: "Q15 — COGS Using Departmental Rates",
          steps: [{
            inst: "Both jobs were sold. Using departmental rates, Job P total cost is " + fmt(total_P_dept) + " and Job Q total cost is " + fmt(total_Q_dept) + ". What is total COGS?",
            choices: mc(cogs_dept, [cogs_plant, total_P_dept, cogs_dept * 1.05]).choices,
            correct: mc(cogs_dept, [cogs_plant, total_P_dept, cogs_dept * 1.05]).correct,
            exp: fmt(total_P_dept) + " + " + fmt(total_Q_dept) + " = " + fmt(cogs_dept),
            result: "COGS (departmental rates) = " + fmt(cogs_dept),
            formula: "COGS = Job P total cost + Job Q total cost",
            numbers: "Job P total = " + fmt(total_P_dept) + ", Job Q total = " + fmt(total_Q_dept)
          }]
        }
      ]
    };
  }
};
