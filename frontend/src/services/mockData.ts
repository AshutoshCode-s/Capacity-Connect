// Clean, core data definitions for CAPACITY CONNECT
import { 
  User, 
  TargetRoleDef, 
  Trainer, 
  TargetedModule, 
  Certificate, 
  ResourceItem, 
  NominationRequest,
  QuestionItem
} from '../types';

export const TARGET_ROLES: Record<string, TargetRoleDef> = {
  "Data Analyst": {
    id: "role_da",
    title: "Data Analyst",
    description: "Extracts insights from structured datasets, models business metrics, and builds executive dashboards.",
    competencies: [
      { name: "Excel", requiredLevel: "L3", description: "Formulas, Index-Match, Pivot Tables, Data Cleaning, and Statistical Modeling" },
      { name: "SQL", requiredLevel: "L3", description: "Complex Queries, Multi-Table Joins, Aggregations, and Window Functions" },
      { name: "Python", requiredLevel: "L3", description: "Pandas Data Wrangling, NumPy, Scripting, and Algorithmic Analysis" },
      { name: "Data Visualization", requiredLevel: "L3", description: "Executive Dashboards, Visual Perception, Power BI/Tableau Storytelling" },
      { name: "Communication", requiredLevel: "L2", description: "Clear Stakeholder Reporting, Technical-to-Business Translation, and Presentations" }
    ]
  },
  "Software Developer": {
    id: "role_sd",
    title: "Software Developer",
    description: "Designs, writes, tests, and maintains robust application software, APIs, and scalable backend services.",
    competencies: [
      { name: "Programming", requiredLevel: "L3", description: "Core OOP/Functional paradigms, Clean Code, Exception Handling, Modular Architecture" },
      { name: "Data Structures & Algorithms", requiredLevel: "L3", description: "Arrays, Stacks, Trees, Graphs, BFS/DFS, and Space-Time Complexity" },
      { name: "Database", requiredLevel: "L2", description: "Relational Modeling, Schema Constraints, CRUD Operations, and Transactions" },
      { name: "Git & Version Control", requiredLevel: "L2", description: "Branching, Merging, Pull Requests, and Conflict Resolution" },
      { name: "Software Testing", requiredLevel: "L2", description: "Unit Testing, Boundary Value Analysis, TDD Principles, and Test Automation" }
    ]
  },
  "Project Manager": {
    id: "role_pm",
    title: "Project Manager",
    description: "Orchestrates cross-functional teams, timelines, risk registers, and stakeholder delivery.",
    competencies: [
      { name: "Project Planning", requiredLevel: "L3", description: "WBS Breakdown, Critical Path Method (CPM), Gantt Charting, and Resource Allocation" },
      { name: "Communication", requiredLevel: "L4", description: "Executive Negotiation, Multi-stakeholder Alignment, Crisis Briefings, and Consensus" },
      { name: "Team Management", requiredLevel: "L3", description: "Task Delegation, Agile/Scrum Facilitation, Mentoring, and Conflict Mitigation" },
      { name: "Risk Management", requiredLevel: "L3", description: "Risk Register, Probability-Impact Scoring, Mitigation Strategy, and Contingency Planning" },
      { name: "Problem Solving", requiredLevel: "L3", description: "Root Cause Analysis (5 Whys, Fishbone), Tradeoff Evaluation, and Decision Trees" }
    ]
  }
};

