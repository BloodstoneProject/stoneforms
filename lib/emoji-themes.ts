// Emoji Form Themes
export interface EmojiTheme {
  id: string
  name: string
  description: string
  emojis: string[]
  gradient: string
  particleCount: number
  speed: 'slow' | 'medium' | 'fast'
}

export const emojiThemes: EmojiTheme[] = [
  {
    id: 'celebration',
    name: 'Celebration',
    description: 'Perfect for events and parties',
    emojis: ['🎉', '🎊', '🎈', '🎁', '🎂', '🥳', '✨', '🎆', '🎇', '🌟'],
    gradient: 'from-purple-400 via-pink-500 to-red-500',
    particleCount: 30,
    speed: 'medium',
  },
  {
    id: 'love',
    name: 'Love & Hearts',
    description: 'For weddings and romantic events',
    emojis: ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞', '💟', '❣️'],
    gradient: 'from-pink-300 via-red-300 to-pink-400',
    particleCount: 25,
    speed: 'slow',
  },
  {
    id: 'business',
    name: 'Business & Success',
    description: 'Professional and corporate',
    emojis: ['💼', '📊', '📈', '💰', '🎯', '🏆', '⭐', '✅', '💡', '🚀'],
    gradient: 'from-blue-400 via-indigo-500 to-purple-600',
    particleCount: 20,
    speed: 'slow',
  },
  {
    id: 'nature',
    name: 'Nature & Plants',
    description: 'Eco-friendly and natural',
    emojis: ['🌿', '🌱', '🌳', '🌸', '🌺', '🌻', '🌷', '🍀', '🌾', '🌼'],
    gradient: 'from-green-300 via-emerald-400 to-teal-500',
    particleCount: 35,
    speed: 'slow',
  },
  {
    id: 'food',
    name: 'Food & Drinks',
    description: 'Restaurants and catering',
    emojis: ['🍕', '🍔', '🍟', '🌮', '🍣', '🍰', '🍩', '🍪', '☕', '🍷'],
    gradient: 'from-orange-300 via-red-400 to-pink-500',
    particleCount: 25,
    speed: 'medium',
  },
  {
    id: 'tech',
    name: 'Technology',
    description: 'Tech startups and innovation',
    emojis: ['💻', '📱', '⚡', '🔌', '🖥️', '⌨️', '🖱️', '💾', '🔋', '🎮'],
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    particleCount: 30,
    speed: 'fast',
  },
  {
    id: 'travel',
    name: 'Travel & Adventure',
    description: 'Tourism and exploration',
    emojis: ['✈️', '🌍', '🗺️', '🏖️', '⛰️', '🏕️', '🎒', '📸', '🧳', '🚂'],
    gradient: 'from-sky-300 via-blue-400 to-indigo-500',
    particleCount: 28,
    speed: 'medium',
  },
  {
    id: 'fitness',
    name: 'Fitness & Health',
    description: 'Gyms and wellness',
    emojis: ['💪', '🏃', '🚴', '🧘', '⛹️', '🤸', '🏋️', '🥇', '🎾', '⚽'],
    gradient: 'from-red-400 via-orange-500 to-yellow-500',
    particleCount: 25,
    speed: 'fast',
  },
  {
    id: 'education',
    name: 'Education & Learning',
    description: 'Schools and courses',
    emojis: ['📚', '✏️', '📝', '🎓', '🏫', '📖', '🔬', '🧪', '🎨', '🎭'],
    gradient: 'from-blue-300 via-indigo-400 to-purple-500',
    particleCount: 20,
    speed: 'slow',
  },
  {
    id: 'music',
    name: 'Music & Entertainment',
    description: 'Concerts and festivals',
    emojis: ['🎵', '🎶', '🎤', '🎸', '🎹', '🥁', '🎺', '🎻', '🎧', '📻'],
    gradient: 'from-purple-400 via-pink-500 to-red-500',
    particleCount: 30,
    speed: 'fast',
  },
  {
    id: 'space',
    name: 'Space & Galaxy',
    description: 'Cosmic and futuristic',
    emojis: ['🌌', '⭐', '✨', '🌟', '💫', '🌙', '☄️', '🪐', '🚀', '🛸'],
    gradient: 'from-indigo-900 via-purple-800 to-pink-700',
    particleCount: 40,
    speed: 'slow',
  },
  {
    id: 'weather',
    name: 'Weather & Seasons',
    description: 'All weather conditions',
    emojis: ['☀️', '⛅', '☁️', '🌧️', '⛈️', '🌈', '❄️', '⛄', '🌊', '💨'],
    gradient: 'from-blue-200 via-cyan-300 to-teal-400',
    particleCount: 35,
    speed: 'medium',
  },
]

export function getEmojiTheme(id: string) {
  return emojiThemes.find(theme => theme.id === id) || emojiThemes[0]
}
