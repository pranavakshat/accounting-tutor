window.CH1 = {
  title: "Chapter 1 — Cost Classification",
  description: "Product vs period costs, fixed vs variable, direct vs indirect",
  formulas: [
    "Product Costs: DM + DL + Manufacturing Overhead (attached to inventory)",
    "Period Costs: Selling & Admin expenses (expensed immediately)",
    "Variable Costs: Change in total proportionally with output",
    "Fixed Costs: Remain constant in total regardless of output",
    "Direct Costs: Can be traced directly to a cost object",
    "Indirect Costs: Cannot be traced directly — allocated (e.g. overhead)"
  ],
  definitions: [
    { q: "Which of the following is a period cost?", choices: ["A. Direct materials", "B. Manufacturing overhead", "C. Sales commissions", "D. Direct labor"], correct: 2, exp: "Sales commissions are a selling expense — a period cost expensed in the period incurred. DM, DL, and MOH are product costs." },
    { q: "As production increases, total variable cost:", choices: ["A. Stays the same", "B. Increases proportionally", "C. Decreases per unit", "D. Is impossible to predict"], correct: 1, exp: "Total variable cost increases proportionally with output. If you make twice as many units, total variable cost doubles." },
    { q: "Factory rent is an example of:", choices: ["A. Variable cost", "B. Direct cost", "C. Period cost", "D. Fixed manufacturing overhead"], correct: 3, exp: "Factory rent is fixed (doesn't change with output) and manufacturing (product cost), so it's fixed manufacturing overhead." },
    { q: "Which cost is BOTH a product cost and a direct cost?", choices: ["A. Factory supervisor salary", "B. Depreciation on factory equipment", "C. Direct materials", "D. Property taxes on factory"], correct: 2, exp: "Direct materials can be directly traced to specific products (direct cost) and are part of the product (product cost)." },
    { q: "The salary of a factory janitor is best classified as:", choices: ["A. Direct labor", "B. Period cost", "C. Variable cost", "D. Manufacturing overhead"], correct: 3, exp: "Janitor salary is part of the manufacturing facility but can't be traced to specific products — it's indirect, so it's manufacturing overhead." }
  ],
  generate: function() {
    // Ch1 is mostly conceptual — return definition-style questions with randomized order
    return {
      data: {},
      dataTable: [],
      questions: this.definitions.map((d, i) => ({
        title: "Q" + (i + 1) + " — Cost Classification",
        steps: [{ inst: d.q, choices: d.choices, correct: d.correct, exp: d.exp, result: d.choices[d.correct], formula: "Product costs: DM, DL, MOH | Period costs: Selling & Admin", numbers: "N/A — conceptual question" }]
      }))
    };
  }
};