// 5 realistic diagnostic questions per competency across L1, L2, L3, L4
export const QUESTION_BANK = {
  "Excel": [
    {
      id: "q_ex_1",
      competency: "Excel",
      difficultyLevel: "L1",
      questionType: "Basic Concept",
      question: "Which formula syntax in Microsoft Excel correctly computes the arithmetic average of cells A1 through A10?",
      options: ["=AVG(A1:A10)", "=AVERAGE(A1:A10)", "=MEAN(A1..A10)", "=SUM(A1:A10)/10"],
      correctAnswer: 1,
      explanation: "=AVERAGE(A1:A10) is the standard built-in function to compute the arithmetic mean of a range."
    },
    {
      id: "q_ex_2",
      competency: "Excel",
      difficultyLevel: "L2",
      questionType: "Lookup Application",
      question: "You need to look up an Employee's Department from a table where Employee ID is in Column A and Department is in Column C. Which formula is most accurate?",
      options: [
        "=VLOOKUP(E2, A:C, 3, FALSE)",
        "=VLOOKUP(E2, A:C, 2, TRUE)",
        "=INDEX(A:A, MATCH(E2, C:C, 0))",
        "=LOOKUP(E2, C:C)"
      ],
      correctAnswer: 0,
      explanation: "VLOOKUP with column index 3 and exact match (FALSE/0) searches Column A and returns Column C."
    },
    {
      id: "q_ex_3",
      competency: "Excel",
      difficultyLevel: "L3",
      questionType: "Data Analysis & Error Control",
      question: "A dataset contains occasional '#N/A' errors. How can you calculate the sum of Column B while automatically ignoring any error cells?",
      options: [
        "=AGGREGATE(9, 6, B2:B100)",
        "=SUM(B2:B100, \"IGNORE_NA\")",
        "=TOTAL(B2:B100)",
        "=SUMIF(B2:B100, \"#N/A\")"
      ],
      correctAnswer: 0,
      explanation: "=AGGREGATE(9, 6, B2:B100) applies SUM (function 9) while ignoring all error values (option 6)."
    },
    {
      id: "q_ex_4",
      competency: "Excel",
      difficultyLevel: "L3",
      questionType: "Pivot Table Scenario",
      question: "You need a summary table displaying Total Sales by Region and Quarter, with interactive filters by Product Category. What is the most efficient native tool?",
      options: [
        "Create manual SUMIFS formulas for every permutation",
        "Insert a Pivot Table with Region in Rows, Quarter in Columns, Sales in Values, and Category as a Slicer",
        "Use Text-to-Columns on raw logs",
        "Copy-paste filtered rows manually"
      ],
      correctAnswer: 1,
      explanation: "Pivot Tables with dimensional row/column grouping and interactive Slicers offer instant dynamic summarization."
    },
    {
      id: "q_ex_5",
      competency: "Excel",
      difficultyLevel: "L4",
      questionType: "Advanced Modeling",
      question: "In complex Monte Carlo financial simulations with 50,000 iterative rows, which configuration prevents workbook calculation lag while modifying input assumptions?",
      options: [
        "Set calculation mode to 'Automatic except for Data Tables'",
        "Disable macros completely",
        "Convert all numbers into text format",
        "Hide gridlines to free CPU memory"
      ],
      correctAnswer: 0,
      explanation: "Setting calculation to 'Automatic except for Data Tables' prevents heavy background data table recalculation on every keystroke."
    }
  ],

  "SQL": [
    {
      id: "q_sql_1",
      competency: "SQL",
      difficultyLevel: "L1",
      questionType: "Basic Concept",
      question: "What is the primary function of the SQL 'SELECT' statement?",
      options: [
        "To query and retrieve data records from database tables",
        "To delete database user accounts",
        "To format computer hard drives",
        "To create network socket connections"
      ],
      correctAnswer: 0,
      explanation: "The SELECT statement retrieves records meeting specified filtering and projection criteria."
    },
    {
      id: "q_sql_2",
      competency: "SQL",
      difficultyLevel: "L2",
      questionType: "Filtering & Joining",
      question: "Which query returns all active employees hired in 2023 with a salary above 50,000?",
      options: [
        "SELECT * FROM employees WHERE status = 'Active' AND hire_year = 2023 AND salary > 50000;",
        "GET employees WHERE status = 'Active' OR salary > 50000;",
        "SELECT employees FILTER BY 2023, 50000;",
        "FIND * IN employees WHERE salary > 50000;"
      ],
      correctAnswer: 0,
      explanation: "Standard WHERE clause with AND operator filters records satisfying all conditions simultaneously."
    },
    {
      id: "q_sql_3",
      competency: "SQL",
      difficultyLevel: "L3",
      questionType: "Multi-Table Aggregation",
      question: "How do you calculate Total Revenue per Department, including departments that currently have zero sales?",
      options: [
        "SELECT d.name, COALESCE(SUM(s.amount), 0) FROM departments d LEFT JOIN sales s ON d.id = s.dept_id GROUP BY d.name;",
        "SELECT d.name, SUM(s.amount) FROM departments d INNER JOIN sales s ON d.id = s.dept_id GROUP BY d.name;",
        "SELECT name, TOTAL(amount) FROM sales GROUP BY name;",
        "SELECT d.name FROM departments d FULL OUTER JOIN sales s ON d.id = s.dept_id;"
      ],
      correctAnswer: 0,
      explanation: "LEFT JOIN retains all departments, and COALESCE replaces NULL sums with 0 for departments with no sales records."
    },
    {
      id: "q_sql_4",
      competency: "SQL",
      difficultyLevel: "L3",
      questionType: "Window Function",
      question: "To rank employees by salary within each department without skipping rank numbers in case of ties, which window function is appropriate?",
      options: [
        "DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)",
        "RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)",
        "ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)",
        "NTILE(4) OVER (PARTITION BY dept_id ORDER BY salary DESC)"
      ],
      correctAnswer: 0,
      explanation: "DENSE_RANK() assigns consecutive rank values without gaps when multiple rows have identical salary values."
    },
    {
      id: "q_sql_5",
      competency: "SQL",
      difficultyLevel: "L4",
      questionType: "Query Optimization",
      question: "A query filtering 20 million records with 'WHERE status = ? AND created_at >= ? ORDER BY created_at DESC' is taking 12 seconds. Which composite index provides maximum optimization?",
      options: [
        "INDEX (status, created_at)",
        "INDEX (created_at, status)",
        "INDEX (id)",
        "Single-column indexes on status and created_at separately"
      ],
      correctAnswer: 0,
      explanation: "A composite index with equality column first (status) followed by the range/ordering column (created_at) enables direct index seek and ordered scan."
    }
  ],

  "Python": [
    {
      id: "q_py_1",
      competency: "Python",
      difficultyLevel: "L1",
      questionType: "Syntax & Concept",
      question: "Which of the following built-in data structures in Python is mutable and defined with square brackets?",
      options: ["List", "Tuple", "Set", "Dictionary"],
      correctAnswer: 0,
      explanation: "Lists in Python (e.g. [1, 2, 3]) are ordered and mutable sequences."
    },
    {
      id: "q_py_2",
      competency: "Python",
      difficultyLevel: "L2",
      questionType: "Pandas Implementation",
      question: "Using Pandas, how do you filter a DataFrame 'df' for rows where 'age' > 30 and 'city' is 'Delhi'?",
      options: [
        "df[(df['age'] > 30) & (df['city'] == 'Delhi')]",
        "df.filter(age > 30 and city == 'Delhi')",
        "df[df['age'] > 30 and df['city'] == 'Delhi']",
        "df.select('age' > 30, 'city' == 'Delhi')"
      ],
      correctAnswer: 0,
      explanation: "In Pandas, boolean indexing requires bitwise operator '&' with parentheses wrapping each condition."
    },
    {
      id: "q_py_3",
      competency: "Python",
      difficultyLevel: "L3",
      questionType: "Data Wrangling",
      question: "You have a column with mixed date formats ('2023-01-15' and '15/01/2023'). What is the most reliable way to convert them into DateTime objects?",
      options: [
        "pd.to_datetime(df['date'], format='mixed', errors='coerce')",
        "df['date'].astype(datetime)",
        "df['date'].apply(lambda x: int(x))",
        "df['date'].str.replace('/', '-')"
      ],
      correctAnswer: 0,
      explanation: "pd.to_datetime with format='mixed' and errors='coerce' parses heterogeneous date strings safely."
    },
    {
      id: "q_py_4",
      competency: "Python",
      difficultyLevel: "L3",
      questionType: "Complexity Analysis",
      question: "What is the average time complexity of looking up a key in a standard Python dictionary?",
      options: ["O(1)", "O(N)", "O(log N)", "O(N log N)"],
      correctAnswer: 0,
      explanation: "Python dictionaries use hash tables, providing O(1) average lookup and insertion time complexity."
    },
    {
      id: "q_py_5",
      competency: "Python",
      difficultyLevel: "L4",
      questionType: "Memory & Performance",
      question: "When processing a 40 GB CSV file on an 8 GB RAM machine, which Python approach prevents Out-Of-Memory crashes?",
      options: [
        "Process in chunks using pd.read_csv(file, chunksize=100000) or use Polars/Dask lazy streaming",
        "Load the entire file into a Python list",
        "Set pd.read_csv(file, low_memory=False)",
        "Use recursion on string lines"
      ],
      correctAnswer: 0,
      explanation: "Chunked batching or lazy evaluation streams small data partitions through memory sequentially without exceeding RAM limits."
    }
  ],

  "Data Visualization": [
    {
      id: "q_viz_1",
      competency: "Data Visualization",
      difficultyLevel: "L1",
      questionType: "Chart Selection",
      question: "Which chart type is most effective for displaying a continuous trend over time (e.g. Monthly Revenue over 3 years)?",
      options: ["Line Chart", "Pie Chart", "Radar Chart", "Treemap"],
      correctAnswer: 0,
      explanation: "Line charts map continuous chronological time along the horizontal X-axis and quantitative values along the Y-axis."
    },
    {
      id: "q_viz_2",
      competency: "Data Visualization",
      difficultyLevel: "L2",
      questionType: "Visual Best Practice",
      question: "Why are 3D pie charts with high elevation angles generally considered poor practice in business analytics?",
      options: [
        "They distort visual perspective, making foreground slices appear deceptively larger than background slices",
        "They require more printer ink",
        "They only support two data categories",
        "They cannot display positive numbers"
      ],
      correctAnswer: 0,
      explanation: "3D perspective distortion misrepresents quantitative area proportions and violates data visualization integrity."
    },
    {
      id: "q_viz_3",
      competency: "Data Visualization",
      difficultyLevel: "L3",
      questionType: "Dashboard Hierarchy",
      question: "When designing an Executive KPI dashboard, what principle best guides the visual layout?",
      options: [
        "Place top-level summary KPIs at top-left (natural reading gaze), followed by drill-down trends and actionable tables below",
        "Fill all white space with 3D animations and graphics",
        "Use 12 distinct saturated rainbow colors for every metric",
        "Display raw tabular rows without summaries"
      ],
      correctAnswer: 0,
      explanation: "The 'F-pattern' inverted pyramid visual hierarchy delivers immediate executive clarity before granular details."
    },
    {
      id: "q_viz_4",
      competency: "Data Visualization",
      difficultyLevel: "L3",
      questionType: "Perceptual Accuracy",
      question: "Which visual attribute is perceived most accurately by human vision when comparing quantitative values?",
      options: ["Position on a common scale / Length of bars", "Color saturation", "Area / Volume", "Angle of shapes"],
      correctAnswer: 0,
      explanation: "Cleveland & McGill's perceptual hierarchy proves position along a common scale is decoded with highest human accuracy."
    },
    {
      id: "q_viz_5",
      competency: "Data Visualization",
      difficultyLevel: "L4",
      questionType: "Multi-Dimensional Design",
      question: "You must display the correlation between 4 continuous metrics (GDP, Life Expectancy, Population, CO2) across 150 countries. What visual technique avoids clutter?",
      options: [
        "A Bubble Plot where X=GDP, Y=Life Expectancy, Bubble Size=Population, and Color Gradient=CO2, with interactive tooltips",
        "4 separate 3D Pie charts side-by-side",
        "An unformatted 150-row text spreadsheet",
        "A stacked area chart"
      ],
      correctAnswer: 0,
      explanation: "Multi-dimensional bubble plots effectively encode 4 orthogonal metrics via spatial position, size, and color encoding."
    }
  ],

  "Communication": [
    {
      id: "q_com_1",
      competency: "Communication",
      difficultyLevel: "L1",
      questionType: "Workplace Concept",
      question: "In professional email communication, what is the primary purpose of the 'Subject Line'?",
      options: [
        "To provide a concise, specific summary of the email's topic and urgency",
        "To contain the entire message body",
        "To list all recipient phone numbers",
        "To always remain blank for confidentiality"
      ],
      correctAnswer: 0,
      explanation: "A clear subject line enables recipients to prioritize, categorize, and act on messages promptly."
    },
    {
      id: "q_com_2",
      competency: "Communication",
      difficultyLevel: "L2",
      questionType: "Routine Professional",
      question: "You realize you will miss a project deliverable deadline by 2 days. What is the most professional action?",
      options: [
        "Proactively notify your supervisor and stakeholders early, explain the root cause, and provide a revised committed delivery date",
        "Say nothing and submit it 2 days late hoping nobody notices",
        "Blame your team members in a public group chat",
        "Stop answering emails until completed"
      ],
      correctAnswer: 0,
      explanation: "Early proactive communication with root causes and concrete revised commitments builds professional trust."
    },
    {
      id: "q_com_3",
      competency: "Communication",
      difficultyLevel: "L3",
      questionType: "Stakeholder Management",
      question: "A non-technical client requests an impossible architectural change 3 days before release. How should you frame your response?",
      options: [
        "Acknowledge their underlying business objective, explain the technical risks/tradeoffs simply, and present viable phased alternatives",
        "State 'That is technically stupid and we cannot do it.'",
        "Accept the impossible deadline without telling the development team",
        "Ignore the client's request entirely"
      ],
      correctAnswer: 0,
      explanation: "Empathetic communication translating technical constraints into business tradeoffs creates collaborative alignment."
    },
    {
      id: "q_com_4",
      competency: "Communication",
      difficultyLevel: "L4",
      questionType: "Negotiation & Conflict",
      question: "Two senior department heads disagree sharply on resource allocation. As project director, what is your initial mediation strategy?",
      options: [
        "Conduct a joint structured session to align on shared organizational goals, decouple personal friction, and evaluate objective data criteria",
        "Pick whichever director is older and silence the other",
        "Escalate immediately to the CEO without attempting resolution",
        "Split the budget 50-50 regardless of strategic ROI"
      ],
      correctAnswer: 0,
      explanation: "Interest-based negotiation focuses on objective criteria and common organizational outcomes."
    },
    {
      id: "q_com_5",
      competency: "Communication",
      difficultyLevel: "L4",
      questionType: "Executive Briefing",
      question: "When presenting a high-stakes proposal to the Board of Directors, which communication structure produces highest engagement?",
      options: [
        "Bottom-Line-Up-Front (BLUF / Pyramid Principle): Lead with the recommendation and ROI, followed by strategic pillars and supporting financial evidence",
        "Read 80 slides of low-level software source code aloud",
        "Spend 45 minutes detailing minor bug fixes before stating the proposal",
        "Avoid mentioning any costs or timelines"
      ],
      correctAnswer: 0,
      explanation: "The Minto Pyramid / BLUF methodology ensures executive audiences understand the core thesis and strategic value immediately."
    }
  ],

  "Programming": [
    {
      id: "q_prg_1",
      competency: "Programming",
      difficultyLevel: "L1",
      questionType: "Core Concept",
      question: "What does the principle of 'Encapsulation' in Object-Oriented Programming (OOP) refer to?",
      options: [
        "Bundling data (attributes) and methods within a single class and restricting direct outside access",
        "Writing all code in a single 10,000-line function",
        "Converting code into machine language",
        "Running multiple programs on different computers"
      ],
      correctAnswer: 0,
      explanation: "Encapsulation hides internal object state and enforces access exclusively through defined public interfaces."
    },
    {
      id: "q_prg_2",
      competency: "Programming",
      difficultyLevel: "L2",
      questionType: "Defensive Coding",
      question: "Which of the following practices represents 'Defensive Programming' when writing a mathematical division function?",
      options: [
        "Explicitly validating input parameters and throwing a controlled exception or error if the divisor is zero",
        "Assuming the divisor will never be zero",
        "Deleting error logs if an exception occurs",
        "Using global variables for all intermediate calculations"
      ],
      correctAnswer: 0,
      explanation: "Input validation and proactive exception handling prevent crashes and unexpected runtime states."
    },
    {
      id: "q_prg_3",
      competency: "Programming",
      difficultyLevel: "L3",
      questionType: "Clean Code",
      question: "According to SOLID principles, what does the 'Single Responsibility Principle' (SRP) dictate?",
      options: [
        "A class or module should have one, and only one, reason to change",
        "Every function must be exactly one line of code",
        "A software system should have only one programmer",
        "All classes must inherit from a single parent class"
      ],
      correctAnswer: 0,
      explanation: "SRP ensures that each software unit has a singular focused purpose, improving maintainability and testability."
    },
    {
      id: "q_prg_4",
      competency: "Programming",
      difficultyLevel: "L3",
      questionType: "Concurrency",
      question: "What is a 'Race Condition' in multi-threaded software applications?",
      options: [
        "A scenario where software output depends on the non-deterministic execution timing of concurrent threads accessing shared mutable state",
        "A test to see which server responds fastest",
        "A sorting algorithm running in O(N log N)",
        "When two developers push code at the same second"
      ],
      correctAnswer: 0,
      explanation: "Race conditions arise when threads modify shared resources concurrently without appropriate synchronization or locks."
    },
    {
      id: "q_prg_5",
      competency: "Programming",
      difficultyLevel: "L4",
      questionType: "Architecture",
      question: "When refactoring an application to handle 100,000 concurrent checkout requests during peak sales, which pattern best prevents database write bottlenecks?",
      options: [
        "Asynchronous Event-Driven Architecture with an in-memory message queue (e.g. Kafka/RabbitMQ) and optimistic concurrency control",
        "Placing a single global table lock on the database",
        "Increasing the timeout limit to 10 minutes",
        "Writing database transactions directly inside frontend button click handlers"
      ],
      correctAnswer: 0,
      explanation: "Event buffering via message brokers decouples intense incoming peak writes from backend database processing."
    }
  ],

  "Data Structures & Algorithms": [
    {
      id: "q_dsa_1",
      competency: "Data Structures & Algorithms",
      difficultyLevel: "L1",
      questionType: "Identification",
      question: "Which data structure operates on a 'First-In, First-Out' (FIFO) order?",
      options: ["Queue", "Stack", "Binary Search Tree", "Heap"],
      correctAnswer: 0,
      explanation: "A Queue enforces FIFO processing where items are enqueued at the back and dequeued from the front."
    },
    {
      id: "q_dsa_2",
      competency: "Data Structures & Algorithms",
      difficultyLevel: "L2",
      questionType: "Complexity",
      question: "What is the worst-case time complexity of Binary Search on a sorted array of N elements?",
      options: ["O(log N)", "O(1)", "O(N)", "O(N^2)"],
      correctAnswer: 0,
      explanation: "Binary Search halves the search space at each iteration, resulting in logarithmic O(log N) runtime."
    },
    {
      id: "q_dsa_3",
      competency: "Data Structures & Algorithms",
      difficultyLevel: "L3",
      questionType: "Problem Solving",
      question: "To check whether a string of brackets (e.g. '{[()]}') has matching and properly nested pairs, which data structure is optimal?",
      options: ["Stack", "Queue", "Singly Linked List", "Min-Heap"],
      correctAnswer: 0,
      explanation: "A Stack's LIFO property matches the most recently opened bracket with the next closing bracket."
    },
    {
      id: "q_dsa_4",
      competency: "Data Structures & Algorithms",
      difficultyLevel: "L3",
      questionType: "Graph Search",
      question: "Which graph traversal algorithm explores level-by-level using a FIFO queue to guarantee the shortest path in unweighted graphs?",
      options: ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Topological Sort", "Bellman-Ford"],
      correctAnswer: 0,
      explanation: "BFS explores level-by-level using a FIFO queue and guarantees the shortest path in unweighted networks."
    },
    {
      id: "q_dsa_5",
      competency: "Data Structures & Algorithms",
      difficultyLevel: "L4",
      questionType: "Design",
      question: "You need to design an LRU (Least Recently Used) Cache supporting O(1) time complexity for both get() and put() operations. Which composite data structure achieves this?",
      options: [
        "A Hash Map paired with a Doubly Linked List",
        "A Binary Search Tree with an array",
        "A simple dynamic array with linear scanning",
        "Two nested FIFO queues"
      ],
      correctAnswer: 0,
      explanation: "Hash Map provides O(1) key lookups and points directly to nodes in a Doubly Linked List for O(1) node removal and insertion."
    }
  ],

  "Database": [
    {
      id: "q_db_1",
      competency: "Database",
      difficultyLevel: "L1",
      questionType: "Core Concept",
      question: "In relational database design, what is the role of a 'Primary Key'?",
      options: [
        "A column (or set of columns) that uniquely identifies every distinct row in a table",
        "The password used to log in to the database server",
        "A column that stores encrypted credit card details",
        "The largest numeric column in a table"
      ],
      correctAnswer: 0,
      explanation: "A Primary Key enforces entity integrity by ensuring unique non-null identification for all records."
    },
    {
      id: "q_db_2",
      competency: "Database",
      difficultyLevel: "L2",
      questionType: "Constraints",
      question: "What integrity constraint prevents an order record from referencing a Customer ID that does not exist in the Customers table?",
      options: ["Foreign Key Constraint", "Unique Constraint", "CHECK Constraint", "NOT NULL Constraint"],
      correctAnswer: 0,
      explanation: "Foreign Keys establish referential integrity between child and parent tables."
    },
    {
      id: "q_db_3",
      competency: "Database",
      difficultyLevel: "L3",
      questionType: "Normalization",
      question: "A table is in Second Normal Form (2NF). What additional condition elevates it to Third Normal Form (3NF)?",
      options: [
        "It must eliminate all transitive dependencies (no non-key attribute depends on another non-key attribute)",
        "It must store all columns as text strings",
        "It must contain at least 1,000 records",
        "It must be converted into a NoSQL document database"
      ],
      correctAnswer: 0,
      explanation: "3NF requires that all non-key attributes depend directly and only on the primary key, eliminating transitive redundancy."
    },
    {
      id: "q_db_4",
      competency: "Database",
      difficultyLevel: "L3",
      questionType: "Transactions",
      question: "What does the 'Atomicity' property in database ACID transactions guarantee?",
      options: [
        "All operations in a transaction succeed completely, or if any step fails, the entire transaction is rolled back leaving no partial writes",
        "Transactions run at light speed",
        "Data is stored in single atomic bits",
        "The database never requires backups"
      ],
      correctAnswer: 0,
      explanation: "Atomicity is the 'all-or-nothing' guarantee of transaction execution."
    },
    {
      id: "q_db_5",
      competency: "Database",
      difficultyLevel: "L4",
      questionType: "Distributed Scaling",
      question: "When designing a globally distributed database requiring continuous write availability during network partitions, what tradeoff does the CAP theorem dictate?",
      options: [
        "The system must sacrifice strict immediate Consistency (C) in favor of Eventual Consistency to maintain Availability (A) and Partition Tolerance (P)",
        "The system can achieve 100% immediate consistency, 100% availability, and 100% partition tolerance simultaneously",
        "Database indexes must be disabled",
        "Transactions can no longer use primary keys"
      ],
      correctAnswer: 0,
      explanation: "Brewer's CAP theorem proves that in the presence of a network partition (P), a distributed system must choose between Availability (A) and Consistency (C)."
    }
  ],

  "Git & Version Control": [
    {
      id: "q_git_1",
      competency: "Git & Version Control",
      difficultyLevel: "L1",
      questionType: "Basic Command",
      question: "Which Git command is used to initialize a new local repository in the current directory?",
      options: ["git init", "git start", "git create", "git new"],
      correctAnswer: 0,
      explanation: "'git init' initializes a new .git metadata tracking directory in the specified folder."
    },
    {
      id: "q_git_2",
      competency: "Git & Version Control",
      difficultyLevel: "L2",
      questionType: "Standard Workflow",
      question: "What is the correct sequence of Git commands to stage modified files and save them to your local history?",
      options: [
        "git add . followed by git commit -m \"descriptive message\"",
        "git push followed by git pull",
        "git init followed by git reset",
        "git branch followed by git checkout"
      ],
      correctAnswer: 0,
      explanation: "Changes must first be staged in the index via 'git add' before being committed into the local repository tree."
    },
    {
      id: "q_git_3",
      competency: "Git & Version Control",
      difficultyLevel: "L3",
      questionType: "Conflicts",
      question: "During a 'git merge feature-branch' command, Git reports a merge conflict in 'index.js'. How do you resolve this properly?",
      options: [
        "Open index.js, inspect conflict markers (<<<<<<<, =======, >>>>>>>), reconcile differences, remove markers, stage with git add, and finalize commit",
        "Delete the entire .git folder and start over",
        "Ignore the error and run git push --force immediately",
        "Turn off the computer"
      ],
      correctAnswer: 0,
      explanation: "Manual conflict resolution requires editing conflict blocks, staging the reconciled file, and finalizing the merge commit."
    },
    {
      id: "q_git_4",
      competency: "Git & Version Control",
      difficultyLevel: "L3",
      questionType: "Stashing",
      question: "You are midway through an uncommitted feature when an urgent bug requires your immediate attention. Which command safely saves your uncommitted work temporarily?",
      options: ["git stash", "git discard", "git wipe", "git revert HEAD"],
      correctAnswer: 0,
      explanation: "'git stash' saves your uncommitted working directory state to a stack, restoring a clean working tree."
    },
    {
      id: "q_git_5",
      competency: "Git & Version Control",
      difficultyLevel: "L4",
      questionType: "Repository Strategy",
      question: "In a team of 50+ developers contributing to a shared repository, why is 'git rebase' on public shared remote branches dangerous?",
      options: [
        "Rebasing rewrites commit SHA hashes and timeline, which desynchronizes other team members' local branch bases and causes duplicate commit chaos",
        "Rebase deletes all code files permanently",
        "Rebase runs slower than downloading",
        "Rebase only works on Linux"
      ],
      correctAnswer: 0,
      explanation: "Golden rule of Git: Never rewrite the commit history of a public shared branch that others have already pulled."
    }
  ],

  "Software Testing": [
    {
      id: "q_test_1",
      competency: "Software Testing",
      difficultyLevel: "L1",
      questionType: "Core Concept",
      question: "What is a 'Unit Test' in modern software development?",
      options: [
        "A focused automated test that validates an isolated function, method, or small component in isolation from external systems",
        "Testing the entire physical server hardware",
        "Testing how fast a human user can type",
        "An audit conducted by the tax department"
      ],
      correctAnswer: 0,
      explanation: "Unit tests verify discrete units of source code independently using mocks/stubs for dependencies."
    },
    {
      id: "q_test_2",
      competency: "Software Testing",
      difficultyLevel: "L2",
      questionType: "Boundary Testing",
      question: "When testing an input for 'Age (between 18 and 65)', which values represent the essential Boundary Value Analysis (BVA) test cases?",
      options: ["17, 18, 19, 64, 65, 66", "1, 2, 3, 4", "50, 51, 52", "100, 200, 300"],
      correctAnswer: 0,
      explanation: "BVA tests boundary thresholds (just below min, min, just above min, just below max, max, just above max) where off-by-one errors frequently occur."
    },
    {
      id: "q_test_3",
      competency: "Software Testing",
      difficultyLevel: "L3",
      questionType: "TDD",
      question: "What is the standard cycle in Test-Driven Development (TDD)?",
      options: [
        "Red (Write failing test) -> Green (Write minimal code to pass test) -> Refactor (Improve code quality while keeping tests green)",
        "Write 10,000 lines -> Deploy to production -> Wait for customer bug reports",
        "Write code -> Delete tests -> Ship",
        "Run security scan -> Code -> Test"
      ],
      correctAnswer: 0,
      explanation: "The Red-Green-Refactor loop is the core disciplined rhythm of Test-Driven Development."
    },
    {
      id: "q_test_4",
      competency: "Software Testing",
      difficultyLevel: "L3",
      questionType: "Mocking",
      question: "Why should unit tests mock external payment gateway API calls rather than hitting real live endpoints?",
      options: [
        "To ensure tests run fast, reliably, deterministically offline, and avoid incurring financial charges or false failures during third-party network outages",
        "Because unit tests cannot connect to the internet",
        "To make tests fail deliberately",
        "Because payment APIs are illegal in tests"
      ],
      correctAnswer: 0,
      explanation: "Mocking external network services isolates code under test from external latency, rate limits, and network flakiness."
    },
    {
      id: "q_test_5",
      competency: "Software Testing",
      difficultyLevel: "L4",
      questionType: "CI/CD Strategy",
      question: "In a continuous integration / continuous deployment (CI/CD) pipeline, what is the best strategy to maintain high delivery speed without compromising quality?",
      options: [
        "The Testing Pyramid: A broad foundation of fast Unit Tests, a moderate layer of Integration Tests, and a thin layer of end-to-end (E2E) Smoke Tests",
        "Only running manual UI testing once a year",
        "Writing 100% E2E browser tests for every single internal utility helper",
        "Disabling tests during release builds"
      ],
      correctAnswer: 0,
      explanation: "The Test Pyramid balances execution speed, maintenance cost, and comprehensive code coverage across the delivery lifecycle."
    }
  ],

  "Project Planning": [
    {
      id: "q_plan_1",
      competency: "Project Planning",
      difficultyLevel: "L1",
      questionType: "Basic Concept",
      question: "What is a Work Breakdown Structure (WBS) in project management?",
      options: [
        "A hierarchical decomposition of the total scope of work into smaller, manageable deliverables and work packages",
        "A list of employee disciplinary violations",
        "The mechanical blueprint of an office building",
        "A server crash log"
      ],
      correctAnswer: 0,
      explanation: "WBS breaks project scope into hierarchical work packages for accurate estimation and assignment."
    },
    {
      id: "q_plan_2",
      competency: "Project Planning",
      difficultyLevel: "L2",
      questionType: "Dependencies",
      question: "What does a 'Finish-to-Start (FS)' dependency between Task A and Task B mean?",
      options: [
        "Task B cannot begin until Task A has finished",
        "Task B must finish before Task A can start",
        "Both tasks must start at the identical second",
        "Task A is automatically cancelled when Task B starts"
      ],
      correctAnswer: 0,
      explanation: "FS is the most common project sequence dependency: predecessor finishes, successor begins."
    },
    {
      id: "q_plan_3",
      competency: "Project Planning",
      difficultyLevel: "L3",
      questionType: "Critical Path",
      question: "What happens if a task lying directly on the Critical Path is delayed by 3 days?",
      options: [
        "The overall project completion date will be delayed by exactly 3 days unless crashing or fast-tracking actions are taken",
        "Nothing, critical path tasks have infinite float time",
        "The project finishes 3 days earlier",
        "Only the budget increases, not the time"
      ],
      correctAnswer: 0,
      explanation: "Tasks on the Critical Path have zero float (slack); any delay immediately extends project duration."
    },
    {
      id: "q_plan_4",
      competency: "Project Planning",
      difficultyLevel: "L3",
      questionType: "Resource Leveling",
      question: "When two concurrent critical tasks require 100% allocation from the same single Lead Architect, what planning technique resolves the overallocation?",
      options: [
        "Resource Leveling (adjusting task start/finish dates based on resource constraints) or Resource Smoothing",
        "Ignore the overallocation and schedule the architect for 24 hours per day",
        "Delete one of the critical tasks",
        "Cancel the project"
      ],
      correctAnswer: 0,
      explanation: "Resource Leveling resolves resource conflicts by sequencing tasks within available capacity constraints."
    },
    {
      id: "q_plan_5",
      competency: "Project Planning",
      difficultyLevel: "L4",
      questionType: "EVM",
      question: "In Earned Value Management (EVM), your project reports Schedule Performance Index (SPI) = 0.82 and Cost Performance Index (CPI) = 1.15. How do you interpret project health?",
      options: [
        "The project is Behind Schedule (SPI < 1.0) but Under Budget / Cost-Efficient (CPI > 1.0)",
        "The project is ahead of schedule and over budget",
        "The project has failed completely and must be cancelled",
        "Both time and budget are perfectly on track"
      ],
      correctAnswer: 0,
      explanation: "SPI < 1 indicates work completed is less than planned, while CPI > 1 indicates earned value exceeds actual cost incurred."
    }
  ],

  "Team Management": [
    {
      id: "q_tm_1",
      competency: "Team Management",
      difficultyLevel: "L1",
      questionType: "Basic Concept",
      question: "According to Tuckman's model of group development, what is the initial stage when team members first meet?",
      options: ["Forming", "Storming", "Norming", "Performing"],
      correctAnswer: 0,
      explanation: "Forming is the initial orientation stage characterized by polite ambiguity and setting baseline guidelines."
    },
    {
      id: "q_tm_2",
      competency: "Team Management",
      difficultyLevel: "L2",
      questionType: "Delegation",
      question: "When delegating a critical task to a team member, what is essential to ensure accountable execution?",
      options: [
        "Clearly define the expected deliverable, success criteria, authority boundaries, deadline, and scheduled checkpoint reviews",
        "Tell them vaguely 'get it done' without explaining requirements",
        "Do the task yourself secretly",
        "Change the requirements every 2 hours without telling them"
      ],
      correctAnswer: 0,
      explanation: "Effective delegation matches clear expectations and authority with established milestone check-ins."
    },
    {
      id: "q_tm_3",
      competency: "Team Management",
      difficultyLevel: "L3",
      questionType: "Conflict Resolution",
      question: "Two senior engineers disagree strongly on selecting a frontend framework, causing a sprint standstill. How should you facilitate resolution?",
      options: [
        "Establish objective technical evaluation criteria (performance, team learning curve, ecosystem support) and run a time-boxed 2-day spike prototype",
        "Pick whichever engineer screams the loudest",
        "Fire both engineers immediately",
        "Ban both frameworks and use plain HTML 1.0"
      ],
      correctAnswer: 0,
      explanation: "A structured, objective evaluation spike depersonalizes technical disagreements through empirical evidence."
    },
    {
      id: "q_tm_4",
      competency: "Team Management",
      difficultyLevel: "L3",
      questionType: "Agile Standups",
      question: "In daily Scrum standup meetings, what are the three core questions each team member answers to maintain transparency?",
      options: [
        "What did I complete yesterday? What will I work on today? What impediments/blockers are in my way?",
        "What is my salary? Who is my favorite coworker? What time is lunch?",
        "Why did the server crash? Who is responsible? How much did it cost?",
        "When will I get a promotion? How many vacation days do I have?"
      ],
      correctAnswer: 0,
      explanation: "The three Scrum questions synchronize daily team progress and quickly surface blocking dependencies."
    },
    {
      id: "q_tm_5",
      competency: "Team Management",
      difficultyLevel: "L4",
      questionType: "Psychological Safety",
      question: "According to Google's landmark 'Project Aristotle' research, what is the single most critical factor for high-performing engineering teams?",
      options: [
        "Psychological Safety (team members feel confident to take risks, ask questions, and admit mistakes without fear of humiliation)",
        "Having only Ivy League graduates",
        "Working 80-hour weeks in the office",
        "Eliminating all team communication channels"
      ],
      correctAnswer: 0,
      explanation: "Psychological safety empowers team innovation, vulnerability, and rapid collaborative error-correction."
    }
  ],

  "Risk Management": [
    {
      id: "q_risk_1",
      competency: "Risk Management",
      difficultyLevel: "L1",
      questionType: "Definition",
      question: "What is the primary definition of a 'Project Risk'?",
      options: [
        "An uncertain event or condition that, if it occurs, has a positive or negative effect on project objectives",
        "A certainty that something will always fail",
        "An employee quitting without notice",
        "A bug that was already fixed last week"
      ],
      correctAnswer: 0,
      explanation: "A risk represents uncertainty with potential impact on scope, schedule, cost, or quality."
    },
    {
      id: "q_risk_2",
      competency: "Risk Management",
      difficultyLevel: "L2",
      questionType: "Scoring Matrix",
      question: "In qualitative risk assessment, how is the 'Risk Score / Severity' commonly calculated?",
      options: [
        "Risk Score = Probability (Likelihood) × Impact (Consequence)",
        "Risk Score = Total Project Budget / Number of Employees",
        "Risk Score = Number of lines of code",
        "Risk Score = Random number between 1 and 100"
      ],
      correctAnswer: 0,
      explanation: "Probability × Impact matrices categorize risks into Low, Medium, and High priority bands."
    },
    {
      id: "q_risk_3",
      competency: "Risk Management",
      difficultyLevel: "L3",
      questionType: "Response Strategies",
      question: "Purchasing a comprehensive cyber-insurance policy to offset potential financial loss from a data breach is an example of which risk response strategy?",
      options: ["Risk Transference", "Risk Avoidance", "Risk Mitigation", "Risk Acceptance"],
      correctAnswer: 0,
      explanation: "Risk Transference shifts financial liability and impact to a third party (e.g. insurance or warranty)."
    },
    {
      id: "q_risk_4",
      competency: "Risk Management",
      difficultyLevel: "L3",
      questionType: "Mitigation vs Contingency",
      question: "What is the key difference between a 'Mitigation Action' and a 'Contingency Plan'?",
      options: [
        "Mitigation is implemented proactively to reduce risk probability/impact before occurrence; Contingency is executed only after the risk event triggers",
        "Mitigation is free, while Contingency costs money",
        "They are identical terms with no difference",
        "Contingency is only for hardware failures"
      ],
      correctAnswer: 0,
      explanation: "Mitigation is proactive prevention; contingency is a planned emergency response if the risk occurs."
    },
    {
      id: "q_risk_5",
      competency: "Risk Management",
      difficultyLevel: "L4",
      questionType: "Crisis Planning",
      question: "Your project depends on a single specialized cloud vendor whose jurisdiction undergoes sudden severe regulatory embargo. What risk framework component should have addressed this scenario?",
      options: [
        "A Business Continuity Plan (BCP) / Multi-Cloud Exit Strategy with pre-tested containerized workload portability",
        "A post-mortem meeting after the company goes bankrupt",
        "Filing a court case after the servers go dark",
        "Hoping the government changes the law immediately"
      ],
      correctAnswer: 0,
      explanation: "Enterprise risk governance mandates pre-architected portable failover contingencies for existential third-party dependencies."
    }
  ],

  "Problem Solving": [
    {
      id: "q_prob_1",
      competency: "Problem Solving",
      difficultyLevel: "L1",
      questionType: "5 Whys",
      question: "What is the primary objective of the '5 Whys' root cause analysis technique?",
      options: [
        "To drill down past superficial symptoms by iteratively asking 'Why' until the underlying core process defect is identified",
        "To interrogate five different employees until someone confesses",
        "To write a five-page apology letter",
        "To delay the project deadline by five weeks"
      ],
      correctAnswer: 0,
      explanation: "The 5 Whys penetrates surface symptoms to discover systemic root causes."
    },
    {
      id: "q_prob_2",
      competency: "Problem Solving",
      difficultyLevel: "L2",
      questionType: "Troubleshooting",
      question: "When investigating a sudden 40% spike in user checkout failures, what is the first logical step?",
      options: [
        "Collect verifiable error logs, telemetry metrics, and reproduce the failure to isolate when and where the breakdown is happening",
        "Immediately rewrite the entire frontend codebase from scratch",
        "Blame the marketing team",
        "Turn off user accounts"
      ],
      correctAnswer: 0,
      explanation: "Effective problem solving begins with objective data gathering and failure isolation before proposing fixes."
    },
    {
      id: "q_prob_3",
      competency: "Problem Solving",
      difficultyLevel: "L3",
      questionType: "Fishbone RCA",
      question: "In an Ishikawa (Fishbone / Cause-and-Effect) diagram, what are the primary standard categories used to brainstorm systemic causes in engineering?",
      options: [
        "People, Process (Methods), Technology (Machines/Software), Materials (Data), and Environment",
        "Past, Present, Future, Morning, Night",
        "Good, Bad, Ugly, Neutral",
        "North, South, East, West"
      ],
      correctAnswer: 0,
      explanation: "Standard 5M/6M fishbone categories structure comprehensive brainstorming across people, processes, tools, and environments."
    },
    {
      id: "q_prob_4",
      competency: "Problem Solving",
      difficultyLevel: "L3",
      questionType: "Decision Matrices",
      question: "You face a dilemma: Option A is cheap but delays delivery by 2 months; Option B delivers on time but exceeds budget by 15%. What structured tool best resolves this?",
      options: [
        "A Weighted Decision Matrix scoring both options against strategic business criteria agreed with stakeholders",
        "Flip a coin in secret",
        "Choose Option A and hide the delay until the final day",
        "Refuse to make any decision"
      ],
      correctAnswer: 0,
      explanation: "Weighted Decision Scoring evaluates competing alternatives transparently against prioritized stakeholder criteria."
    },
    {
      id: "q_prob_5",
      competency: "Problem Solving",
      difficultyLevel: "L4",
      questionType: "Incident Command",
      question: "During a major critical service outage with ambiguous symptoms across 12 microservices, what leadership protocol ensures rapid resolution?",
      options: [
        "Establish an incident Commander, open a centralized triage bridge, isolate hypotheses systematically with metric telemetry, and maintain transparent stakeholder updates",
        "Have all 100 engineers make uncoordinated code edits simultaneously",
        "Issue a press release denying that any problem exists",
        "Shut down the entire national electricity grid"
      ],
      correctAnswer: 0,
      explanation: "Incident Command Systems (ICS) provide structured triage, role clarity, and telemetry-driven hypothesis testing during high-severity crises."
    }
  ]
};

