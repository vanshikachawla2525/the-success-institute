export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  achievement: string;
  stream: 'Medical' | 'Non-Medical' | 'Commerce' | 'Foundation';
  scoreInfo: string;
  quote: string;
  journey: {
    phase: string;
    description: string;
  }[];
}

export interface Program {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  highlights: string[];
  actionText: string;
  badge?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'completed';
}

export interface MockTest {
  id: string;
  title: string;
  subject: string;
  totalQuestions: number;
  durationMinutes: number;
  status: 'available' | 'completed';
  score?: number; // percentage e.g. 88
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface RegistrationSubmission {
  fullName: string;
  phoneNumber: string;
  program: string;
  queries: string;
  submittedAt: string;
}
