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
            choices: mc(mpv, [mqv, mpv * 2, Math.abs(actualQtyUsed * (actualPrice - stdPrice))]).choices,
            correct: mc(mpv, [mqv, mpv * 2, Math.abs(actualQtyUsed * (actualPrice - stdPrice))]).correct,
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
            choices: mcUnits(stdQtyAllowed, [actualQtyUsed, actualQtyPurchased, stdQtyAllowed + 1000]).choices,
            correct: mcUnits(stdQtyAllowed, [actualQtyUsed, actualQtyPurchased, stdQtyAllowed + 1000]).correct,
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
            choices: mc(mqv, [mpv, mqv * 2, Math.abs(actualQtyPurchased - stdQtyAllowed) * stdPrice]).choices,
            correct: mc(mqv, [mpv, mqv * 2, Math.abs(actualQtyPurchased - stdQtyAllowed) * stdPrice]).correct,
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
            choices: mcUnits(stdHoursAllowed, [actualHours, stdHoursAllowed + unitsProduced, Math.round(stdHoursAllowed * 0.9)]).choices,
            correct: mcUnits(stdHoursAllowed, [actualHours, stdHoursAllowed + unitsProduced, Math.round(stdHoursAllowed * 0.9)]).correct,
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
            choices: mc(lrv, [lev, lrv * 2, Math.abs(stdHoursAllowed * (actualRate - stdRate))]).choices,
            correct: mc(lrv, [lev, lrv * 2, Math.abs(stdHoursAllowed * (actualRate - stdRate))]).correct,
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
            choices: mc(lev, [lrv, lev * 2, Math.abs((actualHours - stdHoursAllowed) * actualRate)]).choices,
            correct: mc(lev, [lrv, lev * 2, Math.abs((actualHours - stdHoursAllowed) * actualRate)]).correct,
            exp: "(" + actualHours.toLocaleString() + " − " + stdHoursAllowed.toLocaleString() + ") × $" + stdRate + "/hr = " + fmt(Math.round(lev)) + " " + fav(lev),
            result: "LEV = " + fmt(Math.round(lev)) + " " + fav(lev),
            formula: "LEV = (Actual Hours − Standard Hours Allowed) × Standard Rate",
            numbers: "Actual hrs = " + actualHours.toLocaleString() + ", Std hrs allowed = " + stdHoursAllowed.toLocaleString() + ", Std rate = " + fmt(stdRate)
          }]
        }
      ]
    };
  }
};
