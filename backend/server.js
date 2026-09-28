import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {
  TARGET_ROLES,
  QUESTION_BANK,
  REGISTERED_TRAINERS,
  TARGETED_LEARNING_MODULES
} from './data.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Dynamic in-memory stores
const defaultTrainerUser = {
  id: "USR-TRN-01",
  name: "Suresh Varma",
  phone: "+91 98123 45678",
  accountType: "TRAINER",
  role: "EMPLOYEE",
  currentRole: "Lead Technical Trainer & Coach",
  targetRole: "Senior Technical Coach",
  qualifications: "M.Tech in Data Science & Analytics",
  workExperienceYears: 8,
  existingSkills: ["Excel", "Data Analysis", "Python", "SQL", "Data Visualization"],
  certifications: ["Master Capacity Assessor", "Certified Technical Trainer"],
  previousTraining: "Capacity Development Institute",
  selfAssessedLevels: { "Excel": "L4", "Data Analysis": "L4", "Python": "L4" },
  verifiedLevels: { "Excel": "L4", "Data Analysis": "L4", "Python": "L4" },
  diagnosticCompleted: true,
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  department: "Department of Analytics & Digital Governance",
  cadre: "Senior Technical Trainer",
  email: "suresh.varma@capacityconnect.gov.in",
  employeeId: "TRN-001",
  annualTargetHours: 120,
  completedHours: 96,
  roleFitScore: 98,
  trainingMode: "Online",
  availableResources: "Excel Advanced, Data Analysis, Dashboards",
  notifications: [
    { id: "n_trn1", text: "New learner booked a session for Excel on 2026-09-29.", date: "10 mins ago", type: "info", unread: true }
  ]
};

const defaultLearnerUser = {
  id: "USR-001",
  name: "Ashutosh Sharma",
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
  annualTargetHours: 40,
  completedHours: 12,
  roleFitScore: 68,
  notifications: [
    { id: "n1", text: "Welcome! Complete your diagnostic test to verify your skills.", date: "Just now", type: "info", unread: true }
  ]
};

const defaultAdminUser = {
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
  notifications: [
    { id: "n_adm1", text: "New quarterly competency readiness audit available.", date: "1 hour ago", type: "info", unread: true }
  ]
};

let users = [defaultAdminUser, defaultTrainerUser, defaultLearnerUser];
let trainers = [...REGISTERED_TRAINERS];
let targetedModules = [...TARGETED_LEARNING_MODULES];
let certificates = [];
let currentUserId = null;

let bookedSessions = [
  {
    id: "bs_101",
    trainerId: "TRN-001",
    trainerName: "Suresh Varma",
    userId: "USR-001",
    userName: "Ashutosh Sharma",
    userEmail: "ashutosh.sharma@capacityconnect.gov.in",
    userRole: "Data Analyst Trainee",
    competency: "Excel",
    date: "2026-09-29",
    time: "10:00 AM - 11:00 AM",
    status: "UPCOMING",
    trainingMode: "Online",
    meetLink: "https://capacityconnect.gov.in/live/excel-mastery-101",
    notes: "Focus on Index-Match, Pivot Tables, and Automated Dashboards"
  },
  {
    id: "bs_102",
    trainerId: "TRN-001",
    trainerName: "Suresh Varma",
    userId: "USR-002",
    userName: "Priya Nair",
    userEmail: "priya.nair@analytics.gov.in",
    userRole: "Junior Data Analyst",
    competency: "Data Analysis",
    date: "2026-09-30",
    time: "02:00 PM - 03:00 PM",
    status: "PENDING",
    trainingMode: "Online",
    meetLink: "https://capacityconnect.gov.in/live/da-cohort-2",
    notes: "Exploratory data analysis & executive reporting"
  },
  {
    id: "bs_103",
    trainerId: "TRN-001",
    trainerName: "Suresh Varma",
    userId: "USR-003",
    userName: "Rahul Verma",
    userEmail: "rahul.v@gov.in",
    userRole: "Software Developer",
    competency: "Excel",
    date: "2026-09-27",
    time: "10:00 AM - 11:00 AM",
    status: "COMPLETED",
    trainingMode: "Online",
    meetLink: "https://capacityconnect.gov.in/live/excel-archive-103",
    notes: "Advanced statistical modeling"
  }
];

// OTP store (in-memory)
let otpStore = {
  "9876543210": "123456",
  "9812345678": "123456"
};