// Registered Mentors / Trainers
export const REGISTERED_TRAINERS = [
  {
    id: "TRN-001",
    name: "Suresh Varma",
    title: "Senior Analytics & Modeling Specialist",
    organization: "Data Science Institute",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    experienceYears: 8,
    teachingHours: 850,
    rating: 4.95,
    cvSummary: "8 years experience in advanced Excel modeling, statistical analysis, and predictive workflows.",
    subjects: ["Excel", "Data Analysis"],
    verifiedLevel: "L4",
    trainingMode: "Online",
    availableResources: "Excel Advanced, Data Analysis",
    availability: "Flexible (Weekday Evenings)",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["Excel Expert", "Analytics Fellow"]
  },
  {
    id: "TRN-002",
    name: "Rahul Verma",
    title: "BI & Dashboard Specialist",
    organization: "Insights Center",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    experienceYears: 7,
    teachingHours: 720,
    rating: 4.90,
    cvSummary: "7 years specializing in interactive Excel dashboards, Power BI, and executive visual reporting.",
    subjects: ["Excel", "Data Visualization"],
    verifiedLevel: "L4",
    trainingMode: "Online",
    availableResources: "Excel Dashboards, Power BI",
    availability: "Tue, Thu, Sat",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["Power BI Certified", "Dashboard Master"]
  },
  {
    id: "TRN-003",
    name: "Priya Nair",
    title: "Database Architect & SQL Mentor",
    organization: "Database Engineering Labs",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    experienceYears: 9,
    teachingHours: 940,
    rating: 4.96,
    cvSummary: "9 years architecting enterprise databases, complex query optimization, and schema designs.",
    subjects: ["SQL", "Database"],
    verifiedLevel: "L4",
    trainingMode: "Online / In-person",
    availableResources: "SQL, Database Design",
    availability: "Mon, Wed, Fri",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["SQL Specialist", "Database Architect"]
  },
  {
    id: "TRN-004",
    name: "Arjun Mehta",
    title: "Senior Python & Backend Engineer",
    organization: "Software Innovation Hub",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    experienceYears: 8,
    teachingHours: 800,
    rating: 4.92,
    cvSummary: "8 years writing production Python services, algorithmic pipelines, and object-oriented architectures.",
    subjects: ["Python", "Programming"],
    verifiedLevel: "L4",
    trainingMode: "Online",
    availableResources: "Python, Programming",
    availability: "Weekends & Evenings",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["Python Lead", "Clean Code Specialist"]
  },
  {
    id: "TRN-005",
    name: "Neha Kapoor",
    title: "Python Data Analysis Mentor",
    organization: "Analytics Wing",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    experienceYears: 5,
    teachingHours: 520,
    rating: 4.88,
    cvSummary: "5 years mentoring learners in Pandas dataframes, data wrangling, and exploratory data analysis.",
    subjects: ["Python", "Data Analysis"],
    verifiedLevel: "L3",
    trainingMode: "Online",
    availableResources: "Python for Data Analysis",
    availability: "Mon, Wed, Sat",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["Pandas Specialist"]
  },
  {
    id: "TRN-006",
    name: "Vikram Singh",
    title: "Lead Data Visualization Designer",
    organization: "Visual Analytics Lab",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    experienceYears: 10,
    teachingHours: 1100,
    rating: 4.97,
    cvSummary: "10 years building high-impact dashboards in Tableau, Power BI, and executive visual storytelling.",
    subjects: ["Data Visualization"],
    verifiedLevel: "L4",
    trainingMode: "Online / In-person",
    availableResources: "Power BI, Tableau",
    availability: "Flexible Daily",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["Tableau Master", "Data Storyteller"]
  },
  {
    id: "TRN-007",
    name: "Sneha Gupta",
    title: "Executive Communication Coach",
    organization: "Center for Leadership Communication",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    experienceYears: 9,
    teachingHours: 920,
    rating: 4.94,
    cvSummary: "9 years training leaders in executive briefings, technical translation, and high-stakes negotiation.",
    subjects: ["Communication"],
    verifiedLevel: "L4",
    trainingMode: "Online / In-person",
    availableResources: "Business Communication",
    availability: "Wed, Fri, Sat",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["Communication Coach", "Leadership Fellow"]
  },
  {
    id: "TRN-008",
    name: "Aditya Rao",
    title: "Competitive Programming & DSA Coach",
    organization: "Algorithms Academy",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    experienceYears: 8,
    teachingHours: 860,
    rating: 4.95,
    cvSummary: "8 years coaching developers in DSA, C++, tree/graph algorithms, and complexity optimization.",
    subjects: ["Programming", "Data Structures & Algorithms"],
    verifiedLevel: "L4",
    trainingMode: "Online",
    availableResources: "C++, DSA, Problem Solving",
    availability: "Tue, Thu, Sun",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["DSA Master", "Competitive Programmer"]
  },
  {
    id: "TRN-009",
    name: "Karan Malhotra",
    title: "Data Structures & Logic Instructor",
    organization: "Core Engineering Academy",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    experienceYears: 6,
    teachingHours: 600,
    rating: 4.87,
    cvSummary: "6 years training programmers in stacks, queues, recursion, and core programming fundamentals.",
    subjects: ["Data Structures & Algorithms", "Programming"],
    verifiedLevel: "L3",
    trainingMode: "Online",
    availableResources: "DSA Fundamentals",
    availability: "Mon, Wed, Fri",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["DSA Instructor"]
  },
  {
    id: "TRN-010",
    name: "Riya Iyer",
    title: "DevOps & Git Version Control Specialist",
    organization: "Open Source Engineering Group",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    experienceYears: 5,
    teachingHours: 540,
    rating: 4.89,
    cvSummary: "5 years mentoring teams on Git branching workflows, pull requests, and collaborative code reviews.",
    subjects: ["Git & Version Control"],
    verifiedLevel: "L3",
    trainingMode: "Online",
    availableResources: "Git, GitHub, Collaboration",
    availability: "Weekends",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["Git Specialist", "DevOps Coach"]
  },
  {
    id: "TRN-011",
    name: "Aman Joshi",
    title: "QA Lead & Test Automation Architect",
    organization: "Software Quality Systems",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    experienceYears: 7,
    teachingHours: 780,
    rating: 4.93,
    cvSummary: "7 years architecting automated testing pipelines, TDD strategies, and unit/integration testing suites.",
    subjects: ["Software Testing"],
    verifiedLevel: "L4",
    trainingMode: "Online / In-person",
    availableResources: "Testing, QA, Automation",
    availability: "Mon, Thu, Sat",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["QA Lead", "Automation Expert"]
  },
  {
    id: "TRN-012",
    name: "Meera Shah",
    title: "Database Administrator & SQL Trainer",
    organization: "Data Management Wing",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
    experienceYears: 6,
    teachingHours: 620,
    rating: 4.88,
    cvSummary: "6 years experience in relational database modeling, indexing, and transactional SQL development.",
    subjects: ["Database", "SQL"],
    verifiedLevel: "L3",
    trainingMode: "Online",
    availableResources: "SQL, Database Management",
    availability: "Tue, Fri, Sun",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["Database Administrator"]
  },
  {
    id: "TRN-013",
    name: "Vivek Bansal",
    title: "Senior Project Delivery Director & PMP Mentor",
    organization: "Project Management Institute Partner",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    experienceYears: 11,
    teachingHours: 1200,
    rating: 4.98,
    cvSummary: "11 years managing complex project lifecycles, critical path scheduling, and resource allocation.",
    subjects: ["Project Planning"],
    verifiedLevel: "L4",
    trainingMode: "Online / In-person",
    availableResources: "Project Planning, Scheduling",
    availability: "Flexible Daily",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["PMP Certified", "Delivery Master"]
  },
  {
    id: "TRN-014",
    name: "Pooja Malhotra",
    title: "Agile Leadership & Team Coach",
    organization: "Leadership Institute",
    avatar: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=150&auto=format&fit=crop&q=80",
    experienceYears: 10,
    teachingHours: 1050,
    rating: 4.96,
    cvSummary: "10 years coaching cross-functional teams in task delegation, conflict mitigation, and team building.",
    subjects: ["Team Management"],
    verifiedLevel: "L4",
    trainingMode: "Online / In-person",
    availableResources: "Leadership, Team Building",
    availability: "Mon, Wed, Fri",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["Agile Coach", "Team Leadership"]
  },
  {
    id: "TRN-015",
    name: "Rohit Agarwal",
    title: "Enterprise Risk Management Specialist",
    organization: "Strategic Risk Center",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    experienceYears: 9,
    teachingHours: 910,
    rating: 4.94,
    cvSummary: "9 years specializing in risk registers, probability-impact analysis, contingency planning, and root cause mitigation.",
    subjects: ["Risk Management", "Problem Solving"],
    verifiedLevel: "L4",
    trainingMode: "Online / In-person",
    availableResources: "Risk Management, Risk Mitigation",
    availability: "Tue, Thu, Sat",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["Risk Specialist", "Problem Solving Fellow"]
  }
];

