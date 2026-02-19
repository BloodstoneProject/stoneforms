// Question/Block Types
export type QuestionType = 
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'number'
  | 'multiple_choice'
  | 'dropdown'
  | 'rating'
  | 'yes_no'
  | 'date'
  | 'file_upload'
  | 'video'
  | 'audio';

export interface Choice {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  choices?: Choice[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  properties?: Record<string, any>;
  order: number;
}

// Logic/Branching Types
export interface LogicRule {
  id: string;
  questionId: string;
  condition: {
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  };
  action: {
    type: 'jump_to' | 'show' | 'hide' | 'end';
    targetId?: string;
  };
}

// Theme Types
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    background: string;
    text: string;
    button: string;
    buttonText: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  backgroundImage?: string;
  logo?: string;
}

// Form Types
export interface Form {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  questions: Question[];
  logic: LogicRule[];
  theme: Theme;
  settings: {
    showProgressBar: boolean;
    allowMultipleSubmissions: boolean;
    requireEmail: boolean;
    redirectUrl?: string;
    customEndingMessage?: string;
  };
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  responseCount?: number;
  viewCount?: number;
  completionRate?: number;
}

// Submission Types
export interface Answer {
  questionId: string;
  value: any;
  type: QuestionType;
}

export interface Submission {
  id: string;
  formId: string;
  answers: Answer[];
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    utmParams?: Record<string, string>;
    startedAt: string;
    completedAt?: string;
    timeSpent?: number;
  };
  contactId?: string;
  tags?: string[];
  status?: 'pending' | 'completed' | 'incomplete';
  createdAt: string;
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members: WorkspaceMember[];
  settings: {
    allowSignups: boolean;
    customDomain?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

// CRM Types
export interface Contact {
  id: string;
  workspaceId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  position?: string;
  source?: string;
  notes?: string;
  properties?: Record<string, any>;
  customFields?: Record<string, any>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
}

export interface Deal {
  id: string;
  workspaceId: string;
  contactId: string;
  title: string;
  value: number;
  currency: string;
  stage: string;
  probability: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  status: 'open' | 'won' | 'lost';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pipeline {
  id: string;
  workspaceId: string;
  name: string;
  stages: PipelineStage[];
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number;
}

// Quiz Types
export interface QuizQuestion extends Question {
  correctAnswer?: any;
  points?: number;
  explanation?: string;
}

export interface QuizSettings {
  passingScore: number;
  showCorrectAnswers: boolean;
  showScore: boolean;
  allowRetake: boolean;
  certificateTemplate?: string;
  timeLimit?: number;
  randomizeQuestions?: boolean;
  randomizeChoices?: boolean;
}

export interface QuizResult {
  score: number;
  totalPoints: number;
  earnedPoints: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  answers: QuizAnswer[];
  certificateUrl?: string;
}

export interface QuizAnswer extends Answer {
  isCorrect: boolean;
  pointsEarned: number;
  explanation?: string;
}

// Email Automation Types
export interface EmailTemplate {
  id: string;
  workspaceId: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailAutomation {
  id: string;
  formId: string;
  type: 'auto_responder' | 'sequence' | 'conditional';
  trigger: AutomationTrigger;
  template: EmailTemplate;
  delay?: number;
  conditions?: AutomationCondition[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Workflow Types
export interface Workflow {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTrigger {
  type: 'form_submitted' | 'score_achieved' | 'answer_given' | 'contact_tagged' | 'deal_stage_changed' | 'time_elapsed';
  formId?: string;
  conditions?: AutomationCondition[];
}

export interface WorkflowAction {
  id: string;
  type: 'send_email' | 'create_deal' | 'update_contact' | 'add_tag' | 'webhook' | 'slack_notify' | 'update_sheet';
  config: Record<string, any>;
  delay?: number;
}

export interface AutomationTrigger {
  type: 'form_submit' | 'quiz_pass' | 'quiz_fail' | 'score_range';
  scoreMin?: number;
  scoreMax?: number;
}

export interface AutomationCondition {
  questionId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

// Payment Types
export interface PaymentSettings {
  enabled: boolean;
  provider: 'stripe';
  publicKey: string;
  currency: string;
  amount?: number;
  allowCustomAmount: boolean;
  minAmount?: number;
  maxAmount?: number;
}

export interface Payment {
  id: string;
  submissionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  stripePaymentId: string;
  createdAt: string;
  updatedAt: string;
}

// Appointment Booking Types
export interface AppointmentSettings {
  enabled: boolean;
  calendarProvider: 'google' | 'outlook';
  availabilitySlots: TimeSlot[];
  bufferTime: number;
  timezone: string;
  confirmationEmail: boolean;
  reminderEmail: boolean;
  reminderHours: number;
}

export interface TimeSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Appointment {
  id: string;
  submissionId: string;
  contactId: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Advanced Form Types
export interface ConditionalPricing {
  basePrice: number;
  rules: PricingRule[];
}

export interface PricingRule {
  questionId: string;
  operator: 'equals' | 'greater_than' | 'less_than';
  value: any;
  priceModifier: number;
  modifierType: 'add' | 'multiply' | 'percentage';
}

export interface Calculator {
  id: string;
  formId: string;
  formula: string;
  variables: CalculatorVariable[];
  resultLabel: string;
  resultFormat: 'number' | 'currency' | 'percentage';
}

export interface CalculatorVariable {
  name: string;
  questionId: string;
  defaultValue?: number;
}