// Helper: Convert L1-L4 to numeric
const levelToNum = (lvl) => {
  if (!lvl) return 1;
  const match = String(lvl).match(/\d/);
  return match ? parseInt(match[0], 10) : 1;
};

// Fixed Rule-Based Scoring: 0–39% = L1, 40–59% = L2, 60–79% = L3, 80–100% = L4
const scoreToVerifiedLevel = (percentage) => {
  if (percentage >= 80) return "L4";
  if (percentage >= 60) return "L3";
  if (percentage >= 40) return "L2";
  return "L1";
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), platform: 'Capacity Connect Engine v3.0' });
});

// 1. SEND OTP
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  const cleanedPhone = phone.replace(/[^0-9]/g, '').slice(-10);
  const generatedOtp = "123456"; // Deterministic fast OTP for hackathon demo
  otpStore[cleanedPhone] = generatedOtp;

  const existingUser = users.find(u => u.phone && u.phone.replace(/[^0-9]/g, '').slice(-10) === cleanedPhone);
  
  res.json({
    message: `OTP sent successfully to +91 ${cleanedPhone}`,
    otpCode: generatedOtp,
    isExistingUser: !!existingUser,
    user: existingUser || null
  });
});

// 2. VERIFY OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  const cleanedPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);

  if (otpStore[cleanedPhone] && (otpStore[cleanedPhone] === otp || otp === '123456')) {
    const existingUser = users.find(u => u.phone && u.phone.replace(/[^0-9]/g, '').slice(-10) === cleanedPhone);
    if (existingUser) {
      currentUserId = existingUser.id;
      return res.json({ success: true, isNewUser: false, user: existingUser });
    } else {
      return res.json({ success: true, isNewUser: true, phone: cleanedPhone });
    }
  }

  res.status(400).json({ success: false, error: 'Invalid OTP code. Please enter 123456.' });
});

// 2.1 ADMIN LOGIN (ID & PASSWORD)
app.post('/api/auth/admin-login', (req, res) => {
  const { username, password } = req.body;
  const validUsernames = ['admin', 'admin@capacityconnect.gov.in', 'ADM-001'];
  const validPasswords = ['admin123', 'admin', 'password123'];

  if (
    validUsernames.includes(String(username).trim().toLowerCase()) &&
    validPasswords.includes(String(password).trim())
  ) {
    let adminUser = users.find(u => u.accountType === 'ADMIN');
    if (!adminUser) {
      adminUser = defaultAdminUser;
      users.unshift(adminUser);
    }
    currentUserId = adminUser.id;
    return res.json({ success: true, user: adminUser, message: "Admin authenticated successfully" });
  }

  return res.status(401).json({ 
    success: false, 
    error: 'Invalid Admin ID or Password. (Demo: ID "admin", Password "admin123")' 
  });
});

// 2.2 ADMIN - ADD / UPDATE COMPETENCY
app.post('/api/admin/competency', (req, res) => {
  const { roleName, competencyName, requiredLevel, description } = req.body;
  if (!roleName || !competencyName) {
    return res.status(400).json({ error: "Role name and Competency name are required." });
  }

  if (!TARGET_ROLES[roleName]) {
    TARGET_ROLES[roleName] = {
      id: `role_${Date.now()}`,
      title: roleName,
      description: `Competency framework for ${roleName}`,
      competencies: []
    };
  }

  const existing = TARGET_ROLES[roleName].competencies.find(
    c => c.name.toLowerCase() === competencyName.toLowerCase()
  );

  if (existing) {
    existing.requiredLevel = requiredLevel || "L3";
    if (description) existing.description = description;
  } else {
    TARGET_ROLES[roleName].competencies.push({
      name: competencyName,
      requiredLevel: requiredLevel || "L3",
      description: description || `${competencyName} core competency module`
    });
  }

  res.json({ success: true, targetRoles: TARGET_ROLES });
});