// Targeted Bridge Modules
export const TARGETED_LEARNING_MODULES = [
  {
    id: "MOD-SQL-L2L3",
    competency: "SQL",
    fromLevel: "L2",
    toLevel: "L3",
    title: "Bridging SQL L2 to L3: Multi-Table Aggregations & Window Functions",
    duration: "2.5 Hours",
    difficulty: "L3 Proficient",
    curriculumSummary: "Hands-on exercises covering Subqueries, Complex Multi-Table JOINs, GROUP BY HAVING clauses, and DENSE_RANK / OVER window functions.",
    trainerId: "TRN-101",
    enrolledCount: 1420
  },
  {
    id: "MOD-PY-L2L3",
    competency: "Python",
    fromLevel: "L2",
    toLevel: "L3",
    title: "Bridging Python L2 to L3: Data Wrangling with Pandas & Algorithmic Optimization",
    duration: "3.0 Hours",
    difficulty: "L3 Proficient",
    curriculumSummary: "Master Pandas vectorized operations, missing data imputation, lambda transformers, and memory-efficient algorithmic data structures.",
    trainerId: "TRN-101",
    enrolledCount: 1890
  },
  {
    id: "MOD-EX-L2L3",
    competency: "Excel",
    fromLevel: "L2",
    toLevel: "L3",
    title: "Bridging Excel L2 to L3: Advanced Modeling, Index-Match & AGGREGATE Error Control",
    duration: "2.0 Hours",
    difficulty: "L3 Proficient",
    curriculumSummary: "Practical business simulations using 2-way XLOOKUP/INDEX-MATCH, dynamic Pivot Slicers, AGGREGATE formulas, and data validation rules.",
    trainerId: "TRN-104",
    enrolledCount: 2310
  },
  {
    id: "MOD-VIZ-L2L3",
    competency: "Data Visualization",
    fromLevel: "L2",
    toLevel: "L3",
    title: "Bridging Data Viz L2 to L3: Executive Dashboard Hierarchy & Perceptual Design",
    duration: "2.0 Hours",
    difficulty: "L3 Proficient",
    curriculumSummary: "Visual encoding principles, Cleveland perceptual scale, F-pattern layouts, color harmony, and multi-dimensional bubble charts.",
    trainerId: "TRN-104",
    enrolledCount: 1150
  },
  {
    id: "MOD-DSA-L2L3",
    competency: "Data Structures & Algorithms",
    fromLevel: "L2",
    toLevel: "L3",
    title: "Bridging DSA L2 to L3: Stacks, Queues, Binary Trees & BFS/DFS Traversals",
    duration: "3.5 Hours",
    difficulty: "L3 Proficient",
    curriculumSummary: "Linear and non-linear data structures, space-time complexity tradeoffs, bracket matching algorithms, and graph shortest-path searches.",
    trainerId: "TRN-102",
    enrolledCount: 1670
  },
  {
    id: "MOD-PRG-L2L3",
    competency: "Programming",
    fromLevel: "L2",
    toLevel: "L3",
    title: "Bridging Programming L2 to L3: Clean Code, SOLID Principles & Concurrency",
    duration: "3.0 Hours",
    difficulty: "L3 Proficient",
    curriculumSummary: "Single Responsibility Principle (SRP), race condition prevention, modular interface segregation, and defensive exception handling.",
    trainerId: "TRN-102",
    enrolledCount: 1540
  },
  {
    id: "MOD-PLAN-L2L3",
    competency: "Project Planning",
    fromLevel: "L2",
    toLevel: "L3",
    title: "Bridging Project Planning L2 to L3: Critical Path Method (CPM) & Resource Leveling",
    duration: "2.5 Hours",
    difficulty: "L3 Proficient",
    curriculumSummary: "WBS hierarchy decomposition, float calculation, zero-slack critical task management, and resolving resource overallocation.",
    trainerId: "TRN-103",
    enrolledCount: 1280
  },
  {
    id: "MOD-COM-L3L4",
    competency: "Communication",
    fromLevel: "L3",
    toLevel: "L4",
    title: "Bridging Communication L3 to L4: Executive Negotiation & Minto Pyramid Briefings",
    duration: "2.5 Hours",
    difficulty: "L4 Expert",
    curriculumSummary: "High-stakes stakeholder mediation, Harvard interest-based negotiation, crisis communication protocols, and Bottom-Line-Up-Front (BLUF) briefings.",
    trainerId: "TRN-103",
    enrolledCount: 1940
  },
  {
    id: "MOD-RISK-L2L3",
    competency: "Risk Management",
    fromLevel: "L2",
    toLevel: "L3",
    title: "Bridging Risk Management L2 to L3: Probability-Impact Matrix & Contingency Planning",
    duration: "2.0 Hours",
    difficulty: "L3 Proficient",
    curriculumSummary: "Qualitative risk scoring, risk transference strategies, distinguishing mitigation vs contingency triggers, and risk register audits.",
    trainerId: "TRN-103",
    enrolledCount: 1080
  },
  {
    id: "MOD-PROB-L2L3",
    competency: "Problem Solving",
    fromLevel: "L2",
    toLevel: "L3",
    title: "Bridging Problem Solving L2 to L3: Root Cause Analysis & Weighted Decision Matrices",
    duration: "2.0 Hours",
    difficulty: "L3 Proficient",
    curriculumSummary: "Applying the 5 Whys, Ishikawa Fishbone diagrams, objective criteria weighting, and structured post-incident telemetry analysis.",
    trainerId: "TRN-103",
    enrolledCount: 1350
  }
];

