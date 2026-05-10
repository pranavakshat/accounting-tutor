window.CH9 = {
  title: "Chapter 9 — Variance Analysis",
  description: "Materials and labor price/quantity/rate/efficiency variances",
  formulas: [
    "Materials Price Variance = (Actual Price − Standard Price) × Actual Quantity Purchased",
    "Materials Quantity Variance = (Actual Qty Used − Standard Qty Allowed) × Standard Price",
    "Labor Rate Variance = (Actual Rate − Standard Rate) × Actual Hours Worked",
    "Labor Efficiency Variance = (Actual Hours − Standard Hours Allowed) × Standard Rate",
    "Favorable (F) = Actual cost LESS than standard (good)",
    "Unfavorable (U) = Actual cost MORE than standard (bad)"
  ],
  definitions: [
    { q: "A favorable variance means:", choices: ["A. The company produced more than planned", "B. Actual cost was less than standard cost", "C. Actual cost was more than standard cost", "D. The variance is zero"], correct: 1, exp: "Favorable = good news. Actual cost came in BELOW standard — you spent less than expected." },
    { q: "The materials quantity variance focuses on:", choices: ["A. The price paid per pound of material", "B. How much material was used vs. how much should have been used", "C. The total materials cost vs. budget", "D. The purchase price vs. market price"], correct: 1, exp: "Quantity variance = (Actual qty used − Standard qty allowed) × Standard price. It isolates efficiency of material usage." }
  ],
  generate: function() {
    var stdPrices = [3, 4, 5, 6, 8, 10];
    var stdQtyPerUnit = [2, 3, 4, 5, 6];
    var actualUnits = [4000, 5000, 6000, 8000, 10000];

    var stdPrice = stdPrices[Math.floor(Math.random() * stdPrices.length)];
    var stdQty = stdQtyPerUnit[Math.floor(Math.random() * stdQtyPerUnit.length)];
    var unitsProduced = actualUnits[Math.floor(Math.random() * actualUnits.length)];

    var stdQtyAllowed = unitsProduced * stdQty;

    var priceVariances = [-0.5, -0.25, 0.25, 0.50];
    var priceVariance = priceVariances[Math.floor(Math.random() * priceVariances.length)];
    var actualPrice = stdPrice + priceVariance;

    var qtyVariancePcts = [-0.05, -0.02, 0.03, 0.06];
    var qtyVariancePct = qtyVariancePcts[Math.floor(Math.random() * qtyVariancePcts.length)];
    var actualQtyUsed = Math.round(stdQtyAllowed * (1 + qtyVariancePct));
    var actualQtyPurchased = Math.round(actualQtyUsed * 1.1);

    var mpv = (actualPrice - stdPrice) * actualQtyPurchased;
    var mqv = (actualQtyUsed - stdQtyAllowed) * stdPrice;

    var stdRates = [10, 12, 14, 15, 18];
    var stdHoursPerUnit = [1, 1.5, 2, 2.5, 3];
    var stdRate = stdRates[Math.floor(Math.random() * stdRates.length)];
    var stdHoursUnit = stdHoursPerUnit[Math.floor(Math.random() * stdHoursPerUnit.length)];
    var stdHoursAllowed = unitsProduced * stdHoursUnit;

    var rateVariances = [-1, -0.5, 0.5, 1];
    var rateVariance = rateVariances[Math.floor(Math.random() * rateVariances.length)];
    var actualRate = stdRate + rateVariance;

    var effVariancePcts = [-0.04, -0.02, 0.03, 0.05];
    var effVariancePct = effVariancePcts[Math.floor(Math.random() * effVariancePcts.length)];
    var actualHours = Math.round(stdHoursAllowed * (1 + effVariancePct));

    var lrv = (actualRate - stdRate) * actualHours;
    var lev = (actualHours - stdHoursAllowed) * stdRate;

    var fmt = function(n) { return '$' + Math.abs(n).toLocaleString(); };
    var fav = function(n) { return n <= 0 ? 'Favorable (F)' : 'Unfavorable (U)'; };

    function mc(correct, wrongs) {
      var absCorrect = Math.abs(correct);
      var pool = [absCorrect].concat(wrongs.map(function(w) { return Math.abs(w); }).filter(function(w) { return w !== absCorrect; })).slice(0, 4);
      while (pool.length < 4) pool.push(Math.round(absCorrect * 1.1 * pool.length + 50));
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var letters = ['A', 'B', 'C', 'D'];
      return { choices: s.map(function(v, i) { return letters[i] + '. ' + fmt(Math.round(v)); }), correct: s.indexOf(absCorrect) };
    }

    function mcUnits(correct, wrongs) {
      var pool = [correct].concat(wrongs.filter(function(w) { return w !== correct && w > 0; })).slice(0, 4);
      while (pool.length < 4) pool.push(correct + pool.length * 500);
      var s = pool.slice(0, 4).sort(function() { return Math.random() - 0.5; });
      var letters = ['A', 'B', 'C', 'D'];
      return { choices: s.map(function(v, i) { return letters[i] + '. ' + Math.round(v).toLocaleString(); }), correct: s.indexOf(correct) };
    }

    // Precompute all mc() results to avoid double-call shuffle bug
    var q1mc = mc(mpv, [mqv, mpv * 2, Math.abs(actualQtyUsed * (actualPrice - stdPrice))]);
    var q2mc = mcUnits(stdQtyAllowed, [actualQtyUsed, actualQtyPurchased, stdQtyAllowed + 1000]);
    var q3mc = mc(mqv, [mpv, mqv * 2, Math.abs(actualQtyPurchased - stdQtyAllowed) * stdPrice]);
    var q4mc = mcUnits(stdHoursAllowed, [actualHours, stdHoursAllowed + unitsProduced, Math.round(stdHoursAllowed * 0.9)]);
    var q5mc = mc(lrv, [lev, lrv * 2, Math.abs(stdHoursAllowed * (actualRate - stdRate))]);
    var q6mc = mc(lev, [lrv, lev * 2, Math.abs((actualHours - stdHoursAllowed) * actualRate)]);
    var q9 = (function() {
      var actual = Math.round(actualPrice * actualQtyPurchased);
      var std = Math.round(stdPrice * actualQtyPurchased);
      var pool = [actual, std, Math.round(actualPrice*actualQtyUsed), Math.round(stdPrice*stdQtyAllowed)].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
      while(pool.length<4) pool.push(actual+pool.length*500);
      var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return {choices:s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}),correct:s.indexOf(actual)};
    })();
    var q10 = (function() {
      var std = Math.round(stdPrice * stdQtyAllowed);
      var pool = [std, Math.round(actualPrice*actualQtyUsed), Math.round(stdPrice*actualQtyUsed), Math.round(actualPrice*stdQtyAllowed)].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
      while(pool.length<4) pool.push(std+pool.length*500);
      var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return {choices:s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}),correct:s.indexOf(std)};
    })();
    var q11 = (function() {
      var actual = Math.round(actualRate * actualHours);
      var pool = [actual, Math.round(stdRate*actualHours), Math.round(actualRate*stdHoursAllowed), Math.round(stdRate*stdHoursAllowed)].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
      while(pool.length<4) pool.push(actual+pool.length*500);
      var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return {choices:s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}),correct:s.indexOf(actual)};
    })();
    var q12 = (function() {
      var std = Math.round(stdRate * stdHoursAllowed);
      var pool = [std, Math.round(actualRate*actualHours), Math.round(stdRate*actualHours), Math.round(actualRate*stdHoursAllowed)].filter(function(v,i,a){return a.indexOf(v)===i&&v>0;}).slice(0,4);
      while(pool.length<4) pool.push(std+pool.length*500);
      var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      return {choices:s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v);}),correct:s.indexOf(std)};
    })();

    // Q7: Total Materials Variance — only correct answer gets F/U label
    var q7 = (function() {
      var total = Math.round(mpv + mqv);
      var absTotal = Math.abs(total);
      var fuLabel = total <= 0 ? '(F)' : '(U)';
      var pool = [absTotal, Math.abs(Math.round(mpv)), Math.abs(Math.round(mqv)), Math.abs(Math.round(mpv-mqv))].filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,4);
      while(pool.length<4) pool.push(absTotal+pool.length*100);
      var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      var correctIdx = s.indexOf(absTotal);
      return {choices:s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v)+(i===correctIdx?' '+fuLabel:'');}),correct:correctIdx};
    })();

    // Q8: Total Labor Variance — only correct answer gets F/U label
    var q8 = (function() {
      var total = Math.round(lrv + lev);
      var absTotal = Math.abs(total);
      var fuLabel = total <= 0 ? '(F)' : '(U)';
      var pool = [absTotal, Math.abs(Math.round(lrv)), Math.abs(Math.round(lev)), Math.abs(Math.round(lrv-lev))].filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,4);
      while(pool.length<4) pool.push(absTotal+pool.length*100);
      var s=pool.slice(0,4).sort(function(){return Math.random()-0.5;});
      var correctIdx = s.indexOf(absTotal);
      return {choices:s.map(function(v,i){return ['A','B','C','D'][i]+'. '+fmt(v)+(i===correctIdx?' '+fuLabel:'');}),correct:correctIdx};
    })();

    return {
      data: { stdPrice: stdPrice, actualPrice: actualPrice, stdQty: stdQty, actualQtyUsed: actualQtyUsed, actualQtyPurchased: actualQtyPurchased, stdQtyAllowed: stdQtyAllowed, stdRate: stdRate, actualRate: actualRate, stdHoursUnit: stdHoursUnit, stdHoursAllowed: stdHoursAllowed, actualHours: actualHours, unitsProduced: unitsProduced },
      dataTable: [
        ["Units produced", unitsProduced.toLocaleString()],
        ["Standard material price", fmt(stdPrice) + "/lb"],
        ["Actual material price", fmt(actualPrice) + "/lb"],
        ["Standard qty per unit", stdQty + " lbs"],
        ["Actual qty purchased", actualQtyPurchased.toLocaleString() + " lbs"],
        ["Actual qty used", actualQtyUsed.toLocaleString() + " lbs"],
        ["Standard labor rate", fmt(stdRate) + "/hr"],
        ["Actual labor rate", fmt(actualRate) + "/hr"],
        ["Standard hours per unit", stdHoursUnit + " hrs"],
        ["Actual hours worked", actualHours.toLocaleString() + " hrs"]
      ],
      questions: [
        {
          title: "Q1 — Materials Price Variance",
          steps: [{
            inst: "What is the materials price variance?",
            choices: q1mc.choices,
            correct: q1mc.correct,
            exp: "(" + fmt(actualPrice) + " − " + fmt(stdPrice) + ") × " + actualQtyPurchased.toLocaleString() + " lbs purchased = " + fmt(Math.round(mpv)) + " " + fav(mpv),
            result: "MPV = " + fmt(Math.round(mpv)) + " " + fav(mpv),
            formula: "MPV = (Actual Price − Standard Price) × Actual Quantity Purchased",
            numbers: "Actual price = " + fmt(actualPrice) + ", Std price = " + fmt(stdPrice) + ", Actual qty purchased = " + actualQtyPurchased.toLocaleString()
          }]
        },
        {
          title: "Q2 — Standard Quantity Allowed",
          steps: [{
            inst: "How many pounds of material should have been used for actual production?",
            choices: q2mc.choices,
            correct: q2mc.correct,
            exp: unitsProduced.toLocaleString() + " units × " + stdQty + " lbs/unit = " + stdQtyAllowed.toLocaleString() + " lbs",
            result: "Std qty allowed = " + stdQtyAllowed.toLocaleString() + " lbs",
            formula: "Standard Qty Allowed = Units Produced × Standard Qty per Unit",
            numbers: "Units produced = " + unitsProduced.toLocaleString() + ", Std qty/unit = " + stdQty + " lbs"
          }]
        },
        {
          title: "Q3 — Materials Quantity Variance",
          steps: [{
            inst: "What is the materials quantity variance?",
            choices: q3mc.choices,
            correct: q3mc.correct,
            exp: "(" + actualQtyUsed.toLocaleString() + " − " + stdQtyAllowed.toLocaleString() + ") × $" + stdPrice + "/lb = " + fmt(Math.round(mqv)) + " " + fav(mqv),
            result: "MQV = " + fmt(Math.round(mqv)) + " " + fav(mqv),
            formula: "MQV = (Actual Qty Used − Std Qty Allowed) × Standard Price",
            numbers: "Actual qty used = " + actualQtyUsed.toLocaleString() + ", Std qty allowed = " + stdQtyAllowed.toLocaleString() + ", Std price = " + fmt(stdPrice)
          }]
        },
        {
          title: "Q4 — Standard Hours Allowed",
          steps: [{
            inst: "How many direct labor hours should have been worked for actual production?",
            choices: q4mc.choices,
            correct: q4mc.correct,
            exp: unitsProduced.toLocaleString() + " units × " + stdHoursUnit + " hr/unit = " + stdHoursAllowed.toLocaleString() + " hrs",
            result: "Std hrs allowed = " + stdHoursAllowed.toLocaleString() + " hrs",
            formula: "Standard Hours Allowed = Units Produced × Standard Hours per Unit",
            numbers: "Units produced = " + unitsProduced.toLocaleString() + ", Std hours/unit = " + stdHoursUnit
          }]
        },
        {
          title: "Q5 — Labor Rate Variance",
          steps: [{
            inst: "What is the labor rate variance?",
            choices: q5mc.choices,
            correct: q5mc.correct,
            exp: "(" + fmt(actualRate) + " − " + fmt(stdRate) + ") × " + actualHours.toLocaleString() + " actual hrs = " + fmt(Math.round(lrv)) + " " + fav(lrv),
            result: "LRV = " + fmt(Math.round(lrv)) + " " + fav(lrv),
            formula: "LRV = (Actual Rate − Standard Rate) × Actual Hours Worked",
            numbers: "Actual rate = " + fmt(actualRate) + ", Std rate = " + fmt(stdRate) + ", Actual hours = " + actualHours.toLocaleString()
          }]
        },
        {
          title: "Q6 — Labor Efficiency Variance",
          steps: [{
            inst: "What is the labor efficiency variance?",
            choices: q6mc.choices,
            correct: q6mc.correct,
            exp: "(" + actualHours.toLocaleString() + " − " + stdHoursAllowed.toLocaleString() + ") × $" + stdRate + "/hr = " + fmt(Math.round(lev)) + " " + fav(lev),
            result: "LEV = " + fmt(Math.round(lev)) + " " + fav(lev),
            formula: "LEV = (Actual Hours − Standard Hours Allowed) × Standard Rate",
            numbers: "Actual hrs = " + actualHours.toLocaleString() + ", Std hrs allowed = " + stdHoursAllowed.toLocaleString() + ", Std rate = " + fmt(stdRate)
          }]
        },
        {
          title: "Q7 — Total Materials Variance",
          steps: [{
            inst: "Materials price variance is " + fmt(Math.round(mpv)) + " " + fav(mpv) + " and materials quantity variance is " + fmt(Math.round(mqv)) + " " + fav(mqv) + ". What is the total materials variance?",
            choices: q7.choices,
            correct: q7.correct,
            exp: "Total Materials Variance = MPV + MQV = " + fmt(Math.abs(Math.round(mpv))) + " " + fav(mpv) + " + " + fmt(Math.abs(Math.round(mqv))) + " " + fav(mqv) + " = " + fmt(Math.abs(Math.round(mpv+mqv))) + " " + (Math.round(mpv+mqv)<=0?'(F)':'(U)'),
            result: "Total Materials Variance = " + fmt(Math.abs(Math.round(mpv+mqv))) + " " + (Math.round(mpv+mqv)<=0?'(F)':'(U)'),
            formula: "Total Materials Variance = MPV + MQV",
            numbers: "MPV = " + fmt(Math.abs(Math.round(mpv))) + " " + fav(mpv) + ", MQV = " + fmt(Math.abs(Math.round(mqv))) + " " + fav(mqv)
          }]
        },
        {
          title: "Q8 — Total Labor Variance",
          steps: [{
            inst: "Labor rate variance is " + fmt(Math.round(lrv)) + " " + fav(lrv) + " and labor efficiency variance is " + fmt(Math.round(lev)) + " " + fav(lev) + ". What is the total labor variance?",
            choices: q8.choices,
            correct: q8.correct,
            exp: "Total Labor Variance = LRV + LEV = " + fmt(Math.abs(Math.round(lrv))) + " " + fav(lrv) + " + " + fmt(Math.abs(Math.round(lev))) + " " + fav(lev) + " = " + fmt(Math.abs(Math.round(lrv+lev))) + " " + (Math.round(lrv+lev)<=0?'(F)':'(U)'),
            result: "Total Labor Variance = " + fmt(Math.abs(Math.round(lrv+lev))) + " " + (Math.round(lrv+lev)<=0?'(F)':'(U)'),
            formula: "Total Labor Variance = LRV + LEV",
            numbers: "LRV = " + fmt(Math.abs(Math.round(lrv))) + " " + fav(lrv) + ", LEV = " + fmt(Math.abs(Math.round(lev))) + " " + fav(lev)
          }]
        },
        {
          title: "Q9 — Actual Materials Cost",
          steps: [{
            inst: "Actual price is " + fmt(actualPrice) + "/lb and actual quantity purchased is " + actualQtyPurchased.toLocaleString() + " lbs. What was the actual materials cost?",
            choices: q9.choices,
            correct: q9.correct,
            exp: fmt(actualPrice) + " × " + actualQtyPurchased.toLocaleString() + " = " + fmt(Math.round(actualPrice*actualQtyPurchased)),
            result: "Actual materials cost = " + fmt(Math.round(actualPrice*actualQtyPurchased)),
            formula: "Actual Cost = Actual Price × Actual Quantity Purchased",
            numbers: "Actual price = " + fmt(actualPrice) + ", Actual qty purchased = " + actualQtyPurchased.toLocaleString()
          }]
        },
        {
          title: "Q10 — Standard Materials Cost Allowed",
          steps: [{
            inst: "Standard price is " + fmt(stdPrice) + "/lb and standard quantity allowed is " + stdQtyAllowed.toLocaleString() + " lbs. What is the standard cost allowed for actual production?",
            choices: q10.choices,
            correct: q10.correct,
            exp: fmt(stdPrice) + " × " + stdQtyAllowed.toLocaleString() + " = " + fmt(Math.round(stdPrice*stdQtyAllowed)),
            result: "Standard cost allowed = " + fmt(Math.round(stdPrice*stdQtyAllowed)),
            formula: "Standard Cost Allowed = Standard Price × Standard Qty Allowed",
            numbers: "Std price = " + fmt(stdPrice) + ", Std qty allowed = " + stdQtyAllowed.toLocaleString()
          }]
        },
        {
          title: "Q11 — Actual Labor Cost",
          steps: [{
            inst: "Actual labor rate is " + fmt(actualRate) + "/hr and " + actualHours.toLocaleString() + " hours were worked. What was the actual labor cost?",
            choices: q11.choices,
            correct: q11.correct,
            exp: fmt(actualRate) + " × " + actualHours.toLocaleString() + " = " + fmt(Math.round(actualRate*actualHours)),
            result: "Actual labor cost = " + fmt(Math.round(actualRate*actualHours)),
            formula: "Actual Labor Cost = Actual Rate × Actual Hours",
            numbers: "Actual rate = " + fmt(actualRate) + ", Actual hours = " + actualHours.toLocaleString()
          }]
        },
        {
          title: "Q12 — Standard Labor Cost Allowed",
          steps: [{
            inst: "Standard rate is " + fmt(stdRate) + "/hr and standard hours allowed is " + stdHoursAllowed.toLocaleString() + " hrs. What is the standard labor cost for actual production?",
            choices: q12.choices,
            correct: q12.correct,
            exp: fmt(stdRate) + " × " + stdHoursAllowed.toLocaleString() + " = " + fmt(Math.round(stdRate*stdHoursAllowed)),
            result: "Standard labor cost allowed = " + fmt(Math.round(stdRate*stdHoursAllowed)),
            formula: "Standard Labor Cost = Standard Rate × Standard Hours Allowed",
            numbers: "Std rate = " + fmt(stdRate) + ", Std hours allowed = " + stdHoursAllowed.toLocaleString()
          }]
        },
        {
          title: "Q13 — Favorable vs Unfavorable Interpretation",
          steps: [{
            inst: "The materials price variance is " + fmt(Math.abs(Math.round(mpv))) + " " + fav(mpv) + ". What does this mean?",
            choices: [
              "A. The company paid " + fmt(Math.abs(Math.round(mpv))) + " more than standard for materials",
              "B. The company paid " + fmt(Math.abs(Math.round(mpv))) + " less than standard for materials",
              "C. The company used " + fmt(Math.abs(Math.round(mpv))) + " more materials than allowed",
              "D. The company used " + fmt(Math.abs(Math.round(mpv))) + " less materials than allowed"
            ],
            correct: mpv < 0 ? 1 : 0,
            exp: (mpv < 0 ? "Favorable MPV means actual price (" + fmt(actualPrice) + ") was LESS than standard (" + fmt(stdPrice) + ") — good news, saved money on purchase price." : "Unfavorable MPV means actual price (" + fmt(actualPrice) + ") was MORE than standard (" + fmt(stdPrice) + ") — overpaid for materials."),
            result: mpv < 0 ? "Paid less than standard (Favorable)" : "Paid more than standard (Unfavorable)",
            formula: "MPV = (Actual Price − Std Price) × Actual Qty. Negative = Favorable",
            numbers: "Actual price = " + fmt(actualPrice) + ", Std price = " + fmt(stdPrice)
          }]
        },
        {
          title: "Q14 — Efficiency Variance Interpretation",
          steps: [{
            inst: "The labor efficiency variance is " + fmt(Math.abs(Math.round(lev))) + " " + fav(lev) + ". What caused this?",
            choices: [
              "A. Workers were paid a different rate than standard",
              "B. Workers took " + (lev > 0 ? "more" : "fewer") + " hours than the standard allowed",
              "C. More units were produced than planned",
              "D. Fixed overhead was over/underapplied"
            ],
            correct: 1,
            exp: "Efficiency variance is driven by HOURS, not rates. " + (lev > 0 ? "Actual hours (" + actualHours.toLocaleString() + ") exceeded standard (" + stdHoursAllowed.toLocaleString() + ") — workers were slower than expected." : "Actual hours (" + actualHours.toLocaleString() + ") were less than standard (" + stdHoursAllowed.toLocaleString() + ") — workers were faster than expected."),
            result: lev > 0 ? "More hours used than standard (Unfavorable)" : "Fewer hours used than standard (Favorable)",
            formula: "LEV = (Actual Hours − Std Hours Allowed) × Std Rate",
            numbers: "Actual hrs = " + actualHours.toLocaleString() + ", Std hrs allowed = " + stdHoursAllowed.toLocaleString()
          }]
        },
        {
          title: "Q15 — Who is Responsible?",
          steps: [{
            inst: "The materials price variance is typically the responsibility of:",
            choices: [
              "A. The production manager",
              "B. The purchasing manager",
              "C. The sales manager",
              "D. The CFO"
            ],
            correct: 1,
            exp: "The purchasing manager controls what price is paid for materials, so they are responsible for the materials price variance. The production manager controls how much material is used (quantity variance).",
            result: "B. The purchasing manager",
            formula: "MPV → Purchasing | MQV → Production | LRV → HR/Payroll | LEV → Production",
            numbers: "N/A — conceptual"
          }]
        }
      ]
    };
  }
};
