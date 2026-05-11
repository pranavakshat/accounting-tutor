window.CH13 = {
  title: "Chapter 13 — Statement of Cash Flows (Indirect Method)",
  description: "Operating activities section, adjustments to net income, gains/losses, and T-account analysis (purchases, supplier payments, taxes paid)",
  formulas: [
    "Indirect method starts with: Net Income",
    "Add back non-cash expenses (Depreciation, Amortization)",
    "Subtract Gains on sale of long-term assets; Add Losses",
    "Decrease in Current Asset → ADD to Net Income",
    "Increase in Current Asset → SUBTRACT from Net Income",
    "Increase in Current Liability → ADD to Net Income",
    "Decrease in Current Liability → SUBTRACT from Net Income",
    "Net Income = Change in Retained Earnings + Dividends Paid",
    "Book Value = Original Cost − Accumulated Depreciation",
    "Gain (Loss) on Sale = Sale Price − Book Value",
    "Depreciation Expense = ΔAccumulated Depreciation + Accum. Dep. on sold assets",
    "Inventory Purchases = COGS + (End Inventory − Beg Inventory)",
    "Cash Paid to Suppliers = Beg AP + Purchases − End AP",
    "Cash Paid for Income Taxes = Beg ITP + Tax Expense − End ITP"
  ],
  definitions: [
    {
      q: "Under the indirect method of preparing the statement of cash flows, the operating activities section starts with which line item?",
      choices: ["A. Cash sales", "B. Net income", "C. Gross profit", "D. Total revenues"],
      correct: 1,
      exp: "The indirect method begins with net income from the income statement, then adjusts for non-cash items and changes in working capital."
    },
    {
      q: "Depreciation expense appears in the operating section of the indirect-method statement of cash flows because:",
      choices: ["A. It is a cash outflow that must be reported", "B. It is a non-cash expense that reduced net income but did not use cash, so it must be added back", "C. It belongs in investing activities", "D. It offsets the gain on sale of equipment"],
      correct: 1,
      exp: "Depreciation reduced net income but no cash actually left the company. Adding it back restores net income to a cash basis."
    },
    {
      q: "A gain on the sale of equipment appears in the operating section of the indirect-method statement of cash flows as:",
      choices: ["A. An addition to net income", "B. A subtraction from net income", "C. A separate investing inflow only — no operating adjustment", "D. It is not reported at all"],
      correct: 1,
      exp: "The full cash received from the sale appears under investing activities. The gain already inflated net income, so we subtract it in the operating section to avoid double-counting."
    },
    {
      q: "When accounts receivable DECREASE during the year, what does that decrease represent in cash terms?",
      choices: ["A. Cash collected from customers was LESS than credit sales", "B. Cash collected from customers was MORE than credit sales", "C. Cash payments to suppliers were less than purchases", "D. The company stopped extending credit"],
      correct: 1,
      exp: "AR going down means more was collected from old customers than was charged on new credit sales. So cash collected > credit sales, and we ADD the AR decrease to net income."
    },
    {
      q: "When inventory INCREASES and accounts payable DECREASES during the year, what does the combined adjustment to net income represent?",
      choices: ["A. Cash paid to suppliers > cost of goods sold", "B. Cash paid to suppliers < cost of goods sold", "C. Cash collected from customers > credit sales", "D. Net income > operating cash flow only because of depreciation"],
      correct: 0,
      exp: "Higher inventory means we bought more than we sold; lower AP means we paid more than we bought. Both push cash outflow above COGS. Combined adjustment is a subtraction from net income."
    }
  ],
  generate: function() {
    // Multipliers for variation
    var mults = [0.9, 0.95, 1.0, 1.05, 1.1];
    var m = mults[Math.floor(Math.random() * mults.length)];

    var R = function(n) { return Math.round(n / 100) * 100; };

    // ===== Balance Sheet values (parametric) =====
    var arBeg  = R(90200  * m);
    var arEnd  = R(83700  * m);
    var arChange = arEnd - arBeg;

    var invBeg = R(102500 * m);
    var invEnd = R(112400 * m);
    var invChange = invEnd - invBeg;

    var apBeg  = R(116500 * m);
    var apEnd  = R(65600  * m);
    var apChange = apEnd - apBeg;

    var itpBeg = R(68600  * m);
    var itpEnd = R(50900  * m);
    var itpChange = itpEnd - itpBeg;

    var accumDepBeg = R(71750 * m);
    var accumDepEnd = R(99000 * m);

    // ===== Equipment sale =====
    var equipCost      = R(14400 * m);
    var equipAccumDep  = R(9600  * m);
    var equipBookValue = equipCost - equipAccumDep;
    var equipSalePrice = R(6150  * m);
    var equipGain      = equipSalePrice - equipBookValue;

    var deprExpense = (accumDepEnd - accumDepBeg) + equipAccumDep;

    // ===== Income & dividends =====
    var netIncome = R(75000 * m);
    var dividends = R(12300 * m);
    var reEnd     = R(116500 * m);
    var reBeg     = reEnd - netIncome + dividends;

    // ===== Income statement items for T-account analysis =====
    var cogs        = R(820000 * m);
    var taxExpense  = R(95000  * m);

    // T-account derived flows
    var purchases        = cogs + invChange;            // debits to Inventory T-account
    var supplierPayments = apBeg + purchases - apEnd;   // debits to AP T-account
    var taxesPaid        = itpBeg + taxExpense - itpEnd; // debits to ITP T-account

    // ===== Adjustments =====
    var adjDepr = deprExpense;
    var adjGain = -equipGain;
    var adjAR   = -arChange;
    var adjInv  = -invChange;
    var adjAP   = apChange;
    var adjITP  = itpChange;

    var netOpCash = netIncome + adjDepr + adjGain + adjAR + adjInv + adjAP + adjITP;

    // ===== Formatting =====
    var fmtPlain = function(n) { return '$' + Math.round(n).toLocaleString(); };

    // ===== MC builders =====
    function mcSigned(correct, wrongs) {
      var cR = Math.round(correct);
      var pool = [cR];
      wrongs.forEach(function(w) {
        var r = Math.round(w);
        if (r !== cR && pool.indexOf(r) === -1) pool.push(r);
      });
      var k = 1;
      while (pool.length < 4) {
        var f = Math.round(Math.abs(cR) * (1 + 0.12 * k) + 1100 * k) * (cR < 0 ? -1 : 1);
        if (pool.indexOf(f) === -1 && f !== 0) pool.push(f);
        k++;
        if (k > 50) break;
      }
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var idx = s.indexOf(cR);
      return {
        choices: s.map(function(v, i) {
          var label = ['A','B','C','D'][i];
          if (v < 0) return label + '. ' + fmtPlain(-v) + ' deducted from net income';
          return label + '. ' + fmtPlain(v) + ' added to net income';
        }),
        correct: idx
      };
    }

    function mcAmount(correct, wrongs) {
      var cR = Math.round(correct);
      var pool = [cR];
      wrongs.forEach(function(w) {
        var r = Math.round(w);
        if (r !== cR && pool.indexOf(r) === -1) pool.push(r);
      });
      var k = 1;
      while (pool.length < 4) {
        var f = Math.round(Math.abs(cR) * (1 + 0.12 * k) + 950 * k);
        if (pool.indexOf(f) === -1 && f > 0) pool.push(f);
        k++;
        if (k > 50) break;
      }
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var idx = s.indexOf(cR);
      return {
        choices: s.map(function(v, i) { return ['A','B','C','D'][i] + '. ' + fmtPlain(v); }),
        correct: idx
      };
    }

    var q2mc  = mcAmount(netIncome,    [reEnd - reBeg, dividends, netIncome + dividends]);
    var q4mc  = mcAmount(deprExpense,  [accumDepEnd - accumDepBeg, accumDepEnd, equipAccumDep]);
    var q6mc  = mcAmount(Math.abs(equipGain), [equipSalePrice, equipBookValue, equipCost - equipSalePrice]);
    var q8mc  = mcSigned(adjAR,        [arChange, arEnd, -arEnd]);
    var q10mc = mcSigned(adjInv,       [invChange, invEnd, -invEnd]);
    var q11mc = mcAmount(purchases,    [cogs, cogs - invChange, invEnd + cogs]);
    var q13mc = mcSigned(adjAP,        [-apChange, apEnd, -apEnd]);
    var q14mc = mcAmount(supplierPayments, [purchases, apBeg, cogs]);
    var q17mc = mcSigned(adjITP,       [-itpChange, itpEnd, -itpEnd]);
    var q18mc = mcAmount(taxesPaid,    [taxExpense, itpBeg, itpEnd]);
    var q20mc = mcAmount(netOpCash,    [netIncome, netIncome + adjDepr, netOpCash + Math.abs(equipGain) * 2 + 1000]);

    return {
      data: {
        netIncome: netIncome, dividends: dividends,
        arBeg: arBeg, arEnd: arEnd, invBeg: invBeg, invEnd: invEnd,
        apBeg: apBeg, apEnd: apEnd, itpBeg: itpBeg, itpEnd: itpEnd,
        cogs: cogs, taxExpense: taxExpense,
        purchases: purchases, supplierPayments: supplierPayments, taxesPaid: taxesPaid,
        accumDepBeg: accumDepBeg, accumDepEnd: accumDepEnd,
        equipCost: equipCost, equipAccumDep: equipAccumDep,
        equipSalePrice: equipSalePrice, equipGain: equipGain,
        deprExpense: deprExpense, netOpCash: netOpCash
      },
      dataTable: [
        ["Net income (computed in Q2)", fmtPlain(netIncome)],
        ["Cash dividends paid", fmtPlain(dividends)],
        ["Retained earnings — beginning", fmtPlain(reBeg)],
        ["Retained earnings — ending", fmtPlain(reEnd)],
        ["Cost of goods sold (COGS)", fmtPlain(cogs)],
        ["Income tax expense", fmtPlain(taxExpense)],
        ["Accounts receivable — beginning", fmtPlain(arBeg)],
        ["Accounts receivable — ending", fmtPlain(arEnd)],
        ["Inventory — beginning", fmtPlain(invBeg)],
        ["Inventory — ending", fmtPlain(invEnd)],
        ["Accounts payable — beginning", fmtPlain(apBeg)],
        ["Accounts payable — ending", fmtPlain(apEnd)],
        ["Income taxes payable — beginning", fmtPlain(itpBeg)],
        ["Income taxes payable — ending", fmtPlain(itpEnd)],
        ["Accumulated depreciation — beginning", fmtPlain(accumDepBeg)],
        ["Accumulated depreciation — ending", fmtPlain(accumDepEnd)],
        ["Equipment sold: original cost", fmtPlain(equipCost)],
        ["Equipment sold: accumulated depreciation at sale", fmtPlain(equipAccumDep)],
        ["Equipment sold: cash received from sale", fmtPlain(equipSalePrice)]
      ],
      questions: [
        {
          title: "Q1 — Starting point of the indirect method",
          steps: [{
            inst: "Where does the operating activities section begin when using the indirect method?",
            choices: [
              "A. Cash sales for the year",
              "B. Net income from the income statement",
              "C. Gross profit",
              "D. Total revenues"
            ],
            correct: 1,
            exp: "The indirect method starts with net income and adjusts it for non-cash items and changes in working capital to arrive at cash from operations.",
            result: "Start with: Net income",
            formula: "Indirect method begins with Net Income",
            numbers: "No numbers needed — conceptual step"
          }]
        },
        {
          title: "Q2 — Net income for the year",
          steps: [{
            inst: "What was the company's net income for the year?",
            choices: q2mc.choices,
            correct: q2mc.correct,
            exp: "Change in retained earnings + dividends paid = " + fmtPlain(reEnd - reBeg) + " + " + fmtPlain(dividends) + " = " + fmtPlain(netIncome) + ".",
            result: "Net income = " + fmtPlain(netIncome),
            formula: "Net Income = (Ending RE − Beginning RE) + Dividends Paid",
            numbers: "Beg RE = " + fmtPlain(reBeg) + ", End RE = " + fmtPlain(reEnd) + ", Dividends = " + fmtPlain(dividends)
          }]
        },
        {
          title: "Q3 — Treatment of depreciation",
          steps: [{
            inst: "How is depreciation expense treated when reconciling net income to cash from operating activities?",
            choices: [
              "A. Subtract it because it represents a cash outflow",
              "B. Add it back because it is a non-cash expense",
              "C. Ignore it — depreciation belongs only in investing activities",
              "D. Add it to dividends paid"
            ],
            correct: 1,
            exp: "Depreciation reduced net income but no cash actually left the company. Adding it back removes its non-cash effect.",
            result: "Treatment: Add depreciation back to net income",
            formula: "Add back non-cash expenses (Depreciation, Amortization)",
            numbers: "No numbers needed — conceptual step"
          }]
        },
        {
          title: "Q4 — Depreciation expense for the year",
          steps: [{
            inst: "What was the depreciation expense recorded during the year?",
            choices: q4mc.choices,
            correct: q4mc.correct,
            exp: "Depr = (End Accum Dep − Beg Accum Dep) + Accum Dep removed on sold equipment = " + fmtPlain(accumDepEnd - accumDepBeg) + " + " + fmtPlain(equipAccumDep) + " = " + fmtPlain(deprExpense) + ".",
            result: "Depreciation expense = " + fmtPlain(deprExpense),
            formula: "Depreciation = ΔAccumulated Depreciation + Accum. Dep. removed on disposed assets",
            numbers: "Beg Accum Dep = " + fmtPlain(accumDepBeg) + ", End Accum Dep = " + fmtPlain(accumDepEnd) + ", Accum Dep on sold equipment = " + fmtPlain(equipAccumDep)
          }]
        },
        {
          title: "Q5 — Treatment of a gain on sale of equipment",
          steps: [{
            inst: "When equipment is sold at a gain, how is that gain handled in the operating section of the indirect-method cash flow statement?",
            choices: [
              "A. Added to net income",
              "B. Subtracted from net income",
              "C. Reported only as an investing outflow",
              "D. Ignored — gains have no effect"
            ],
            correct: 1,
            exp: "The full cash received appears in investing activities. The gain already inflated net income, so we subtract it from net income in operating to avoid double-counting.",
            result: "Treatment: Subtract gain from net income",
            formula: "Subtract gains (add losses) on sale of long-term assets",
            numbers: "No numbers needed — conceptual step"
          }]
        },
        {
          title: "Q6 — Gain or loss on sale of equipment",
          steps: [{
            inst: "Compute the gain or loss on the sale of the equipment.",
            choices: q6mc.choices,
            correct: q6mc.correct,
            exp: "Book Value = " + fmtPlain(equipCost) + " − " + fmtPlain(equipAccumDep) + " = " + fmtPlain(equipBookValue) + ". Gain = " + fmtPlain(equipSalePrice) + " − " + fmtPlain(equipBookValue) + " = " + fmtPlain(equipGain) + ".",
            result: (equipGain >= 0 ? "Gain" : "Loss") + " on sale = " + fmtPlain(Math.abs(equipGain)),
            formula: "Gain (Loss) on Sale = Sale Price − (Cost − Accumulated Depreciation)",
            numbers: "Original cost = " + fmtPlain(equipCost) + ", Accumulated depreciation = " + fmtPlain(equipAccumDep) + ", Sale price = " + fmtPlain(equipSalePrice)
          }]
        },
        {
          title: "Q7 — Direction of the accounts receivable adjustment",
          steps: [{
            inst: "Accounts receivable changed during the year. How does the change in AR affect the reconciliation from net income to operating cash flow?",
            choices: [
              "A. Add a decrease; subtract an increase",
              "B. Subtract a decrease; add an increase",
              "C. Always add the change",
              "D. Always subtract the change"
            ],
            correct: 0,
            exp: "AR is a current asset. A decrease in AR adds to net income (more collected than billed); an increase in AR subtracts (less collected than billed).",
            result: "Direction: Decrease in CA → ADD; Increase in CA → SUBTRACT",
            formula: "Decrease in Current Asset → ADD; Increase in Current Asset → SUBTRACT",
            numbers: "No numbers needed — conceptual step"
          }]
        },
        {
          title: "Q8 — Amount of the accounts receivable adjustment",
          steps: [{
            inst: "What is the amount and direction of the accounts receivable adjustment to net income?",
            choices: q8mc.choices,
            correct: q8mc.correct,
            exp: "AR went from " + fmtPlain(arBeg) + " to " + fmtPlain(arEnd) + ", a decrease of " + fmtPlain(arBeg - arEnd) + ". Decrease in current asset → ADD to net income.",
            result: "AR adjustment: " + fmtPlain(Math.abs(adjAR)) + (adjAR > 0 ? " added" : " deducted"),
            formula: "Decrease in Current Asset → ADD to Net Income",
            numbers: "Beg AR = " + fmtPlain(arBeg) + ", End AR = " + fmtPlain(arEnd)
          }]
        },
        {
          title: "Q9 — What the AR change represents",
          steps: [{
            inst: "What does a decrease in accounts receivable represent in cash terms?",
            choices: [
              "A. Cash collected from customers was LESS than credit sales",
              "B. Cash collected from customers was MORE than credit sales",
              "C. Cash payments to suppliers were less than purchases",
              "D. The company wrote off some receivables"
            ],
            correct: 1,
            exp: "AR going down means collections outpaced new credit sales — more cash came in than was reported as sales revenue.",
            result: "AR decrease means: Cash collected from customers > Credit sales",
            formula: "AR decrease → Cash collected > Credit sales (add to NI)",
            numbers: "Refer to AR balances in the data table"
          }]
        },
        {
          title: "Q10 — Inventory adjustment to net income",
          steps: [{
            inst: "What is the amount and direction of the inventory adjustment to net income?",
            choices: q10mc.choices,
            correct: q10mc.correct,
            exp: "Inventory went from " + fmtPlain(invBeg) + " to " + fmtPlain(invEnd) + ", an increase of " + fmtPlain(invEnd - invBeg) + ". Increase in current asset → SUBTRACT from net income.",
            result: "Inventory adjustment: " + fmtPlain(Math.abs(adjInv)) + (adjInv > 0 ? " added" : " deducted"),
            formula: "Increase in Current Asset → SUBTRACT from Net Income",
            numbers: "Beg Inventory = " + fmtPlain(invBeg) + ", End Inventory = " + fmtPlain(invEnd)
          }]
        },
        {
          title: "Q11 — Total inventory purchases (debits to Inventory T-account)",
          steps: [{
            inst: "If the company debited cost of goods sold and credited inventory during the year, what is the total amount of inventory purchases recorded on the debit side of the Inventory T-account?",
            choices: q11mc.choices,
            correct: q11mc.correct,
            exp: "Inventory T-account: Beg + Purchases − COGS = End → Purchases = COGS + (End − Beg) = " + fmtPlain(cogs) + " + " + fmtPlain(invChange) + " = " + fmtPlain(purchases) + ".",
            result: "Total purchases = " + fmtPlain(purchases),
            formula: "Inventory Purchases = COGS + (End Inventory − Beg Inventory)",
            numbers: "COGS = " + fmtPlain(cogs) + ", Beg Inv = " + fmtPlain(invBeg) + ", End Inv = " + fmtPlain(invEnd)
          }]
        },
        {
          title: "Q12 — What the inventory change represents",
          steps: [{
            inst: "What does an increase in inventory represent in cash terms?",
            choices: [
              "A. Inventory purchases were less than cost of goods sold",
              "B. Inventory purchases were greater than cost of goods sold",
              "C. Customers returned more goods than they purchased",
              "D. The company stopped restocking"
            ],
            correct: 1,
            exp: "Higher ending inventory means more was purchased than was sold (COGS). The extra purchases used cash that net income doesn't reflect.",
            result: "Inventory increase means: Purchases > COGS",
            formula: "Inventory increase → Purchases > COGS (subtract from NI)",
            numbers: "Refer to inventory balances in the data table"
          }]
        },
        {
          title: "Q13 — Accounts payable adjustment",
          steps: [{
            inst: "What is the amount and direction of the accounts payable adjustment to net income?",
            choices: q13mc.choices,
            correct: q13mc.correct,
            exp: "AP went from " + fmtPlain(apBeg) + " to " + fmtPlain(apEnd) + ", a decrease of " + fmtPlain(apBeg - apEnd) + ". Decrease in current liability → SUBTRACT from net income.",
            result: "AP adjustment: " + fmtPlain(Math.abs(adjAP)) + (adjAP > 0 ? " added" : " deducted"),
            formula: "Decrease in Current Liability → SUBTRACT from Net Income",
            numbers: "Beg AP = " + fmtPlain(apBeg) + ", End AP = " + fmtPlain(apEnd)
          }]
        },
        {
          title: "Q14 — Cash paid to suppliers (debits to AP T-account)",
          steps: [{
            inst: "What is the total amount of debits recorded in the Accounts Payable T-account during the year?",
            choices: q14mc.choices,
            correct: q14mc.correct,
            exp: "AP T-account: Beg + Purchases (credit) − Payments (debit) = End → Payments = Beg AP + Purchases − End AP = " + fmtPlain(apBeg) + " + " + fmtPlain(purchases) + " − " + fmtPlain(apEnd) + " = " + fmtPlain(supplierPayments) + ".",
            result: "Cash paid to suppliers = " + fmtPlain(supplierPayments),
            formula: "Cash Paid to Suppliers = Beg AP + Purchases − End AP",
            numbers: "Beg AP = " + fmtPlain(apBeg) + ", Purchases = " + fmtPlain(purchases) + ", End AP = " + fmtPlain(apEnd)
          }]
        },
        {
          title: "Q15 — What the debits to AP represent",
          steps: [{
            inst: "What do the debits to the Accounts Payable T-account represent?",
            choices: [
              "A. Sales on credit",
              "B. Inventory purchases on account",
              "C. Cash payments to suppliers",
              "D. Bad debt write-offs"
            ],
            correct: 2,
            exp: "Credits to AP are inventory purchases on account; debits to AP are cash payments to suppliers that pay down the liability.",
            result: "Debits to AP = Cash payments to suppliers",
            formula: "AP T-account: Credits = Purchases on account; Debits = Cash payments to suppliers",
            numbers: "No numbers needed — conceptual step"
          }]
        },
        {
          title: "Q16 — Combined Inventory + AP interpretation",
          steps: [{
            inst: "Inventory increased and accounts payable decreased during the year. What does the combined adjustment to net income represent in cash terms?",
            choices: [
              "A. Cash paid to suppliers was less than cost of goods sold",
              "B. Cash paid to suppliers was greater than cost of goods sold",
              "C. Cash collected from customers was less than credit sales",
              "D. The company stopped buying inventory"
            ],
            correct: 1,
            exp: "More inventory bought (purchases > COGS) AND more cash paid down on AP (payments > purchases). Both push cash outflow above the COGS shown in the income statement.",
            result: "Combined adj. means: Cash paid to suppliers > COGS",
            formula: "Inventory ↑ + AP ↓ → Cash paid to suppliers > COGS (both subtract)",
            numbers: "Refer to inventory and AP balances in the data table"
          }]
        },
        {
          title: "Q17 — Income taxes payable adjustment",
          steps: [{
            inst: "What is the amount and direction of the income taxes payable adjustment to net income?",
            choices: q17mc.choices,
            correct: q17mc.correct,
            exp: "Income taxes payable went from " + fmtPlain(itpBeg) + " to " + fmtPlain(itpEnd) + ", a decrease of " + fmtPlain(itpBeg - itpEnd) + ". Decrease in current liability → SUBTRACT from net income.",
            result: "ITP adjustment: " + fmtPlain(Math.abs(adjITP)) + (adjITP > 0 ? " added" : " deducted"),
            formula: "Decrease in Current Liability → SUBTRACT from Net Income",
            numbers: "Beg ITP = " + fmtPlain(itpBeg) + ", End ITP = " + fmtPlain(itpEnd)
          }]
        },
        {
          title: "Q18 — Cash paid for income taxes (debits to ITP T-account)",
          steps: [{
            inst: "What is the total amount of debits recorded in the Income Taxes Payable T-account during the year?",
            choices: q18mc.choices,
            correct: q18mc.correct,
            exp: "ITP T-account: Beg + Tax Expense (credit) − Cash Paid (debit) = End → Cash Paid = Beg ITP + Tax Expense − End ITP = " + fmtPlain(itpBeg) + " + " + fmtPlain(taxExpense) + " − " + fmtPlain(itpEnd) + " = " + fmtPlain(taxesPaid) + ".",
            result: "Cash paid for income taxes = " + fmtPlain(taxesPaid),
            formula: "Cash Paid for Income Taxes = Beg ITP + Tax Expense − End ITP",
            numbers: "Beg ITP = " + fmtPlain(itpBeg) + ", Tax expense = " + fmtPlain(taxExpense) + ", End ITP = " + fmtPlain(itpEnd)
          }]
        },
        {
          title: "Q19 — What the debits to ITP represent",
          steps: [{
            inst: "What do the debits to the Income Taxes Payable T-account represent?",
            choices: [
              "A. Tax expense recorded for the year",
              "B. Refunds received from the IRS",
              "C. Cash paid for income taxes",
              "D. Adjustments to deferred taxes"
            ],
            correct: 2,
            exp: "Credits to ITP are tax expense (the accrual). Debits are the cash actually paid to the government that reduces the liability.",
            result: "Debits to ITP = Cash paid for income taxes",
            formula: "ITP T-account: Credits = Tax Expense; Debits = Cash paid for income taxes",
            numbers: "No numbers needed — conceptual step"
          }]
        },
        {
          title: "Q20 — Net cash provided by operating activities",
          steps: [{
            inst: "Combining net income with depreciation, the gain on sale, and all working capital changes, what is the net cash provided by operating activities for the year?",
            choices: q20mc.choices,
            correct: q20mc.correct,
            exp: "NI " + fmtPlain(netIncome) + " + Depr " + fmtPlain(adjDepr) + " − Gain " + fmtPlain(equipGain) + " + ΔAR " + fmtPlain(adjAR) + " + ΔInv " + fmtPlain(adjInv) + " + ΔAP " + fmtPlain(adjAP) + " + ΔITP " + fmtPlain(adjITP) + " = " + fmtPlain(netOpCash) + ".",
            result: "Net cash from operations = " + fmtPlain(netOpCash),
            formula: "Net Operating Cash = NI + Depr − Gains + Losses + Decreases in CA − Increases in CA + Increases in CL − Decreases in CL",
            numbers: "All net income and balance sheet values are in the data table"
          }]
        }
      ]
    };
  }
};