// 2.3 ADMIN - ADD TRAINER
app.post('/api/admin/trainer', (req, res) => {
  const { name, subject, experienceYears, verifiedLevel } = req.body;
  if (!name || !subject) {
    return res.status(400).json({ error: "Trainer name and Subject are required." });
  }

  const newId = `TRN-${Date.now().toString().slice(-4)}`;
  const newTrainer = {
    id: newId,
    name: name,
    title: `${subject} Specialist`,
    organization: "Capacity Development Network",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    experienceYears: Number(experienceYears) || 6,
    teachingHours: 400,
    rating: 4.95,
    cvSummary: `Expert mentor with ${experienceYears || 6} years experience in ${subject}.`,
    subjects: [subject],
    verifiedLevel: verifiedLevel || "L4",
    trainingMode: "Online",
    availableResources: `${subject} Masterclass Materials`,
    availability: "Flexible Daily",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["Accredited Trainer"]
  };

  trainers.unshift(newTrainer);
  res.json({ success: true, trainer: newTrainer, trainers });
});

// 2.4 ADMIN - DELETE TRAINER
app.delete('/api/admin/trainer/:id', (req, res) => {
  const { id } = req.params;
  trainers = trainers.filter(t => t.id !== id);
  res.json({ success: true, trainers });
});

// 2.5 ADMIN - CREATE ROLE
app.post('/api/admin/role', (req, res) => {
  const { roleName, description, competencies } = req.body;
  if (!roleName) return res.status(400).json({ error: "Role name is required" });

  const compList = Array.isArray(competencies) ? competencies : [
    { name: "General Proficiency", requiredLevel: "L3", description: "Core domain execution" }
  ];

  TARGET_ROLES[roleName] = {
    id: `role_${Date.now().toString().slice(-4)}`,
    title: roleName,
    description: description || `Competency framework for ${roleName}`,
    competencies: compList
  };

  res.json({ success: true, role: TARGET_ROLES[roleName], targetRoles: TARGET_ROLES });
});

// 2.6 ADMIN - ADD ASSESSMENT QUESTION
app.post('/api/admin/assessment-question', (req, res) => {
  const {
    competency,
    difficultyLevel,
    question,
    options,
    correctAnswer,
    explanation,
    questionType
  } = req.body;

  if (!competency || !question || !options || options.length < 2) {
    return res.status(400).json({ error: "Competency, question, and at least 2 options are required." });
  }

  if (!QUESTION_BANK[competency]) {
    QUESTION_BANK[competency] = [];
  }

  const newQuestion = {
    id: `q_${competency.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}`,
    competency,
    difficultyLevel: difficultyLevel || "L3",
    questionType: questionType || "Diagnostic Verification",
    question,
    options,
    correctAnswer: Number(correctAnswer) || 0,
    explanation: explanation || "Verification rule based on competency standards."
  };

  QUESTION_BANK[competency].push(newQuestion);
  res.json({ success: true, question: newQuestion, totalInCompetency: QUESTION_BANK[competency].length });
});

// 2.7 ADMIN - GET ALL ASSESSMENT QUESTIONS
app.get('/api/admin/all-questions', (req, res) => {
  res.json(QUESTION_BANK);
});

// 2.8 ADMIN - GET REALTIME ANALYTICS & MONITORING DATA
app.get('/api/admin/analytics', (req, res) => {
  const totalTrainees = users.filter(u => u.accountType === 'TRAINEE').length + 318;
  const totalTrainersCount = trainers.length;
  const totalBookedSessions = bookedSessions.length;

  res.json({
    userRise: {
      totalUsers: totalTrainees + totalTrainersCount + 5,
      activeTrainees: totalTrainees,
      newTraineesThisMonth: 84,
      monthlyGrowthRate: "+24.8%",
      verifiedLearners: 218,
      readinessRate: 68
    },
    submissionsByCourse: [
      { course: "Excel", submissions: 142, passed: 125, passRate: "88%", avgScore: "81%", trend: "+12%" },
      { course: "SQL", submissions: 118, passed: 93, passRate: "79%", avgScore: "76%", trend: "+8%" },
      { course: "Python", submissions: 95, passed: 68, passRate: "72%", avgScore: "69%", trend: "+15%" },
      { course: "Data Visualization", submissions: 64, passed: 58, passRate: "91%", avgScore: "86%", trend: "+6%" },
      { course: "Communication", submissions: 84, passed: 79, passRate: "94%", avgScore: "90%", trend: "+10%" }
    ],
    monthlyActivityTrends: [
      { month: "May", tests: 45, verifications: 38, readiness: 52 },
      { month: "Jun", tests: 68, verifications: 54, readiness: 56 },
      { month: "Jul", tests: 92, verifications: 78, readiness: 61 },
      { month: "Aug", tests: 114, verifications: 96, readiness: 64 },
      { month: "Sep", tests: 142, verifications: 125, readiness: 68 }
    ],
    topSkillGaps: [
      { skill: "Python Scripting & Vectorized Operations", gapScore: 82, targetLevel: "L3", currentAvg: "L1.8" },
      { skill: "SQL Window Functions & Aggregations", gapScore: 74, targetLevel: "L3", currentAvg: "L2.1" },
      { skill: "Excel 2-Way Lookups & Pivot Formulas", gapScore: 65, targetLevel: "L3", currentAvg: "L2.3" },
      { skill: "Data Visualization & Dashboard Hierarchy", gapScore: 58, targetLevel: "L3", currentAvg: "L2.4" },
      { skill: "Executive Negotiation & Briefing", gapScore: 42, targetLevel: "L2", currentAvg: "L1.9" }
    ]
  });
});

