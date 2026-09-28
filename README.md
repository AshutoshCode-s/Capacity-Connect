# CAPACITY CONNECT – Competency-Driven Digital Capacity Building Platform
### Smart India Hackathon (SIH) Prototype Submission

**CAPACITY CONNECT** is a clean, practical, and enterprise-grade workforce capacity-building portal equipped with an end-to-end **Competency-Verification Engine**, **Phone OTP Onboarding**, **Diagnostic Assessment**, **Rule-Based Skill-Gap Diagnostics**, **Trainer Matching**, **Admin Roles & Assessment Architecture**, and **Post-Training Competency Upgrade**.

---

## ⚡ Quick Start (Run with 1 Command)

### Prerequisites:
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 1. Install All Dependencies:
Run this once from the root folder:
```bash
npm run install:all
```

### 2. Start Both Backend & Frontend Together:
```bash
npm run dev
```
*(On Windows, you can also simply double-click **`start.bat`**)*

> [!NOTE]
> - **Frontend (Next.js)** is live at 👉 **[http://localhost:3000](http://localhost:3000)**
> - **Backend (Node/Express API)** is live at 👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🚀 How to Upload to GitHub

The repository is already configured with a root `.gitignore` to prevent uploading `node_modules` and build caches.

To publish this project to your GitHub repository, run the following commands in the root directory:

```bash
# 1. Initialize Git (if not already done)
git init

# 2. Add all files (automatically excludes node_modules and .next)
git add .

# 3. Commit your changes
git commit -m "Initial commit: Capacity Connect SIH Prototype"

# 4. Rename branch to main
git branch -M main

# 5. Add your GitHub remote repository URL
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📁 Repository Structure

```
CapacityConnect/
├── package.json           # Unified root package.json (runs backend + frontend together)
├── .gitignore             # Root gitignore (clean GitHub uploads)
├── start.bat              # One-click Windows launch script
├── README.md              # Documentation & guide
│
├── backend/               # Express.js REST API
│   ├── server.js          # API server, OTP auth, role & assessment endpoints
│   ├── data.js            # Target roles, question bank, trainer registry
│   └── package.json       # Backend dependencies
│
└── frontend/              # Next.js 14 Web Application
    ├── src/
    │   ├── app/           # Next.js App Router
    │   ├── components/    # UI components (Dashboard, Trainer, Admin, Navbar, etc.)
    │   ├── services/      # API communication layer
    │   └── types/         # TypeScript definitions
    └── package.json       # Frontend dependencies
```

---

## 🏛️ Key Roles & Demo Logins

| Portal / Role | Access Method | Credentials |
| :--- | :--- | :--- |
| **Learner Portal** | Login Screen -> Select **Learner** | Phone: `9876543210` • OTP: `123456` |
| **Trainer Portal** | Login Screen -> Select **Trainer** | Phone: `9812345678` • OTP: `123456` |
| **Admin Portal** | Top-Left **Admin Login** button | ID: `admin` • Password: `admin123` |

---

## 🏛️ Target Roles & Competency Standards

| Role | Competency | Required Level | Level Definition |
| :--- | :--- | :--- | :--- |
| **Data Analyst** | Excel | **L3** | Advanced Modeling, Lookup/Index-Match, Error Handling |
| | SQL | **L3** | Multi-Table Joins, Aggregations, Window Functions |
| | Python | **L3** | Pandas Data Wrangling, Scripting, Optimization |
| | Data Visualization | **L3** | Executive Dashboards, Storytelling, Visual Perception |
| | Communication | **L2** | Routine Professional & Stakeholder Reporting |
| **Software Developer** | Programming | **L3** | OOP, SOLID Clean Code, Exception Handling |
| | Data Structures & Algorithms | **L3** | Stacks, Trees, Graphs, BFS/DFS, Complexity Analysis |
| | Database | **L2** | Relational CRUD, Schema Constraints, Normalization |
| | Git & Version Control | **L2** | Branching, Merging, Conflict Resolution |
| | Software Testing | **L2** | Unit Testing, Boundary Value Analysis, TDD |
| **Project Manager** | Project Planning | **L3** | WBS Breakdown, Critical Path Method (CPM), Float |
| | Communication | **L4** | Executive Negotiation, Minto Pyramid, Crisis Mediation |
| | Team Management | **L3** | Agile/Scrum Delegation, Conflict Resolution |
| | Risk Management | **L3** | Probability-Impact Scoring, Mitigation vs Contingency |
| | Problem Solving | **L3** | 5 Whys Root Cause, Fishbone, Decision Matrices |
