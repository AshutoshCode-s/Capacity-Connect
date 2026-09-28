import { 
  User, 
  TargetRoleDef, 
  Trainer, 
  TargetedModule, 
  Certificate, 
  ResourceItem, 
  NominationRequest, 
  QuestionItem,
  RoleCompetency
} from '../types';

import {
  TARGET_ROLES,
  QUESTION_BANK,
  REGISTERED_TRAINERS,
  TARGETED_LEARNING_MODULES,
  defaultLearnerUser,
  defaultTrainerUser,
  defaultAdminUser,
  CERTIFICATES,
  RESOURCES,
  NOMINATION_REQUESTS,
  DEPARTMENT_METRICS
} from './mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// In-memory client fallback database
let mockUsers: User[] = [defaultAdminUser, defaultTrainerUser, defaultLearnerUser];
let mockCurrentUser: User | null = null;
let mockRoles: Record<string, TargetRoleDef> = JSON.parse(JSON.stringify(TARGET_ROLES));
let mockQuestions: Record<string, QuestionItem[]> = JSON.parse(JSON.stringify(QUESTION_BANK));
let mockTrainers: Trainer[] = JSON.parse(JSON.stringify(REGISTERED_TRAINERS));
let mockModules: TargetedModule[] = JSON.parse(JSON.stringify(TARGETED_LEARNING_MODULES));
let mockCertificates: Certificate[] = JSON.parse(JSON.stringify(CERTIFICATES));
let mockResources: ResourceItem[] = JSON.parse(JSON.stringify(RESOURCES));
let mockNominations: NominationRequest[] = JSON.parse(JSON.stringify(NOMINATION_REQUESTS));
let mockSessions: any[] = [
  {
    id: "bs_101",
    trainerId: "TRN-001",
    trainerName: "Dr. Suresh Varma",
    userId: "USR-001",
    userName: "Rajesh Kumar",
    userEmail: "rajesh.kumar@capacityconnect.gov.in",
    competency: "Excel",
    date: "2026-09-30",
    time: "10:00 AM - 11:30 AM",
    status: "CONFIRMED",
    meetLink: "https://meet.google.com/cap-conn-ex"
  }
];

// Helper to attempt API network call first, and seamlessly fall back to local mock data on network error
async function tryFetch<T>(fetcher: () => Promise<Response>, fallback: () => T | Promise<T>): Promise<T> {
  try {
    const res = await fetcher();
    if (!res.ok) {
      // If server responded with 400/401/404/500, read JSON if possible
      try {
        const data = await res.json();
        return data;
      } catch {
        return fallback();
      }
    }
    return await res.json();
  } catch {
    // Network failure (server down, CORS, Mixed Content, offline, or localhost unreachable)
    return fallback();
  }
}

