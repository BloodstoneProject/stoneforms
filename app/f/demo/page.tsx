'use client'

import TypeformPlayer from '@/components/player/TypeformPlayer'

export default function FormDemo() {
  const demoQuestions = [
    {
      id: 'q1',
      type: 'short_text' as const,
      label: "What's your name?",
      description: "Let's start with the basics",
      placeholder: 'John Doe',
      required: true,
    },
    {
      id: 'q2',
      type: 'email' as const,
      label: "What's your email address?",
      description: "We'll send you a confirmation",
      placeholder: 'john@example.com',
      required: true,
    },
    {
      id: 'q3',
      type: 'multiple_choice' as const,
      label: "How did you hear about us?",
      description: "Select the option that best describes how you found Stoneforms",
      required: true,
      choices: [
        { id: 'c1', label: 'Google Search', value: 'google' },
        { id: 'c2', label: 'Social Media', value: 'social' },
        { id: 'c3', label: 'Friend Recommendation', value: 'friend' },
        { id: 'c4', label: 'Blog or Article', value: 'blog' },
      ],
    },
    {
      id: 'q4',
      type: 'rating' as const,
      label: "How likely are you to recommend Stoneforms?",
      description: "1 = Not likely, 5 = Very likely",
      required: true,
      maxRating: 5,
    },
    {
      id: 'q5',
      type: 'long_text' as const,
      label: "What features are most important to you?",
      description: "Tell us what you're looking for in a form builder",
      placeholder: 'I need...',
      required: false,
    },
    {
      id: 'q6',
      type: 'image_choice' as const,
      label: "Which style do you prefer?",
      description: "Choose your favorite design aesthetic",
      required: true,
      choices: [
        { 
          id: 'i1', 
          label: 'Modern Minimal', 
          value: 'minimal',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop'
        },
        { 
          id: 'i2', 
          label: 'Bold & Vibrant', 
          value: 'vibrant',
          image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop'
        },
        { 
          id: 'i3', 
          label: 'Classic Elegant', 
          value: 'elegant',
          image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop'
        },
        { 
          id: 'i4', 
          label: 'Playful Fun', 
          value: 'playful',
          image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop'
        },
      ],
    },
  ]

  const handleSubmit = (answers: Record<string, any>) => {
    console.log('Form submitted:', answers)
    // Here you would send to your backend
  }

  return (
    <TypeformPlayer
      formId="demo-form"
      title="Welcome Form"
      description="Let's get to know you better"
      questions={demoQuestions}
      onSubmit={handleSubmit}
    />
  )
}