export const defaultTrainerUser: User = {
  id: "USR-TRN-01",
  name: "Dr. Suresh Varma",
  phone: "+91 98123 45678",
  accountType: "TRAINER",
  role: "EMPLOYEE",
  currentRole: "Lead Technical Trainer & Coach",
  targetRole: "Senior Technical Coach",
  qualifications: "M.Tech in Data Science & Analytics",
  workExperienceYears: 14,
  existingSkills: ["Excel", "Data Analysis", "Python", "SQL", "Data Visualization"],
  certifications: ["Master Capacity Assessor", "Certified Technical Trainer"],
  previousTraining: "Capacity Development Institute",
  selfAssessedLevels: { "Excel": "L4", "SQL": "L4", "Python": "L4", "Data Visualization": "L4", "Communication": "L4" },
  verifiedLevels: { "Excel": "L4", "SQL": "L4", "Python": "L4", "Data Visualization": "L4", "Communication": "L4" },
  diagnosticCompleted: true,
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  department: "Department of Analytics & Digital Governance",
  cadre: "Senior Technical Trainer",
  email: "suresh.varma@capacityconnect.gov.in",
  employeeId: "TRN-001",
  annualTargetHours: 120,
  completedHours: 96,
  roleFitScore: 98,
  mandatoryCompletion: 100,
  areasOfInterest: ["Excel", "Python", "SQL", "Dashboards"],
  notifications: [
    { id: "n_trn1", text: "New learner booked a session for Excel on 2026-09-29.", date: "10 mins ago", type: "info", unread: true }
  ]
};

