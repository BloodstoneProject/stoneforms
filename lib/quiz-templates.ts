// Quiz Templates Data
export interface QuizQuestion {
  id: string
  question: string
  description?: string
  type: 'single' | 'multiple' | 'rating' | 'image'
  choices: {
    id: string
    text: string
    image?: string
    points?: number
    category?: string
  }[]
}

export interface QuizResult {
  id: string
  title: string
  description: string
  minScore?: number
  maxScore?: number
  category?: string
  image?: string
  emoji: string
}

export interface QuizTemplate {
  id: string
  title: string
  description: string
  category: 'personality' | 'trivia' | 'assessment' | 'recommendation' | 'satisfaction' | 'fun'
  emoji: string
  color: string
  questions: QuizQuestion[]
  results: QuizResult[]
  scoringType: 'points' | 'categories' | 'percentage'
}

export const quizTemplates: QuizTemplate[] = [
  {
    id: 'personality-work-style',
    title: 'What is Your Work Style?',
    description: 'Discover your unique approach to work and collaboration',
    category: 'personality',
    emoji: '🎭',
    color: 'from-purple-500 to-pink-500',
    scoringType: 'categories',
    questions: [
      {
        id: 'q1',
        question: 'How do you prefer to start your day?',
        type: 'single',
        choices: [
          { id: 'a', text: 'Jump right into tasks', category: 'doer' },
          { id: 'b', text: 'Plan and organize my day', category: 'planner' },
          { id: 'c', text: 'Connect with team members', category: 'collaborator' },
          { id: 'd', text: 'Explore new ideas and inspiration', category: 'innovator' },
        ],
      },
      {
        id: 'q2',
        question: 'When facing a challenge, you typically:',
        type: 'single',
        choices: [
          { id: 'a', text: 'Take immediate action', category: 'doer' },
          { id: 'b', text: 'Research and strategize', category: 'planner' },
          { id: 'c', text: 'Brainstorm with others', category: 'collaborator' },
          { id: 'd', text: 'Think outside the box', category: 'innovator' },
        ],
      },
      {
        id: 'q3',
        question: 'Your ideal work environment is:',
        type: 'single',
        choices: [
          { id: 'a', text: 'Fast-paced and dynamic', category: 'doer' },
          { id: 'b', text: 'Structured and organized', category: 'planner' },
          { id: 'c', text: 'Collaborative and social', category: 'collaborator' },
          { id: 'd', text: 'Creative and flexible', category: 'innovator' },
        ],
      },
    ],
    results: [
      {
        id: 'doer',
        title: 'The Action Taker',
        description: 'You thrive on execution and getting things done. Your energy and drive inspire others to keep moving forward.',
        category: 'doer',
        emoji: '⚡',
      },
      {
        id: 'planner',
        title: 'The Strategist',
        description: 'You excel at organization and planning. Your methodical approach ensures nothing falls through the cracks.',
        category: 'planner',
        emoji: '📋',
      },
      {
        id: 'collaborator',
        title: 'The Team Player',
        description: 'You shine in collaboration and bringing people together. Your empathy and communication skills build strong teams.',
        category: 'collaborator',
        emoji: '🤝',
      },
      {
        id: 'innovator',
        title: 'The Creative Thinker',
        description: 'You love exploring new ideas and possibilities. Your innovative mindset drives breakthrough solutions.',
        category: 'innovator',
        emoji: '💡',
      },
    ],
  },

  {
    id: 'trivia-tech',
    title: 'Tech Trivia Challenge',
    description: 'Test your knowledge of technology and innovation',
    category: 'trivia',
    emoji: '🧠',
    color: 'from-blue-500 to-cyan-500',
    scoringType: 'points',
    questions: [
      {
        id: 'q1',
        question: 'What year was the first iPhone released?',
        type: 'single',
        choices: [
          { id: 'a', text: '2005', points: 0 },
          { id: 'b', text: '2007', points: 10 },
          { id: 'c', text: '2009', points: 0 },
          { id: 'd', text: '2010', points: 0 },
        ],
      },
      {
        id: 'q2',
        question: 'Who founded Microsoft?',
        type: 'single',
        choices: [
          { id: 'a', text: 'Steve Jobs', points: 0 },
          { id: 'b', text: 'Bill Gates', points: 10 },
          { id: 'c', text: 'Mark Zuckerberg', points: 0 },
          { id: 'd', text: 'Elon Musk', points: 0 },
        ],
      },
      {
        id: 'q3',
        question: 'What does AI stand for?',
        type: 'single',
        choices: [
          { id: 'a', text: 'Automated Intelligence', points: 0 },
          { id: 'b', text: 'Artificial Intelligence', points: 10 },
          { id: 'c', text: 'Advanced Interface', points: 0 },
          { id: 'd', text: 'Algorithmic Innovation', points: 0 },
        ],
      },
    ],
    results: [
      {
        id: 'beginner',
        title: 'Tech Novice',
        description: 'You are just starting your tech journey. Keep learning!',
        minScore: 0,
        maxScore: 10,
        emoji: '🌱',
      },
      {
        id: 'intermediate',
        title: 'Tech Enthusiast',
        description: 'You have got solid tech knowledge. Keep it up!',
        minScore: 11,
        maxScore: 20,
        emoji: '🚀',
      },
      {
        id: 'expert',
        title: 'Tech Expert',
        description: 'Impressive! You really know your tech.',
        minScore: 21,
        maxScore: 30,
        emoji: '🏆',
      },
    ],
  },

  {
    id: 'fun-which-emoji',
    title: 'Which Emoji Are You?',
    description: 'Discover your emoji personality!',
    category: 'fun',
    emoji: '😊',
    color: 'from-indigo-500 to-purple-500',
    scoringType: 'categories',
    questions: [
      {
        id: 'q1',
        question: 'Pick your ideal weekend activity:',
        type: 'single',
        choices: [
          { id: 'a', text: 'Adventure outdoors', category: 'rocket' },
          { id: 'b', text: 'Cozy at home', category: 'heart' },
          { id: 'c', text: 'Party with friends', category: 'party' },
          { id: 'd', text: 'Creative projects', category: 'sparkles' },
        ],
      },
      {
        id: 'q2',
        question: 'Your reaction to good news:',
        type: 'single',
        choices: [
          { id: 'a', text: 'Celebrate big!', category: 'party' },
          { id: 'b', text: 'Share with loved ones', category: 'heart' },
          { id: 'c', text: 'Plan next steps', category: 'rocket' },
          { id: 'd', text: 'Feel inspired', category: 'sparkles' },
        ],
      },
      {
        id: 'q3',
        question: 'Choose a superpower:',
        type: 'single',
        choices: [
          { id: 'a', text: 'Super speed', category: 'rocket' },
          { id: 'b', text: 'Empathy', category: 'heart' },
          { id: 'c', text: 'Teleportation', category: 'party' },
          { id: 'd', text: 'Creativity boost', category: 'sparkles' },
        ],
      },
    ],
    results: [
      {
        id: 'rocket',
        title: 'You are a Rocket!',
        description: 'Always moving forward with energy and ambition. You are unstoppable!',
        category: 'rocket',
        emoji: '🚀',
      },
      {
        id: 'heart',
        title: 'You are a Heart!',
        description: 'Kind, caring, and always there for others. You spread love everywhere!',
        category: 'heart',
        emoji: '❤️',
      },
      {
        id: 'party',
        title: 'You are a Party!',
        description: 'Life of the party! You bring joy and excitement wherever you go!',
        category: 'party',
        emoji: '🎉',
      },
      {
        id: 'sparkles',
        title: 'You are Sparkles!',
        description: 'Creative and inspiring! You add magic to everything you touch!',
        category: 'sparkles',
        emoji: '✨',
      },
    ],
  },
]
