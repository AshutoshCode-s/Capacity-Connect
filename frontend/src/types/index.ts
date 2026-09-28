export type UserRole = 'EMPLOYEE' | 'SUPERVISOR' | 'ADMIN';
export type AccountType = 'TRAINEE' | 'TRAINER' | 'SUPERVISOR' | 'ADMIN';

export type CompetencyLevel = 'L1' | 'L2' | 'L3' | 'L4';

export interface Competency {
  id?: string;
  name: string;
  category?: 'DOMAIN' | 'FUNCTIONAL' | 'BEHAVIORAL';
  code?: string;
  description: string;
  benchmarkLevel?: number;
  currentLevel?: number;
  gap?: number;
  skills?: string[];
  recommendedCourses?: string[];
}

export interface Course {
  id: string;
  title: string;
  code?: string;
  tagline?: string;
  category?: string;
  primaryCompetency?: string;
  level?: string;
  duration?: string;
  department?: string;
  mandatory?: boolean;
  thumbnail?: string;
  rating?: number;
  enrolledCount?: number;
  description?: string;
  skillsTaught?: string[];
  deliveryMode?: string;
  provider?: string;
  instructor?: string;
  userProgress?: number;
  userStatus?: string;
  isEnrolled?: boolean;
  completedModuleIds?: string[];
  passingPercentage?: number;
  quizScore?: number;
  currentModuleId?: string;
  certificateId?: string | null;
  curriculum: CourseModule[];
  quiz: QuizQuestion[];
}

export interface CourseModule {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'exercise' | string;
  duration?: string;
  videoUrl?: string;
  content?: string;
  summary?: string;
  completed?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface User {
  id: string;
  name: string;
  phone?: string;
  accountType?: AccountType;
  role: UserRole;
  currentRole: string;
  designation?: string;
  targetRole: string;
  qualifications: string;
  workExperienceYears: number;
  existingSkills: string[];
  certifications: string[];
  previousTraining: string;
  areasOfInterest: string[];
  selfAssessedLevels: Record<string, string>; // Marked as UNVERIFIED
  verifiedLevels: Record<string, string>;     // From Diagnostic Assessment
  diagnosticCompleted: boolean;
  avatar: string;
  department: string;
  cadre: string;
  email: string;
  employeeId: string;
  serviceBookNo?: string;
  reportingOfficer?: string;
  annualTargetHours: number;
  completedHours: number;
  roleFitScore: number;
  mandatoryCompletion: number;
  notifications: Array<{
    id: string;
    text: string;
    date: string;
    type: 'warning' | 'success' | 'info' | 'urgent';
    unread: boolean;
  }>;
}

export interface RoleCompetency {
  name: string;
  requiredLevel: string; // e.g. "L3"
  description?: string;
}

export interface TargetRoleDef {
  id: string;
  title: string;
  description: string;
  department?: string;
  competencies: RoleCompetency[];
}

export interface QuestionItem {
  id: string;
  competency: string;
  difficultyLevel: 'L1' | 'L2' | 'L3' | 'L4';
  questionType: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Trainer {
  id: string;
  name: string;
  phone?: string;
  title: string;
  organization: string;
  avatar: string;
  experienceYears: number;
  teachingHours: number;
  rating: number;
  cvSummary: string;
  subjects: string[];
  verifiedLevel: string;
  trainingMode?: string;
  availableResources?: string;
  availability: string;
  hourlyRate: string;
  badges: string[];
}

export interface TargetedModule {
  id: string;
  competency: string;
  fromLevel: string;
  toLevel: string;
  title: string;
  duration: string;
  difficulty: string;
  curriculumSummary: string;
  trainerId: string;
  enrolledCount: number;
}

export interface CompetencyEvaluationResult {
  competency: string;
  description: string;
  requiredLevel: string;
  selfAssessedLevel: string;
  verifiedLevel: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  gapNumeric: number;
  gapStatus: string;
  hasGap: boolean;
  questionEvaluations: Array<{
    id: string;
    question: string;
    difficultyLevel: string;
    selectedOption?: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
  }>;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  grade: string;
  competencyAccredited: string;
  qrCodeString: string;
  signatoryName: string;
  signatoryTitle: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  format: string;
  competencyTag: string;
  department: string;
  publishedDate: string;
  downloadCount: number;
  downloadUrl: string;
  summary: string;
}

export interface NominationRequest {
  id: string;
  applicantId: string;
  applicantName: string;
  designation: string;
  courseId: string;
  courseTitle: string;
  institute: string;
  requestedOn: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  justification: string;
  competencyImpact: string;
  supervisorRemarks?: string | null;
  reviewedOn?: string;
}