export const defaultLearnerUser: User = {
  id: "USR-001",
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  accountType: "TRAINEE",
  role: "EMPLOYEE",
  currentRole: "Associate Data Analyst",
  targetRole: "Data Analyst",
  qualifications: "B.Tech in Information Technology",
  workExperienceYears: 3,
  existingSkills: ["Excel", "SQL", "Python", "Data Visualization", "Communication"],
  certifications: ["Data Fundamentals"],
  previousTraining: "National Capacity Platform",
  selfAssessedLevels: {
    "Excel": "L2",
    "SQL": "L3",
    "Python": "L2",
    "Data Visualization": "L2",
    "Communication": "L3"
  },
  verifiedLevels: {
    "Excel": "L2",
    "SQL": "L3",
    "Python": "L2",
    "Data Visualization": "L2",
    "Communication": "L3"
  },
  diagnosticCompleted: false,
  areasOfInterest: ["Excel", "Python", "SQL"],
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  department: "Department of Analytics & Digital Governance",
  cadre: "Associate Analyst",
  email: "rajesh.kumar@capacityconnect.gov.in",
  employeeId: "EMP-1082",
  annualTargetHours: 40,
  completedHours: 12,
  roleFitScore: 68,
  mandatoryCompletion: 75,
  notifications: [
    { id: "n1", text: "Welcome! Complete your diagnostic test to verify your skills.", date: "Just now", type: "info", unread: true }
  ]
};

