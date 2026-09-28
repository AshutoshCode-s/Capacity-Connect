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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  // Health
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Auth & OTP
  async sendOtp(phone: string): Promise<{ message: string; otpCode: string; isExistingUser: boolean; user: User | null }> {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return res.json();
  },

  async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; isNewUser: boolean; user?: User; error?: string }> {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    return res.json();
  },

  async adminLogin(username: string, password: string): Promise<{ success: boolean; user: User; message?: string; error?: string }> {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  async addAdminCompetency(roleName: string, competencyName: string, requiredLevel: string, description?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/competency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleName, competencyName, requiredLevel, description }),
    });
    return res.json();
  },

  async addAdminTrainer(trainerData: { name: string; subject: string; experienceYears: number; verifiedLevel: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/trainer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trainerData),
    });
    return res.json();
  },

  async deleteAdminTrainer(trainerId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/trainer/${trainerId}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async createAdminRole(roleName: string, description: string, competencies: any[]): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleName, description, competencies }),
    });
    return res.json();
  },

  async addAdminAssessmentQuestion(questionData: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/assessment-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData),
    });
    return res.json();
  },

  async getAllAdminQuestions(): Promise<Record<string, QuestionItem[]>> {
    const res = await fetch(`${API_BASE}/admin/all-questions`);
    return res.json();
  },

  async getAdminAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/analytics`);
    return res.json();
  },

  async registerTrainee(data: any): Promise<{ message: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register-trainee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async registerTrainer(data: any): Promise<{ message: string; trainer: Trainer }> {
    const res = await fetch(`${API_BASE}/auth/register-trainer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/current`);
    return res.json();
  },

  async switchRole(userId: string): Promise<{ message: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  // Target Roles & Question Bank
  async getTargetRoles(): Promise<Record<string, TargetRoleDef>> {
    const res = await fetch(`${API_BASE}/roles/target-roles`);
    return res.json();
  },

  async getDiagnosticQuestions(role?: string, competencies?: string[]): Promise<{
    role: string;
    competenciesCount: number;
    questionsByCompetency: Record<string, QuestionItem[]>;
  }> {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (competencies && competencies.length) params.append('competencies', competencies.join(','));
    const res = await fetch(`${API_BASE}/diagnostic/questions?${params.toString()}`);
    return res.json();
  },

  async submitDiagnostic(targetRole: string, answers: Record<string, number>): Promise<any> {
    const res = await fetch(`${API_BASE}/diagnostic/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetRole, answers }),
    });
    return res.json();
  },

  async submitPostTrainingAssessment(competency: string, answers: Record<string, number>): Promise<any> {
    const res = await fetch(`${API_BASE}/diagnostic/post-training-assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ competency, answers }),
    });
    return res.json();
  },

  // Trainers
  async getTrainers(): Promise<Trainer[]> {
    const res = await fetch(`${API_BASE}/trainers`);
    return res.json();
  },

  async bookTrainerSession(trainerId: string, competency: string, date?: string, time?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/trainers/book-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trainerId, competency, date, time }),
    });
    return res.json();
  },

  async getTrainerSessions(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/trainers/sessions`);
    return res.json();
  },

  async updateSessionStatus(sessionId: string, status: string): Promise<any> {
    const res = await fetch(`${API_BASE}/trainers/sessions/${sessionId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async scheduleSession(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/trainers/schedule-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Targeted Modules
  async getLearningModules(): Promise<TargetedModule[]> {
    const res = await fetch(`${API_BASE}/learning-modules`);
    return res.json();
  },

  // Certificates
  async getCertificates(): Promise<Certificate[]> {
    const res = await fetch(`${API_BASE}/certificates`);
    return res.json();
  },

  // Resources
  async getResources(): Promise<ResourceItem[]> {
    const res = await fetch(`${API_BASE}/resources`);
    return res.json();
  },

  async recordDownload(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/resources/${id}/download`, {
      method: 'POST',
    });
    return res.json();
  },

  // Nominations
  async getNominations(): Promise<NominationRequest[]> {
    const res = await fetch(`${API_BASE}/nominations`);
    return res.json();
  },

  async createNomination(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/nominations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async actionNomination(id: string, status: 'APPROVED' | 'REJECTED', remarks?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/nominations/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, remarks }),
    });
    return res.json();
  },

  // Analytics
  async getDepartmentAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/department`);
    return res.json();
  }
};