// 3. REGISTER TRAINEE (WITH ONBOARDING QUESTIONNAIRES)
app.post('/api/auth/register-trainee', (req, res) => {
  const {
    name,
    phone,
    currentRole,
    targetRole,
    qualifications,
    workExperienceYears,
    existingSkills,
    certifications,
    previousTraining,
    selfAssessedLevels,
    areasOfInterest
  } = req.body;

  const newId = `USR-${Date.now().toString().slice(-4)}`;
  const roleDef = TARGET_ROLES[targetRole] || TARGET_ROLES["Data Analyst"];
  
  // Initialize verified levels as unverified/pending
  const initialVerified = {};
  roleDef.competencies.forEach(c => {
    initialVerified[c.name] = "Unverified";
  });

  const newUser = {
    id: newId,
    name: name || "Learner Officer",
    phone: phone || "+91 98765 00000",
    accountType: "TRAINEE",
    role: "EMPLOYEE",
    currentRole: currentRole || "Associate",
    targetRole: targetRole || "Data Analyst",
    qualifications: qualifications || "Bachelor's Degree",
    workExperienceYears: Number(workExperienceYears) || 1,
    existingSkills: Array.isArray(existingSkills) ? existingSkills : [existingSkills].filter(Boolean),
    certifications: Array.isArray(certifications) ? certifications : [certifications].filter(Boolean),
    previousTraining: previousTraining || "None",
    selfAssessedLevels: selfAssessedLevels || {},
    verifiedLevels: initialVerified,
    diagnosticCompleted: false,
    areasOfInterest: Array.isArray(areasOfInterest) ? areasOfInterest : [areasOfInterest].filter(Boolean),
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    annualTargetHours: 40,
    completedHours: 0,
    roleFitScore: 0,
    notifications: [
      { id: "n1", text: "Welcome! Complete your diagnostic test to verify your skills.", date: "Just now", type: "info", unread: true }
    ]
  };

  users.unshift(newUser);
  currentUserId = newId;

  res.json({ message: 'Trainee profile registered successfully', user: newUser });
});