export const api = {
  // Health
  async checkHealth(): Promise<{ status: string }> {
    return tryFetch(
      () => fetch(`${API_BASE}/health`),
      () => ({ status: 'ok (client mock mode)' })
    );
  },

  // Auth & OTP
  async sendOtp(phone: string): Promise<{ message: string; otpCode: string; isExistingUser: boolean; user: User | null }> {
    return tryFetch(
      () => fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      }),
      () => {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const matchedUser = mockUsers.find(u => (u.phone || '').replace(/[^0-9]/g, '').includes(cleanPhone) || (cleanPhone.length >= 7 && (u.phone || '').includes(cleanPhone)));
        
        let found = matchedUser || null;
        if (!found) {
          if (cleanPhone.includes('98123') || cleanPhone.includes('9812345678')) {
            found = defaultTrainerUser;
          } else if (cleanPhone.includes('98765') || cleanPhone.includes('9876543210')) {
            found = defaultLearnerUser;
          }
        }

        const otp = '123456';
        return {
          message: `OTP sent successfully to ${phone}`,
          otpCode: otp,
          isExistingUser: !!found,
          user: found
        };
      }
    );
  },

  async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; isNewUser: boolean; user?: User; error?: string }> {
    return tryFetch(
      () => fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      }),
      () => {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        let user = mockUsers.find(u => (u.phone || '').replace(/[^0-9]/g, '').includes(cleanPhone) || (cleanPhone.length >= 7 && (u.phone || '').includes(cleanPhone)));
        
        if (!user) {
          if (cleanPhone.includes('98123') || cleanPhone.includes('9812345678')) {
            user = defaultTrainerUser;
          } else if (cleanPhone.includes('98765') || cleanPhone.includes('9876543210')) {
            user = defaultLearnerUser;
          }
        }

        if (user) {
          mockCurrentUser = user;
          return { success: true, isNewUser: false, user };
        } else {
          return { success: true, isNewUser: true };
        }
      }
    );
  },

  async adminLogin(username: string, password: string): Promise<{ success: boolean; user: User; message?: string; error?: string }> {
    return tryFetch(
      () => fetch(`${API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }),
      () => {
        if (username.trim() === 'admin' && password.trim() === 'admin123') {
          mockCurrentUser = defaultAdminUser;
          return {
            success: true,
            user: defaultAdminUser,
            message: "Admin authenticated successfully (Demo Mode)"
          };
        } else {
          return {
            success: false,
            user: defaultAdminUser,
            error: "Invalid Admin ID or Password. Use admin / admin123"
          };
        }
      }
    );
  },

  async addAdminCompetency(roleName: string, competencyName: string, requiredLevel: string, description?: string): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/admin/competency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleName, competencyName, requiredLevel, description }),
      }),
      () => {
        if (mockRoles[roleName]) {
          const compIdx = mockRoles[roleName].competencies.findIndex(c => c.name.toLowerCase() === competencyName.toLowerCase());
          const newComp: RoleCompetency = {
            name: competencyName,
            requiredLevel,
            description: description || `${competencyName} required level ${requiredLevel}`
          };
          if (compIdx >= 0) {
            mockRoles[roleName].competencies[compIdx] = newComp;
          } else {
            mockRoles[roleName].competencies.push(newComp);
          }
        }
        return { success: true, message: `Competency ${competencyName} updated for ${roleName}` };
      }
    );
  },

  async addAdminTrainer(trainerData: { name: string; subject: string; experienceYears: number; verifiedLevel: string }): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/admin/trainer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainerData),
      }),
      () => {
        const newTrainer: Trainer = {
          id: `TRN-${Date.now().toString().slice(-4)}`,
          name: trainerData.name,
          title: `Senior ${trainerData.subject} Mentor`,
          organization: "National Capacity Network",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          experienceYears: Number(trainerData.experienceYears) || 5,
          teachingHours: 450,
          rating: 4.8,
          cvSummary: `Expert instructor in ${trainerData.subject}.`,
          subjects: [trainerData.subject],
          verifiedLevel: trainerData.verifiedLevel || "L3",
          availability: "Flexible",
          hourlyRate: "Free Government Cohort",
          badges: ["Certified Trainer"]
        };
        mockTrainers.unshift(newTrainer);
        return { success: true, trainer: newTrainer, message: "Trainer added successfully" };
      }
    );
  },

  async deleteAdminTrainer(trainerId: string): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/admin/trainer/${trainerId}`, {
        method: 'DELETE',
      }),
      () => {
        mockTrainers = mockTrainers.filter(t => t.id !== trainerId);
        return { success: true, message: "Trainer deleted successfully" };
      }
    );
  },

  async createAdminRole(roleName: string, description: string, competencies: RoleCompetency[]): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/admin/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleName, description, competencies }),
      }),
      () => {
        const newRole: TargetRoleDef = {
          id: `role_${Date.now()}`,
          title: roleName,
          description: description || `${roleName} professional track`,
          competencies: competencies && competencies.length > 0 ? competencies : [
            { name: "Domain Knowledge", requiredLevel: "L3", description: "Core domain execution" }
          ]
        };
        mockRoles[roleName] = newRole;
        return { success: true, targetRoles: mockRoles, message: `Role ${roleName} created successfully` };
      }
    );
  },

  async addAdminAssessmentQuestion(questionData: any): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/admin/assessment-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
      }),
      () => {
        const comp = questionData.competency || 'Excel';
        if (!mockQuestions[comp]) {
          mockQuestions[comp] = [];
        }
        const newQ: QuestionItem = {
          id: `q_${Date.now()}`,
          competency: comp,
          difficultyLevel: questionData.difficultyLevel || 'L3',
          questionType: questionData.questionType || 'Assessment',
          question: questionData.question,
          options: questionData.options || [],
          correctAnswer: Number(questionData.correctAnswer) || 0,
          explanation: questionData.explanation || 'Verified correct answer.'
        };
        mockQuestions[comp].push(newQ);
        return { success: true, message: `Question added to ${comp}` };
      }
    );
  },

  async getAllAdminQuestions(): Promise<Record<string, QuestionItem[]>> {
    return tryFetch(
      () => fetch(`${API_BASE}/admin/all-questions`),
      () => mockQuestions
    );
  },

  async getAdminAnalytics(): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/admin/analytics`),
      () => ({
        userRise: [
          { month: 'Apr', count: 120 },
          { month: 'May', count: 210 },
          { month: 'Jun', count: 350 },
          { month: 'Jul', count: 480 },
          { month: 'Aug', count: 620 },
          { month: 'Sep', count: 890 }
        ],
        submissionsByCourse: [
          { course: 'Excel L3 Bridge', submissions: 340, passRate: '88%' },
          { course: 'SQL Window Funcs', submissions: 280, passRate: '82%' },
          { course: 'Python Analytics', submissions: 195, passRate: '79%' },
          { course: 'Data Viz Storytelling', submissions: 210, passRate: '94%' },
          { course: 'Executive Comms', submissions: 165, passRate: '91%' }
        ],
        competencyAverages: {
          "Excel": 76,
          "SQL": 68,
          "Python": 64,
          "Data Visualization": 81,
          "Communication": 85
        }
      })
    );
  },

  async registerTrainee(data: any): Promise<{ message: string; user: User }> {
    return tryFetch(
      () => fetch(`${API_BASE}/auth/register-trainee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
      () => {
        const newUser: User = {
          id: `USR-${Date.now().toString().slice(-4)}`,
          name: data.name || "Trainee Officer",
          phone: data.phone || "+91 98765 43210",
          accountType: "TRAINEE",
          role: "EMPLOYEE",
          currentRole: data.currentRole || "Junior Officer",
          targetRole: data.targetRole || "Data Analyst",
          qualifications: data.qualifications || "Degree",
          workExperienceYears: Number(data.workExperienceYears) || 2,
          existingSkills: Array.isArray(data.existingSkills) ? data.existingSkills : (data.existingSkills ? data.existingSkills.split(',').map((s: string) => s.trim()) : []),
          certifications: Array.isArray(data.certifications) ? data.certifications : (data.certifications ? data.certifications.split(',').map((s: string) => s.trim()) : []),
          previousTraining: data.previousTraining || "",
          areasOfInterest: Array.isArray(data.areasOfInterest) ? data.areasOfInterest : (data.areasOfInterest ? data.areasOfInterest.split(',').map((s: string) => s.trim()) : []),
          selfAssessedLevels: data.selfAssessedLevels || { "Excel": "L2", "SQL": "L2", "Python": "L2", "Data Visualization": "L2", "Communication": "L2" },
          verifiedLevels: {},
          diagnosticCompleted: false,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          department: "Public Administration",
          cadre: "Technical Assistant",
          email: `${(data.name || 'trainee').toLowerCase().replace(/\s+/g, '.')}@capacityconnect.gov.in`,
          employeeId: `EMP-${Date.now().toString().slice(-4)}`,
          annualTargetHours: 40,
          completedHours: 0,
          roleFitScore: 50,
          mandatoryCompletion: 0,
          notifications: [
            { id: "n_welcome", text: "Welcome to CAPACITY CONNECT! Take your diagnostic assessment to establish your competency baseline.", date: "Just now", type: "info", unread: true }
          ]
        };
        mockUsers.push(newUser);
        mockCurrentUser = newUser;
        return { message: "Trainee registered successfully", user: newUser };
      }
    );
  },

  async registerTrainer(data: any): Promise<{ message: string; trainer: Trainer }> {
    return tryFetch(
      () => fetch(`${API_BASE}/auth/register-trainer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
      () => {
        const newTrainer: Trainer = {
          id: `TRN-${Date.now().toString().slice(-4)}`,
          name: data.name || "Mentor Officer",
          phone: data.phone || "+91 98123 45678",
          title: data.title || "Capacity Trainer",
          organization: data.organization || "Capacity Network",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          experienceYears: Number(data.experienceYears) || 8,
          teachingHours: Number(data.teachingHours) || 120,
          rating: 4.9,
          cvSummary: data.cvSummary || "Experienced subject matter expert.",
          subjects: Array.isArray(data.subjects) ? data.subjects : (data.subjects ? data.subjects.split(',').map((s: string) => s.trim()) : ["Excel", "SQL"]),
          verifiedLevel: data.verifiedLevel || "L4 Expert",
          availability: "Weekdays & Weekends",
          hourlyRate: "Government Honorarium",
          badges: ["Certified Master Trainer"]
        };
        mockTrainers.push(newTrainer);
        return { message: "Trainer registered successfully", trainer: newTrainer };
      }
    );
  },

  async getUsers(): Promise<User[]> {
    return tryFetch(
      () => fetch(`${API_BASE}/auth/users`),
      () => mockUsers
    );
  },

  async getCurrentUser(): Promise<User> {
    return tryFetch(
      () => fetch(`${API_BASE}/auth/current`),
      () => mockCurrentUser || defaultLearnerUser
    );
  },

  async switchRole(userId: string): Promise<{ message: string; user: User }> {
    return tryFetch(
      () => fetch(`${API_BASE}/auth/switch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      }),
      () => {
        const found = mockUsers.find(u => u.id === userId) || defaultLearnerUser;
        mockCurrentUser = found;
        return { message: `Switched to ${found.name}`, user: found };
      }
    );
  },

  // Target Roles & Question Bank
  async getTargetRoles(): Promise<Record<string, TargetRoleDef>> {
    return tryFetch(
      () => fetch(`${API_BASE}/roles/target-roles`),
      () => mockRoles
    );
  },

  async getDiagnosticQuestions(role?: string, competencies?: string[]): Promise<{
    role: string;
    competenciesCount: number;
    questionsByCompetency: Record<string, QuestionItem[]>;
  }> {
    return tryFetch(
      () => {
        const params = new URLSearchParams();
        if (role) params.append('role', role);
        if (competencies && competencies.length) params.append('competencies', competencies.join(','));
        return fetch(`${API_BASE}/diagnostic/questions?${params.toString()}`);
      },
      () => {
        const roleKey = role || "Data Analyst";
        const roleDef = mockRoles[roleKey] || mockRoles["Data Analyst"];
        const compNames = (competencies && competencies.length > 0)
          ? competencies
          : (roleDef?.competencies?.map(c => c.name) || Object.keys(mockQuestions));

        const filteredQ: Record<string, QuestionItem[]> = {};
        compNames.forEach(comp => {
          if (mockQuestions[comp]) {
            filteredQ[comp] = mockQuestions[comp];
          }
        });

        return {
          role: roleKey,
          competenciesCount: compNames.length,
          questionsByCompetency: filteredQ
        };
      }
    );
  },

  async submitDiagnostic(targetRole: string, answers: Record<string, number>): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/diagnostic/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, answers }),
      }),
      () => {
        const roleDef = mockRoles[targetRole] || mockRoles["Data Analyst"];
        const comps = roleDef?.competencies || [];
        const verifiedLevels: Record<string, string> = {};
        const results: any[] = [];
        let totalScore = 0;

        comps.forEach(comp => {
          const qList = mockQuestions[comp.name] || [];
          let correct = 0;
          const evaluations: any[] = [];

          qList.forEach(q => {
            const userAns = answers[q.id];
            const isCorr = userAns !== undefined && Number(userAns) === Number(q.correctAnswer);
            if (isCorr) correct++;
            evaluations.push({
              id: q.id,
              question: q.question,
              difficultyLevel: q.difficultyLevel,
              selectedOption: userAns,
              correctAnswer: q.correctAnswer,
              isCorrect: isCorr,
              explanation: q.explanation
            });
          });

          const totalQ = qList.length || 1;
          const scorePct = Math.round((correct / totalQ) * 100);
          totalScore += scorePct;

          let vLvl = "L1";
          if (scorePct >= 80) vLvl = "L4";
          else if (scorePct >= 60) vLvl = "L3";
          else if (scorePct >= 40) vLvl = "L2";
          verifiedLevels[comp.name] = vLvl;

          results.push({
            competency: comp.name,
            description: comp.description,
            requiredLevel: comp.requiredLevel,
            selfAssessedLevel: "L2",
            verifiedLevel: vLvl,
            scorePercentage: scorePct,
            correctCount: correct,
            totalQuestions: totalQ,
            gapNumeric: Math.max(0, parseInt(comp.requiredLevel.replace('L','')) - parseInt(vLvl.replace('L',''))),
            gapStatus: vLvl >= comp.requiredLevel ? "Meets Requirement" : "Skill Gap Identified",
            hasGap: vLvl < comp.requiredLevel,
            questionEvaluations: evaluations
          });
        });

        const overallFit = comps.length > 0 ? Math.round(totalScore / comps.length) : 75;

        if (mockCurrentUser) {
          mockCurrentUser.verifiedLevels = verifiedLevels;
          mockCurrentUser.roleFitScore = overallFit;
          mockCurrentUser.diagnosticCompleted = true;
        }

        return {
          message: "Diagnostic assessment processed successfully",
          targetRole,
          roleFitScore: overallFit,
          verifiedLevels,
          results
        };
      }
    );
  },

  async submitPostTrainingAssessment(competency: string, answers: Record<string, number>): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/diagnostic/post-training-assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competency, answers }),
      }),
      () => {
        const qList = mockQuestions[competency] || [];
        let correct = 0;
        qList.forEach(q => {
          if (Number(answers[q.id]) === Number(q.correctAnswer)) correct++;
        });
        const total = qList.length || 1;
        const scorePct = Math.round((correct / total) * 100);
        const passed = scorePct >= 70;

        let cert: Certificate | null = null;
        if (passed) {
          cert = {
            id: `CERT-${Date.now().toString().slice(-6)}`,
            userId: mockCurrentUser?.id || "USR-001",
            userName: mockCurrentUser?.name || "Rajesh Kumar",
            courseId: `MOD-${competency.slice(0,3).toUpperCase()}-L3`,
            courseTitle: `Advanced ${competency} Professional Certification`,
            issuedBy: "Capacity Connect Assessment Board",
            issueDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 2 * 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
            grade: scorePct >= 90 ? "A+ (Distinction)" : "A (Proficient)",
            competencyAccredited: `${competency} L3`,
            qrCodeString: `CAPCONNECT-VERIFY-${competency.toUpperCase()}-L3-${Date.now()}`,
            signatoryName: "Dr. Suresh Varma",
            signatoryTitle: "Chief Assessment Officer"
          };
          mockCertificates.unshift(cert);
        }

        return {
          message: passed ? "Post-training assessment passed!" : "Assessment submitted.",
          competency,
          passed,
          scorePercentage: scorePct,
          certificate: cert
        };
      }
    );
  },

  // Trainers
  async getTrainers(): Promise<Trainer[]> {
    return tryFetch(
      () => fetch(`${API_BASE}/trainers`),
      () => mockTrainers
    );
  },

  async bookTrainerSession(trainerId: string, competency: string, date?: string, time?: string): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/trainers/book-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainerId, competency, date, time }),
      }),
      () => {
        const trn = mockTrainers.find(t => t.id === trainerId);
        const session = {
          id: `bs_${Date.now()}`,
          trainerId,
          trainerName: trn?.name || "Dr. Suresh Varma",
          userId: mockCurrentUser?.id || "USR-001",
          userName: mockCurrentUser?.name || "Rajesh Kumar",
          userEmail: mockCurrentUser?.email || "rajesh.kumar@capacityconnect.gov.in",
          competency: competency || "Excel",
          date: date || "2026-10-02",
          time: time || "11:00 AM - 12:30 PM",
          status: "CONFIRMED",
          meetLink: "https://meet.google.com/cap-conn-live"
        };
        mockSessions.unshift(session);
        return { message: "Session booked successfully", session };
      }
    );
  },

  async getTrainerSessions(): Promise<any[]> {
    return tryFetch(
      () => fetch(`${API_BASE}/trainers/sessions`),
      () => mockSessions
    );
  },

  async updateSessionStatus(sessionId: string, status: string): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/trainers/sessions/${sessionId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }),
      () => {
        const session = mockSessions.find(s => s.id === sessionId);
        if (session) session.status = status;
        return { message: "Session status updated", session };
      }
    );
  },

  async scheduleSession(data: any): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/trainers/schedule-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
      () => {
        const newSession = {
          id: `bs_${Date.now()}`,
          ...data,
          status: "SCHEDULED"
        };
        mockSessions.unshift(newSession);
        return { message: "Session scheduled successfully", session: newSession };
      }
    );
  },

  // Targeted Modules
  async getLearningModules(): Promise<TargetedModule[]> {
    return tryFetch(
      () => fetch(`${API_BASE}/learning-modules`),
      () => mockModules
    );
  },

  // Certificates
  async getCertificates(): Promise<Certificate[]> {
    return tryFetch(
      () => fetch(`${API_BASE}/certificates`),
      () => mockCertificates
    );
  },

  // Resources
  async getResources(): Promise<ResourceItem[]> {
    return tryFetch(
      () => fetch(`${API_BASE}/resources`),
      () => mockResources
    );
  },

  async recordDownload(id: string): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/resources/${id}/download`, {
        method: 'POST',
      }),
      () => {
        const r = mockResources.find(res => res.id === id);
        if (r) r.downloadCount++;
        return { success: true, downloadCount: r?.downloadCount || 1 };
      }
    );
  },

  // Nominations
  async getNominations(): Promise<NominationRequest[]> {
    return tryFetch(
      () => fetch(`${API_BASE}/nominations`),
      () => mockNominations
    );
  },

  async createNomination(data: any): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/nominations/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
      () => {
        const newNom: NominationRequest = {
          id: `nom_${Date.now()}`,
          applicantId: mockCurrentUser?.id || "USR-001",
          applicantName: mockCurrentUser?.name || "Rajesh Kumar",
          designation: mockCurrentUser?.currentRole || "Associate Data Analyst",
          courseId: data.courseId || "MOD-EX-L2L3",
          courseTitle: data.courseTitle || "Bridging Excel L2 to L3",
          institute: data.institute || "National Institute of Capacity Building",
          requestedOn: new Date().toISOString().split('T')[0],
          status: "PENDING",
          justification: data.justification || "Required for bridging identified competency gap.",
          competencyImpact: data.competencyImpact || "High",
          supervisorRemarks: null
        };
        mockNominations.unshift(newNom);
        return { message: "Nomination request submitted successfully", nomination: newNom };
      }
    );
  },

  async actionNomination(id: string, status: 'APPROVED' | 'REJECTED', remarks?: string): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/nominations/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks }),
      }),
      () => {
        const nom = mockNominations.find(n => n.id === id);
        if (nom) {
          nom.status = status;
          nom.supervisorRemarks = remarks || null;
          nom.reviewedOn = new Date().toISOString().split('T')[0];
        }
        return { message: `Nomination ${status.toLowerCase()}`, nomination: nom };
      }
    );
  },

  // Analytics
  async getDepartmentAnalytics(): Promise<any> {
    return tryFetch(
      () => fetch(`${API_BASE}/analytics/department`),
      () => DEPARTMENT_METRICS
    );
  }
};
