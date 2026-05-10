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
  generate: function() {
    var questions = [
      {
        title: "Q1 — Period vs Product Cost",
        steps: [{ inst: "Which of the following is a period cost?", choices: ["A. Direct materials", "B. Manufacturing overhead", "C. Sales commissions", "D. Direct labor"], correct: 2, exp: "Sales commissions are a selling expense — a period cost expensed in the period incurred. DM, DL, and MOH are all product costs.", result: "C. Sales commissions", formula: "Period costs = Selling & Admin expenses | Product costs = DM + DL + MOH", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q2 — Variable Cost Behavior",
        steps: [{ inst: "As production increases, total variable cost:", choices: ["A. Stays the same", "B. Increases proportionally", "C. Decreases per unit", "D. Is impossible to predict"], correct: 1, exp: "Total variable cost increases proportionally with output. If you make twice as many units, total variable cost doubles. Variable cost per unit stays constant.", result: "B. Increases proportionally", formula: "Total Variable Cost = Variable Cost per Unit × Units", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q3 — Fixed Manufacturing Overhead",
        steps: [{ inst: "Factory rent is an example of:", choices: ["A. Variable cost", "B. Direct cost", "C. Period cost", "D. Fixed manufacturing overhead"], correct: 3, exp: "Factory rent is fixed (doesn't change with output) and manufacturing (product cost), so it's fixed manufacturing overhead — a product cost.", result: "D. Fixed manufacturing overhead", formula: "Product costs = DM + DL + MOH (fixed and variable)", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q4 — Direct and Product Cost",
        steps: [{ inst: "Which cost is BOTH a product cost and a direct cost?", choices: ["A. Factory supervisor salary", "B. Depreciation on factory equipment", "C. Direct materials", "D. Property taxes on factory"], correct: 2, exp: "Direct materials can be directly traced to specific products (direct cost) and are included in inventory (product cost). Supervisor salary and depreciation are indirect.", result: "C. Direct materials", formula: "Direct cost = traceable to cost object | Product cost = included in inventory", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q5 — Manufacturing Overhead",
        steps: [{ inst: "The salary of a factory janitor is best classified as:", choices: ["A. Direct labor", "B. Period cost", "C. Variable cost", "D. Manufacturing overhead"], correct: 3, exp: "A janitor supports the manufacturing facility but can't be traced to specific products — it's indirect manufacturing cost, so it's manufacturing overhead.", result: "D. Manufacturing overhead", formula: "MOH = indirect manufacturing costs", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q6 — Prime vs Conversion Costs",
        steps: [{ inst: "Prime costs consist of:", choices: ["A. Direct labor and manufacturing overhead", "B. Direct materials and direct labor", "C. Direct materials and manufacturing overhead", "D. All manufacturing costs"], correct: 1, exp: "Prime costs = Direct Materials + Direct Labor. Conversion costs = Direct Labor + Manufacturing Overhead. Both include direct labor.", result: "B. Direct materials and direct labor", formula: "Prime Costs = DM + DL | Conversion Costs = DL + MOH", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q7 — Conversion Costs",
        steps: [{ inst: "Conversion costs are used to convert raw materials into finished goods. They include:", choices: ["A. Direct materials and direct labor", "B. Direct materials and overhead", "C. Direct labor and manufacturing overhead", "D. Selling costs and overhead"], correct: 2, exp: "Conversion costs = DL + MOH. These are the costs to 'convert' raw materials into a finished product.", result: "C. Direct labor and manufacturing overhead", formula: "Conversion Costs = DL + MOH", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q8 — Fixed Cost per Unit",
        steps: [{ inst: "As production volume increases, the fixed cost per unit:", choices: ["A. Increases", "B. Stays the same", "C. Decreases", "D. Doubles"], correct: 2, exp: "Total fixed costs stay constant, but as more units are produced, the fixed cost gets spread over more units — so fixed cost per unit decreases.", result: "C. Decreases", formula: "Fixed cost per unit = Total Fixed Costs ÷ Units Produced", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q9 — Selling Expense Classification",
        steps: [{ inst: "Advertising expense for a manufacturer is classified as:", choices: ["A. Product cost and fixed cost", "B. Period cost and fixed cost", "C. Manufacturing overhead", "D. Direct cost"], correct: 1, exp: "Advertising is a selling expense — a period cost (expensed immediately, not inventoried). It's typically fixed since it doesn't vary with output.", result: "B. Period cost and fixed cost", formula: "Period costs = Selling & Admin | Product costs = DM + DL + MOH", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q10 — Depreciation Classification",
        steps: [{ inst: "Depreciation on a delivery truck used to ship finished goods to customers is:", choices: ["A. Product cost — manufacturing overhead", "B. Period cost — selling expense", "C. Variable cost", "D. Direct labor cost"], correct: 1, exp: "The delivery truck is used AFTER manufacturing (for delivery to customers), so it's a selling expense — a period cost. Only factory equipment depreciation is a product cost.", result: "B. Period cost — selling expense", formula: "If used in manufacturing = product cost | If used in selling/admin = period cost", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q11 — Direct vs Indirect Labor",
        steps: [{ inst: "A machine operator who works directly on the assembly line is classified as:", choices: ["A. Manufacturing overhead", "B. Period cost", "C. Direct labor", "D. Indirect labor"], correct: 2, exp: "Direct labor consists of workers whose time can be directly and conveniently traced to specific products — like assembly line workers.", result: "C. Direct labor", formula: "Direct labor = workers traceable to specific products", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q12 — Mixed Cost Behavior",
        steps: [{ inst: "A cost that has both a fixed and variable component is called:", choices: ["A. A sunk cost", "B. A mixed cost", "C. A step cost", "D. A period cost"], correct: 1, exp: "Mixed costs (also called semi-variable costs) have a fixed base plus a variable component. Example: electricity — fixed monthly charge + per-kWh charge.", result: "B. A mixed cost", formula: "Mixed Cost = Fixed Component + (Variable Rate × Activity)", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q13 — Opportunity Cost",
        steps: [{ inst: "The benefit given up when choosing one alternative over another is called a(n):", choices: ["A. Sunk cost", "B. Direct cost", "C. Opportunity cost", "D. Period cost"], correct: 2, exp: "Opportunity cost = the value of the best alternative foregone. It's not recorded in accounting but is critical for decision-making.", result: "C. Opportunity cost", formula: "Opportunity Cost = Benefit of best rejected alternative", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q14 — Sunk Cost",
        steps: [{ inst: "A cost that has already been incurred and cannot be recovered is a:", choices: ["A. Variable cost", "B. Sunk cost", "C. Differential cost", "D. Opportunity cost"], correct: 1, exp: "Sunk costs are past costs — already spent, irrecoverable. They should be ignored in future decisions because they don't change regardless of what you decide.", result: "B. Sunk cost", formula: "Sunk costs are irrelevant to future decisions", numbers: "N/A — conceptual" }]
      },
      {
        title: "Q15 — Differential Cost",
        steps: [{ inst: "The difference in cost between two alternatives is called a:", choices: ["A. Fixed cost", "B. Sunk cost", "C. Differential (incremental) cost", "D. Period cost"], correct: 2, exp: "Differential cost = the cost that differs between alternatives. Only differential costs are relevant to decisions — costs that are the same under all alternatives can be ignored.", result: "C. Differential (incremental) cost", formula: "Differential Cost = Cost of Alternative A − Cost of Alternative B", numbers: "N/A — conceptual" }]
      }
    ];

    return {
      data: {},
      dataTable: [],
      questions: questions
    };
  }
};