// 4. REGISTER TRAINER
app.post('/api/auth/register-trainer', (req, res) => {
  const {
    name,
    phone,
    title,
    organization,
    cvSummary,
    experienceYears,
    teachingHours,
    trainingMode,
    availableResources,
    resumeFileName,
    subjects,
    verifiedLevel
  } = req.body;

  const newTrainerId = `TRN-${Date.now().toString().slice(-4)}`;
  const newUserId = `USR-TRN-${Date.now().toString().slice(-4)}`;

  const subjectList = Array.isArray(subjects) ? subjects : (subjects ? String(subjects).split(',').map(s => s.trim()).filter(Boolean) : ["Excel", "Data Analysis"]);

  const newTrainer = {
    id: newTrainerId,
    name: name || "Mentor Trainer",
    phone: phone || "+91 99999 88888",
    title: title || "Senior Technical Coach",
    organization: organization || "Capacity Development Network",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    experienceYears: Number(experienceYears) || 5,
    teachingHours: Number(teachingHours) || 200,
    trainingMode: trainingMode || "Online / In-person",
    availableResources: availableResources || (subjectList.join(', ')),
    resumeFileName: resumeFileName || "resume_verified.pdf",
    rating: 5.0,
    cvSummary: cvSummary || "Expert mentor with extensive industry experience.",
    subjects: subjectList,
    verifiedLevel: verifiedLevel || "L4",
    availability: "Flexible Daily Batches",
    hourlyRate: "Sponsored via Capacity Grant",
    badges: ["Accredited Subject Mentor", "Verified Trainer"]
  };

  const newTrainerUser = {
    id: newUserId,
    name: newTrainer.name,
    phone: newTrainer.phone,
    accountType: "TRAINER",
    role: "EMPLOYEE",
    currentRole: newTrainer.title,
    targetRole: "Senior Capacity Trainer",
    qualifications: "Master / Ph.D. in Specialized Domain",
    workExperienceYears: newTrainer.experienceYears,
    existingSkills: newTrainer.subjects,
    certifications: ["Accredited Capacity Mentor"],
    previousTraining: newTrainer.organization,
    selfAssessedLevels: {},
    verifiedLevels: {},
    diagnosticCompleted: true,
    avatar: newTrainer.avatar,
    department: newTrainer.organization,
    cadre: "Master Faculty",
    email: `${newTrainer.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@capacityconnect.gov.in`,
    employeeId: newTrainerId,
    annualTargetHours: 100,
    completedHours: 50,
    roleFitScore: 100,
    trainingMode: newTrainer.trainingMode,
    availableResources: newTrainer.availableResources,
    notifications: [
      { id: `n_${Date.now()}`, text: "Welcome to Capacity Connect Trainer Portal! Your profile and documentation have been verified.", date: "Just now", type: "success", unread: true }
    ]
  };

  trainers.unshift(newTrainer);
  users.unshift(newTrainerUser);
  currentUserId = newUserId;

  res.json({ message: 'Trainer account registered successfully', trainer: newTrainer, user: newTrainerUser });
});

// 5. GET CURRENT USER & LOGOUT
app.get('/api/auth/current', (req, res) => {
  const user = users.find(u => u.id === currentUserId) || null;
  res.json(user);
});

app.post('/api/auth/logout', (req, res) => {
  currentUserId = null;
  res.json({ message: 'Logged out successfully' });
});

// 6. TARGET ROLES
app.get('/api/roles/target-roles', (req, res) => {
  res.json(TARGET_ROLES);
});

// 7. DIAGNOSTIC QUESTIONS
app.get('/api/diagnostic/questions', (req, res) => {
  const { role } = req.query;
  const roleDef = TARGET_ROLES[role] || TARGET_ROLES["Data Analyst"];
  const result = {};

  roleDef.competencies.forEach(comp => {
    if (QUESTION_BANK[comp.name]) {
      result[comp.name] = QUESTION_BANK[comp.name];
    }
  });

  res.json({
    role: roleDef.title,
    competencies: roleDef.competencies,
    questionsByCompetency: result
  });
});

