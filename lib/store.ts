import { create } from 'zustand'
import { Form, Question, Submission, Contact, Deal } from '@/types'

interface AppStore {
  // Forms
  forms: Form[]
  addForm: (form: Form) => void
  updateForm: (id: string, updates: Partial<Form>) => void
  deleteForm: (id: string) => void
  
  // Questions
  questions: Record<string, Question[]>
  
  // Submissions
  submissions: Submission[]
  addSubmission: (submission: Submission) => void
  
  // Contacts
  contacts: Contact[]
  addContact: (contact: Contact) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  deleteContact: (id: string) => void
  
  // Deals
  deals: Deal[]
  addDeal: (deal: Deal) => void
  updateDeal: (id: string, updates: Partial<Deal>) => void
  deleteDeal: (id: string) => void
}

// Mock initial data
const mockForms: Form[] = [
  {
    id: '1',
    workspaceId: 'demo',
    title: 'Customer Feedback Survey',
    description: 'Help us improve our products and services',
    questions: [],
    logic: [],
    theme: {
      id: 'default',
      name: 'Default Theme',
      colors: {
        primary: '#142c1c',
        background: '#f4f2ed',
        text: '#142c1c',
        button: '#142c1c',
        buttonText: '#ffffff',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
    },
    settings: {
      showProgressBar: true,
      allowMultipleSubmissions: false,
      requireEmail: true,
    },
    status: 'published',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-02-09').toISOString(),
    createdBy: 'demo-user',
  },
  {
    id: '2',
    workspaceId: 'demo',
    title: 'Lead Capture Form',
    description: 'Get qualified leads for your sales team',
    questions: [],
    logic: [],
    theme: {
      id: 'default',
      name: 'Default Theme',
      colors: {
        primary: '#142c1c',
        background: '#f4f2ed',
        text: '#142c1c',
        button: '#142c1c',
        buttonText: '#ffffff',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
    },
    settings: {
      showProgressBar: true,
      allowMultipleSubmissions: false,
      requireEmail: true,
    },
    status: 'published',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-02-08').toISOString(),
    createdBy: 'demo-user',
  },
  {
    id: '3',
    workspaceId: 'demo',
    title: 'Event Registration',
    description: 'Register attendees for upcoming events',
    questions: [],
    logic: [],
    theme: {
      id: 'default',
      name: 'Default Theme',
      colors: {
        primary: '#142c1c',
        background: '#f4f2ed',
        text: '#142c1c',
        button: '#142c1c',
        buttonText: '#ffffff',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
    },
    settings: {
      showProgressBar: true,
      allowMultipleSubmissions: true,
      requireEmail: false,
    },
    status: 'draft',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-09').toISOString(),
    createdBy: 'demo-user',
  },
]

const mockQuestions: Record<string, Question[]> = {
  '1': [
    {
      id: 'q1',
      type: 'short_text',
      label: 'What is your name?',
      required: true,
      order: 0,
    },
    {
      id: 'q2',
      type: 'email',
      label: 'What is your email address?',
      required: true,
      order: 1,
    },
    {
      id: 'q3',
      type: 'rating',
      label: 'How would you rate our service?',
      required: true,
      order: 2,
    },
    {
      id: 'q4',
      type: 'long_text',
      label: 'What could we improve?',
      required: false,
      order: 3,
    },
  ],
  '2': [
    {
      id: 'q5',
      type: 'short_text',
      label: 'Company Name',
      required: true,
      order: 0,
    },
    {
      id: 'q6',
      type: 'email',
      label: 'Work Email',
      required: true,
      order: 1,
    },
    {
      id: 'q7',
      type: 'number',
      label: 'Team Size',
      required: true,
      order: 2,
    },
  ],
}

const mockSubmissions: Submission[] = [
  {
    id: 's1',
    formId: '1',
    answers: [
      { questionId: 'q1', value: 'John Doe', type: 'short_text' },
      { questionId: 'q2', value: 'john@example.com', type: 'email' },
      { questionId: 'q3', value: '5', type: 'rating' },
      { questionId: 'q4', value: 'Great service overall!', type: 'long_text' },
    ],
    metadata: {
      startedAt: new Date('2024-02-09T10:25:00').toISOString(),
      completedAt: new Date('2024-02-09T10:30:00').toISOString(),
      timeSpent: 300,
    },
    createdAt: new Date('2024-02-09T10:30:00').toISOString(),
  },
  {
    id: 's2',
    formId: '1',
    answers: [
      { questionId: 'q1', value: 'Sarah Smith', type: 'short_text' },
      { questionId: 'q2', value: 'sarah@company.com', type: 'email' },
      { questionId: 'q3', value: '4', type: 'rating' },
      { questionId: 'q4', value: 'Could improve response time', type: 'long_text' },
    ],
    metadata: {
      startedAt: new Date('2024-02-09T11:10:00').toISOString(),
      completedAt: new Date('2024-02-09T11:15:00').toISOString(),
      timeSpent: 300,
    },
    createdAt: new Date('2024-02-09T11:15:00').toISOString(),
  },
]

const mockContacts: Contact[] = [
  {
    id: 'c1',
    workspaceId: 'demo',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    properties: {},
    tags: ['customer', 'vip'],
    createdAt: new Date('2024-02-09T10:30:00').toISOString(),
    updatedAt: new Date('2024-02-09T10:30:00').toISOString(),
  },
  {
    id: 'c2',
    workspaceId: 'demo',
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah@company.com',
    company: 'TechStart Inc',
    properties: {},
    tags: ['lead'],
    createdAt: new Date('2024-02-09T11:15:00').toISOString(),
    updatedAt: new Date('2024-02-09T11:15:00').toISOString(),
  },
]

const mockDeals: Deal[] = [
  {
    id: 'd1',
    workspaceId: 'demo',
    title: 'Acme Corp - Enterprise Plan',
    value: 50000,
    currency: 'USD',
    stage: 'proposal',
    contactId: 'c1',
    probability: 50,
    status: 'open',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-09').toISOString(),
  },
  {
    id: 'd2',
    workspaceId: 'demo',
    title: 'TechStart - Professional Plan',
    value: 15000,
    currency: 'USD',
    stage: 'qualified',
    contactId: 'c2',
    probability: 25,
    status: 'open',
    createdAt: new Date('2024-02-05').toISOString(),
    updatedAt: new Date('2024-02-09').toISOString(),
  },
]

export const useStore = create<AppStore>((set) => ({
  // Forms
  forms: mockForms,
  addForm: (form) => set((state) => ({ forms: [...state.forms, form] })),
  updateForm: (id, updates) =>
    set((state) => ({
      forms: state.forms.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  deleteForm: (id) =>
    set((state) => ({ forms: state.forms.filter((f) => f.id !== id) })),

  // Questions
  questions: mockQuestions,
  addQuestion: (formId, question) =>
    set((state) => ({
      questions: {
        ...state.questions,
        [formId]: [...(state.questions[formId] || []), question],
      },
    })),
  updateQuestion: (formId, questionId, updates) =>
    set((state) => ({
      questions: {
        ...state.questions,
        [formId]: state.questions[formId].map((q) =>
          q.id === questionId ? { ...q, ...updates } : q
        ),
      },
    })),
  deleteQuestion: (formId, questionId) =>
    set((state) => ({
      questions: {
        ...state.questions,
        [formId]: state.questions[formId].filter((q) => q.id !== questionId),
      },
    })),

  // Submissions
  submissions: mockSubmissions,
  addSubmission: (submission) =>
    set((state) => ({ submissions: [...state.submissions, submission] })),

  // Contacts
  contacts: mockContacts,
  addContact: (contact) =>
    set((state) => ({ contacts: [...state.contacts, contact] })),
  updateContact: (id, updates) =>
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  deleteContact: (id) =>
    set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) })),

  // Deals
  deals: mockDeals,
  addDeal: (deal) => set((state) => ({ deals: [...state.deals, deal] })),
  updateDeal: (id, updates) =>
    set((state) => ({
      deals: state.deals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),
  deleteDeal: (id) =>
    set((state) => ({ deals: state.deals.filter((d) => d.id !== id) })),
}))