export const defaultAdminUser: User = {
  id: "USR-ADMIN-01",
  name: "Admin Officer",
  email: "admin@capacityconnect.gov.in",
  phone: "+91 99000 00000",
  accountType: "ADMIN",
  role: "ADMIN",
  currentRole: "Central Capacity Administrator",
  targetRole: "Governance Director",
  qualifications: "Director of Digital Capacity & Governance",
  workExperienceYears: 15,
  existingSkills: ["Governance", "Curriculum Design", "Competency Architecture", "Data Analytics"],
  certifications: ["Chief Capacity Officer"],
  previousTraining: "Capacity Building Commission",
  selfAssessedLevels: {},
  verifiedLevels: {},
  diagnosticCompleted: true,
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  department: "National Capacity Directorate",
  cadre: "Director General",
  employeeId: "ADM-001",
  annualTargetHours: 200,
  completedHours: 180,
  roleFitScore: 100,
  mandatoryCompletion: 100,
  areasOfInterest: ["Governance", "System Audits"],
  notifications: [
    { id: "n_adm1", text: "New quarterly competency readiness audit available.", date: "1 hour ago", type: "info", unread: true }
  ]
};

// Clean dynamic users list (initial demo users)
export const USERS: User[] = [defaultAdminUser, defaultTrainerUser, defaultLearnerUser];
export const CERTIFICATES: Certificate[] = [
  {
    id: "CERT-DA-2026-001",
    userId: "USR-001",
    userName: "Rajesh Kumar",
    courseId: "MOD-EX-L2L3",
    courseTitle: "Bridging Excel L2 to L3: Dynamic Arrays, Power Query & Lookup Logic",
    issuedBy: "Capacity Connect Assessment Board",
    issueDate: "2026-09-15",
    expiryDate: "2028-09-15",
    grade: "A+ (Proficient)",
    competencyAccredited: "Excel L3",
    qrCodeString: "CAPCONNECT-VERIFY-EXCEL-L3-RAJESH-2026",
    signatoryName: "Dr. Suresh Varma",
    signatoryTitle: "Chief Assessment Officer"
  }
];
export const RESOURCES: ResourceItem[] = [
  {
    id: "res_1",
    title: "National Competency Framework Reference Manual (v2.4)",
    category: "Guidelines",
    format: "PDF (8.4 MB)",
    competencyTag: "Governance & Quality",
    department: "Capacity Building Directorate",
    publishedDate: "2026-08-10",
    downloadCount: 1420,
    downloadUrl: "#",
    summary: "Complete blueprint for public sector competency matrices, assessment rubrics, and promotion prerequisites."
  },
  {
    id: "res_2",
    title: "SQL & Relational Querying Best Practices Handbook",
    category: "Technical Guide",
    format: "PDF (4.2 MB)",
    competencyTag: "SQL",
    department: "Data Engineering Division",
    publishedDate: "2026-09-01",
    downloadCount: 980,
    downloadUrl: "#",
    summary: "Index optimization, window functions, and multi-table join execution plans for high-throughput public systems."
  }
];
export const NOMINATION_REQUESTS: NominationRequest[] = [];
export const DEPARTMENT_METRICS = {
  department: "Department of Analytics & Digital Governance",
  totalEmployees: 420,
  averageReadinessScore: 78,
  verifiedCompetencies: 1250,
  activeTrainingHours: 3420,
  topDeficitCompetency: "SQL L3"
};