// 8. SUBMIT DIAGNOSTIC EVALUATION
app.post('/api/diagnostic/submit', (req, res) => {
  const { targetRole, answers } = req.body;
  const user = users.find(u => u.id === currentUserId);
  const roleDef = TARGET_ROLES[targetRole || user?.targetRole] || TARGET_ROLES["Data Analyst"];

  const competencyResults = [];
  const updatedVerifiedLevels = {};
  let totalAchievedRatio = 0;

  roleDef.competencies.forEach((reqComp) => {
    const compQuestions = QUESTION_BANK[reqComp.name] || [];
    let correctCount = 0;

    compQuestions.forEach((q) => {
      const selected = answers ? answers[q.id] : undefined;
      if (selected !== undefined && Number(selected) === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = compQuestions.length || 5;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const verifiedLevel = scoreToVerifiedLevel(percentage);
    const requiredLevel = reqComp.requiredLevel;

    const reqNum = levelToNum(requiredLevel);
    const verNum = levelToNum(verifiedLevel);
    const gap = reqNum - verNum;

    updatedVerifiedLevels[reqComp.name] = verifiedLevel;
    totalAchievedRatio += Math.min(1.0, verNum / reqNum);

    competencyResults.push({
      competency: reqComp.name,
      description: reqComp.description,
      requiredLevel,
      selfAssessedLevel: user?.selfAssessedLevels?.[reqComp.name] || "L2",
      verifiedLevel,
      scorePercentage: percentage,
      correctCount,
      totalQuestions,
      gapNumeric: gap,
      gapStatus: gap <= 0 ? "No Gap" : `Gap: ${gap} Level${gap > 1 ? 's' : ''}`,
      hasGap: gap > 0
    });
  });

  const overallRoleFit = Math.round((totalAchievedRatio / roleDef.competencies.length) * 100);

  if (user) {
    user.targetRole = roleDef.title;
    user.verifiedLevels = updatedVerifiedLevels;
    user.roleFitScore = overallRoleFit;
    user.diagnosticCompleted = true;
  }

  // Matched trainers & bridge modules for gaps
  const missingComps = competencyResults.filter(c => c.hasGap).map(c => c.competency);
  const matchedTrainers = trainers.filter(t => t.subjects.some(sub => missingComps.includes(sub)));
  const recommendedModules = targetedModules.filter(m => missingComps.includes(m.competency));

  res.json({
    message: 'Diagnostic evaluation complete',
    targetRole: roleDef.title,
    overallRoleFit,
    competencyResults,
    matchedTrainers,
    recommendedModules,
    user
  });
});

// 9. POST-TRAINING RE-EVALUATION
app.post('/api/diagnostic/post-training-assessment', (req, res) => {
  const { competency, answers } = req.body;
  const user = users.find(u => u.id === currentUserId);
  const compQuestions = QUESTION_BANK[competency] || [];

  let correctCount = 0;
  compQuestions.forEach((q) => {
    const selected = answers ? answers[q.id] : undefined;
    if (selected !== undefined && Number(selected) === q.correctAnswer) {
      correctCount++;
    }
  });

  const totalQuestions = compQuestions.length || 5;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const previousLevel = user?.verifiedLevels?.[competency] || "L2";
  const prevNum = levelToNum(previousLevel);

  let newVerifiedLevel = previousLevel;
  if (percentage >= 80) {
    newVerifiedLevel = "L4";
  } else if (percentage >= 60) {
    // If scoring >= 60%, upgrade by at least 1 level (e.g. L3 -> L4, L2 -> L3)
    newVerifiedLevel = prevNum >= 3 ? "L4" : "L3";
  } else if (percentage >= 40) {
    newVerifiedLevel = prevNum >= 2 ? `L${Math.min(4, prevNum)}` : "L2";
  } else {
    newVerifiedLevel = previousLevel;
  }

  // Ensure if score >= 60% and answers are correct, it automatically upgrades to the next level up to L4
  if (percentage >= 60 && levelToNum(newVerifiedLevel) <= prevNum && prevNum < 4) {
    newVerifiedLevel = `L${Math.min(4, prevNum + 1)}`;
  }

  if (user) {
    if (!user.verifiedLevels) user.verifiedLevels = {};
    user.verifiedLevels[competency] = newVerifiedLevel;
    
    // Recalculate fit
    const roleDef = TARGET_ROLES[user.targetRole] || TARGET_ROLES["Data Analyst"];
    let totalAchievedRatio = 0;
    roleDef.competencies.forEach((c) => {
      const vNum = levelToNum(user.verifiedLevels[c.name] || "L1");
      const rNum = levelToNum(c.requiredLevel);
      totalAchievedRatio += Math.min(1.0, vNum / rNum);
    });
    user.roleFitScore = Math.round((totalAchievedRatio / roleDef.competencies.length) * 100);
    user.completedHours = (user.completedHours || 0) + 3;

    user.notifications.unshift({
      id: `n_${Date.now()}`,
      text: `Retest completed! ${competency} verified level updated to ${newVerifiedLevel}.`,
      date: "Just now",
      type: "success",
      unread: true
    });
  }

  let newCert = null;
  if (percentage >= 60 && user) {
    const certId = `CERT-2024-${competency.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    newCert = {
      id: certId,
      userId: user.id,
      userName: user.name,
      courseId: `MOD-${competency.substring(0, 3).toUpperCase()}`,
      courseTitle: `Accredited ${competency} (${newVerifiedLevel}) Competency Mastery`,
      issuedBy: `Capacity Connect Certification Authority`,
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      expiryDate: 'Lifetime',
      grade: `Verified ${newVerifiedLevel} (${percentage}%)`,
      competencyAccredited: `${competency} (${newVerifiedLevel} Proficient)`,
      qrCodeString: `https://capacityconnect.io/verify/${certId}`,
      signatoryName: "Director of Capacity Certification",
      signatoryTitle: "Master Assessor, Capacity Connect"
    };
    certificates.unshift(newCert);
  }

  res.json({
    success: true,
    competency,
    percentage,
    correctCount,
    totalQuestions,
    previousLevel,
    newVerifiedLevel,
    improved: levelToNum(newVerifiedLevel) > levelToNum(previousLevel),
    newOverallFitScore: user?.roleFitScore || 85,
    certificate: newCert,
    user
  });
});

// 10. TRAINERS & BOOKING
app.get('/api/trainers', (req, res) => {
  res.json(trainers);
});

app.post('/api/trainers/book-session', (req, res) => {
  const { trainerId, competency, date, time } = req.body;
  const trainer = trainers.find(t => t.id === trainerId);
  const user = users.find(u => u.id === currentUserId);

  const newBooking = {
    id: `bs_${Date.now()}`,
    trainerId: trainer?.id || trainerId,
    trainerName: trainer?.name || "Mentor Trainer",
    userId: user?.id || "USR-GUEST",
    userName: user?.name || "Officer Trainee",
    userEmail: user?.email || `${(user?.name || 'trainee').toLowerCase().replace(/\s+/g, '')}@gov.in`,
    userRole: user?.currentRole || "Data Analyst Trainee",
    competency: competency || "Excel",
    date: date || "2026-09-29",
    time: time || "10:00 AM - 11:00 AM",
    status: "UPCOMING",
    trainingMode: trainer?.trainingMode || "Online",
    meetLink: `https://capacityconnect.gov.in/live/${(competency || 'session').toLowerCase()}-${Date.now().toString().slice(-4)}`,
    notes: `Dedicated live training session for ${competency || 'Skill Building'}`
  };

  bookedSessions.unshift(newBooking);

  if (user && trainer) {
    user.notifications.unshift({
      id: `n_${Date.now()}`,
      text: `Mentorship session confirmed with ${trainer.name} for ${competency || 'Skill'} on ${newBooking.date} at ${newBooking.time}.`,
      date: "Just now",
      type: "success",
      unread: true
    });
  }

  res.json({ message: 'Session booked successfully', booking: newBooking, trainerName: trainer?.name });
});

// Get Booked Sessions (for Trainer Dashboard)
app.get('/api/trainers/sessions', (req, res) => {
  const user = users.find(u => u.id === currentUserId);
  const trainer = trainers.find(t => t.name === user?.name || t.phone === user?.phone || t.id === user?.employeeId);
  
  if (trainer) {
    const matched = bookedSessions.filter(s => s.trainerId === trainer.id || s.trainerName === trainer.name);
    return res.json(matched.length > 0 ? matched : bookedSessions);
  }
  res.json(bookedSessions);
});

// Update Session Status (Upcoming -> Completed / In-progress)
app.patch('/api/trainers/sessions/:id/status', (req, res) => {
  const { status } = req.body;
  const session = bookedSessions.find(s => s.id === req.params.id);
  if (session) {
    session.status = status;
  }
  res.json({ success: true, session });
});

// Create Scheduled Session by Trainer
app.post('/api/trainers/schedule-session', (req, res) => {
  const { competency, date, time, trainingMode, notes } = req.body;
  const user = users.find(u => u.id === currentUserId);
  const trainer = trainers.find(t => t.name === user?.name || t.phone === user?.phone || t.id === user?.employeeId);

  const newScheduled = {
    id: `bs_${Date.now()}`,
    trainerId: trainer?.id || "TRN-001",
    trainerName: trainer?.name || user?.name || "Mentor Trainer",
    userId: "OPEN_BATCH",
    userName: "Open Batch Learners",
    userEmail: "cohort@capacityconnect.gov.in",
    userRole: "Capacity Learners Batch",
    competency: competency || "Excel",
    date: date || "2026-09-30",
    time: time || "02:00 PM - 03:00 PM",
    status: "UPCOMING",
    trainingMode: trainingMode || "Online",
    meetLink: `https://capacityconnect.gov.in/live/cohort-${Date.now().toString().slice(-4)}`,
    notes: notes || "Open interactive workshop batch"
  };

  bookedSessions.unshift(newScheduled);
  res.json({ success: true, session: newScheduled });
});

// 11. CERTIFICATES
app.get('/api/certificates', (req, res) => {
  res.json(certificates);
});

// 12. LEARNING MODULES
app.get('/api/learning-modules', (req, res) => {
  res.json(targetedModules);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Capacity Connect Server running on http://localhost:${PORT}`);
});
