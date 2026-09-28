'use client';

import React, { useState, useEffect } from 'react';
import { User, TargetRoleDef, Trainer, TargetedModule, Certificate, QuestionItem } from '../types';
import { api } from '../services/api';

import SimpleNavbar from '../components/SimpleNavbar';
import LoginPage from '../components/LoginPage';
import OnboardingWizard from '../components/OnboardingWizard';
import Dashboard from '../components/Dashboard';
import TrainerDashboard from '../components/TrainerDashboard';
import AdminDashboard from '../components/AdminDashboard';
import AdminLoginModal from '../components/AdminLoginModal';
import VerificationTestModal from '../components/VerificationTestModal';
import TrainerRegisterModal from '../components/TrainerRegisterModal';
import CertificateModal from '../components/CertificateModal';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [targetRoles, setTargetRoles] = useState<Record<string, TargetRoleDef>>({});
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [learningModules, setLearningModules] = useState<TargetedModule[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [questionsByCompetency, setQuestionsByCompetency] = useState<Record<string, QuestionItem[]>>({});

  // App flow states
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingPhone, setOnboardingPhone] = useState('');
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Load initial definitions
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [currentU, rolesData, trnList, modList, certList, qData] = await Promise.all([
        api.getCurrentUser(),
        api.getTargetRoles(),
        api.getTrainers(),
        api.getLearningModules(),
        api.getCertificates(),
        api.getDiagnosticQuestions('Data Analyst')
      ]);

      setCurrentUser(currentU);
      setTargetRoles(rolesData || {});
      setTrainers(trnList || []);
      setLearningModules(modList || []);
      setCertificates(certList || []);
      setQuestionsByCompetency(qData?.questionsByCompetency || {});
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Fetch questions whenever current user's target role changes
  useEffect(() => {
    if (currentUser?.targetRole && currentUser.accountType !== 'ADMIN') {
      api.getDiagnosticQuestions(currentUser.targetRole).then(res => {
        if (res?.questionsByCompetency) {
          setQuestionsByCompetency(res.questionsByCompetency);
        }
      }).catch(console.error);
    }
  }, [currentUser?.targetRole]);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsOnboarding(false);
    setIsAdminLoginOpen(false);
    api.getCertificates().then(setCertificates);
  };

  const handleStartOnboarding = (phone: string, accountType: 'TRAINEE' | 'TRAINER') => {
    setOnboardingPhone(phone);
    if (accountType === 'TRAINER') {
      setIsTrainerModalOpen(true);
    } else {
      setIsOnboarding(true);
    }
  };

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { method: 'POST' }).catch(() => {});
    setCurrentUser(null);
    setIsOnboarding(false);
  };

  // Test & Assessment Submissions
  const handleSubmitTest = async (answers: Record<string, number>) => {
    if (!currentUser) return null;
    const res = await api.submitDiagnostic(currentUser.targetRole, answers);
    if (res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const handleSubmitPostTraining = async (competency: string, answers: Record<string, number>) => {
    const res = await api.submitPostTrainingAssessment(competency, answers);
    if (res.user) {
      setCurrentUser(res.user);
    }
    const certs = await api.getCertificates();
    setCertificates(certs);
    return res;
  };

  const handleBookTrainer = async (trainerId: string, competency: string) => {
    const res = await api.bookTrainerSession(trainerId, competency);
    const updatedUser = await api.getCurrentUser();
    if (updatedUser) setCurrentUser(updatedUser);
    return res;
  };

  const ALL_DEFAULT_ROLES: Record<string, TargetRoleDef> = {
    "Data Analyst": {
      id: 'role_da',
      title: 'Data Analyst',
      description: 'Data analysis, querying, and reporting',
      competencies: [
        { name: "Excel", requiredLevel: "L3", description: "Formulas & Pivot Tables" },
        { name: "SQL", requiredLevel: "L3", description: "Queries & Joins" },
        { name: "Python", requiredLevel: "L3", description: "Pandas & Scripting" },
        { name: "Data Visualization", requiredLevel: "L3", description: "Dashboards & Visuals" },
        { name: "Communication", requiredLevel: "L2", description: "Reporting & Presentation" }
      ]
    },
    "Software Developer": {
      id: 'role_sd',
      title: 'Software Developer',
      description: 'Builds applications and backend services',
      competencies: [
        { name: "Programming", requiredLevel: "L3", description: "OOP, Logic, and Architecture" },
        { name: "Data Structures & Algorithms", requiredLevel: "L3", description: "Arrays, Trees, Graphs, and Complexity" },
        { name: "Database", requiredLevel: "L2", description: "Relational Modeling and SQL" },
        { name: "Git & Version Control", requiredLevel: "L2", description: "Branching, PRs, and Collaboration" },
        { name: "Software Testing", requiredLevel: "L2", description: "Unit Tests and Quality Assurance" }
      ]
    },
    "Project Manager": {
      id: 'role_pm',
      title: 'Project Manager',
      description: 'Manages project delivery and risks',
      competencies: [
        { name: "Project Planning", requiredLevel: "L3", description: "WBS, Timelines, and Gantt Charts" },
        { name: "Communication", requiredLevel: "L4", description: "Executive Updates and Alignment" },
        { name: "Team Management", requiredLevel: "L3", description: "Task Delegation and Agile Delivery" },
        { name: "Risk Management", requiredLevel: "L3", description: "Risk Registers and Mitigation Plans" },
        { name: "Problem Solving", requiredLevel: "L3", description: "Root Cause Analysis and Solutions" }
      ]
    }
  };

  const activeTargetRole = currentUser?.targetRole || 'Data Analyst';
  const targetRoleDef = targetRoles[activeTargetRole] || ALL_DEFAULT_ROLES[activeTargetRole] || ALL_DEFAULT_ROLES['Data Analyst'];

  const activeCertificate = certificates.find((c) => c.id === selectedCertId) || certificates[0] || null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Simple, Clean Navbar with Top-Left Admin Login */}
      <SimpleNavbar
        user={currentUser}
        onLogout={handleLogout}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-9 h-9 border-3 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-500">Loading...</p>
          </div>
        ) : isOnboarding ? (
          /* STEP 2: ONBOARDING QUESTIONNAIRE */
          <OnboardingWizard
            phone={onboardingPhone}
            targetRoles={targetRoles}
            onSubmitTrainee={api.registerTrainee}
            onComplete={(user) => {
              setCurrentUser(user);
              setIsOnboarding(false);
            }}
          />
        ) : currentUser ? (
          currentUser.accountType === 'ADMIN' ? (
            /* STEP 3C: ADMIN DASHBOARD */
            <AdminDashboard
              user={currentUser}
              trainers={trainers}
              targetRoles={targetRoles}
              onRefreshData={() => {
                api.getTargetRoles().then(setTargetRoles);
                api.getTrainers().then(setTrainers);
              }}
            />
          ) : currentUser.accountType === 'TRAINER' ? (
            /* STEP 3B: TRAINER DASHBOARD */
            <TrainerDashboard
              user={currentUser}
              trainers={trainers}
              onRefreshData={() => {
                api.getCurrentUser().then(setCurrentUser);
                api.getTrainers().then(setTrainers);
              }}
            />
          ) : (
            /* STEP 3A: TRAINEE DASHBOARD */
            <Dashboard
              user={currentUser}
              targetRoleDef={targetRoleDef}
              trainers={trainers}
              learningModules={learningModules}
              certificates={certificates}
              questionsByCompetency={questionsByCompetency}
              onOpenTest={() => setIsVerificationModalOpen(true)}
              onBookTrainer={handleBookTrainer}
              onSubmitPostTraining={handleSubmitPostTraining}
              onOpenCertificate={(certId) => setSelectedCertId(certId)}
            />
          )
        ) : (
          /* STEP 1: LOGIN PAGE */
          <LoginPage
            onSendOtp={api.sendOtp}
            onVerifyOtp={api.verifyOtp}
            onLoginSuccess={handleLoginSuccess}
            onStartOnboarding={handleStartOnboarding}
          />
        )}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-auto">
        Capacity Connect
      </footer>

      {/* Admin Login Modal (ID & Password) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Verification Skills Test Modal */}
      {currentUser && (
        <VerificationTestModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          targetRoleDef={targetRoleDef}
          questionsByCompetency={questionsByCompetency}
          onSubmitTest={handleSubmitTest}
        />
      )}

      {/* Trainer Registration Modal */}
      <TrainerRegisterModal
        isOpen={isTrainerModalOpen}
        phone={onboardingPhone}
        onClose={() => setIsTrainerModalOpen(false)}
        onSubmitTrainer={api.registerTrainer}
        onSuccess={(trainer, user) => {
          api.getTrainers().then(setTrainers);
          if (user) {
            setCurrentUser(user);
          } else {
            api.getCurrentUser().then(setCurrentUser);
          }
        }}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedCertId}
        onClose={() => setSelectedCertId(null)}
        certificate={activeCertificate}
      />

    </div>
  );
}
