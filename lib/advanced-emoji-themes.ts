// Advanced Emoji Form Features
export interface EmojiFormFeatures {
  particleTrails: boolean
  reactionBurst: boolean
  progressEmojis: boolean
  successConfetti: boolean
  soundEffects: boolean
  shakeOnError: boolean
  pulseAnimation: boolean
  magneticEffect: boolean
}

export interface AdvancedEmojiTheme extends EmojiTheme {
  features: EmojiFormFeatures
  successEmoji: string
  errorEmoji: string
  thinkingEmoji: string
  specialEffects: string[]
}

export const advancedEmojiThemes: AdvancedEmojiTheme[] = [
  {
    id: 'celebration-pro',
    name: 'Celebration Pro',
    description: 'Maximum party vibes with confetti burst',
    emojis: ['🎉', '🎊', '🎈', '🎁', '🎂', '🥳', '✨', '🎆', '🎇', '🌟', '💫', '⭐'],
    gradient: 'from-purple-400 via-pink-500 to-red-500',
    particleCount: 40,
    speed: 'medium',
    features: {
      particleTrails: true,
      reactionBurst: true,
      progressEmojis: true,
      successConfetti: true,
      soundEffects: true,
      shakeOnError: true,
      pulseAnimation: true,
      magneticEffect: true,
    },
    successEmoji: '🎊',
    errorEmoji: '😅',
    thinkingEmoji: '🤔',
    specialEffects: ['fireworks', 'confetti', 'sparkle'],
  },
  {
    id: 'neon-party',
    name: 'Neon Party',
    description: 'Vibrant neon colors with glow effects',
    emojis: ['💜', '💙', '💚', '💛', '🧡', '❤️', '⚡', '🌈', '✨', '💫'],
    gradient: 'from-fuchsia-500 via-cyan-500 to-lime-500',
    particleCount: 50,
    speed: 'fast',
    features: {
      particleTrails: true,
      reactionBurst: true,
      progressEmojis: true,
      successConfetti: true,
      soundEffects: true,
      shakeOnError: true,
      pulseAnimation: true,
      magneticEffect: true,
    },
    successEmoji: '🎆',
    errorEmoji: '💔',
    thinkingEmoji: '🤨',
    specialEffects: ['glow', 'neon', 'pulse'],
  },
  {
    id: 'cosmic-journey',
    name: 'Cosmic Journey',
    description: 'Travel through space with shooting stars',
    emojis: ['🌌', '⭐', '✨', '🌟', '💫', '🌙', '☄️', '🪐', '🚀', '🛸', '👽', '🌠'],
    gradient: 'from-indigo-900 via-purple-800 to-pink-700',
    particleCount: 45,
    speed: 'medium',
    features: {
      particleTrails: true,
      reactionBurst: true,
      progressEmojis: true,
      successConfetti: true,
      soundEffects: true,
      shakeOnError: false,
      pulseAnimation: true,
      magneticEffect: true,
    },
    successEmoji: '🌟',
    errorEmoji: '☄️',
    thinkingEmoji: '🛸',
    specialEffects: ['stars', 'orbit', 'warp'],
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Peaceful waves with floating bubbles',
    emojis: ['🌊', '🐚', '🐠', '🐟', '🐬', '🦈', '🐙', '🦀', '💧', '💦', '🫧'],
    gradient: 'from-blue-300 via-cyan-400 to-teal-500',
    particleCount: 35,
    speed: 'slow',
    features: {
      particleTrails: true,
      reactionBurst: false,
      progressEmojis: true,
      successConfetti: false,
      soundEffects: true,
      shakeOnError: false,
      pulseAnimation: true,
      magneticEffect: false,
    },
    successEmoji: '🌊',
    errorEmoji: '🫧',
    thinkingEmoji: '🐠',
    specialEffects: ['waves', 'bubbles', 'float'],
  },
  {
    id: 'fire-energy',
    name: 'Fire Energy',
    description: 'High energy flames and sparks',
    emojis: ['🔥', '⚡', '💥', '💫', '✨', '🌟', '⭐', '🔆', '☄️'],
    gradient: 'from-red-500 via-orange-500 to-yellow-400',
    particleCount: 50,
    speed: 'fast',
    features: {
      particleTrails: true,
      reactionBurst: true,
      progressEmojis: true,
      successConfetti: true,
      soundEffects: true,
      shakeOnError: true,
      pulseAnimation: true,
      magneticEffect: true,
    },
    successEmoji: '🔥',
    errorEmoji: '💥',
    thinkingEmoji: '⚡',
    specialEffects: ['flames', 'sparks', 'explosion'],
  },
  {
    id: 'winter-wonderland',
    name: 'Winter Wonderland',
    description: 'Gentle snowfall with icy crystals',
    emojis: ['❄️', '⛄', '☃️', '🌨️', '💎', '💠', '🔷', '🔹', '💙', '🤍'],
    gradient: 'from-blue-100 via-cyan-200 to-indigo-300',
    particleCount: 40,
    speed: 'slow',
    features: {
      particleTrails: false,
      reactionBurst: false,
      progressEmojis: true,
      successConfetti: false,
      soundEffects: true,
      shakeOnError: false,
      pulseAnimation: true,
      magneticEffect: false,
    },
    successEmoji: '❄️',
    errorEmoji: '🌨️',
    thinkingEmoji: '💎',
    specialEffects: ['snow', 'crystal', 'shimmer'],
  },
  {
    id: 'jungle-adventure',
    name: 'Jungle Adventure',
    description: 'Wild nature with exotic animals',
    emojis: ['🦁', '🐯', '🦜', '🦋', '🌺', '🌴', '🍃', '🌿', '🦎', '🐍'],
    gradient: 'from-green-400 via-emerald-500 to-lime-600',
    particleCount: 30,
    speed: 'medium',
    features: {
      particleTrails: true,
      reactionBurst: true,
      progressEmojis: true,
      successConfetti: true,
      soundEffects: true,
      shakeOnError: false,
      pulseAnimation: true,
      magneticEffect: false,
    },
    successEmoji: '🦜',
    errorEmoji: '🐍',
    thinkingEmoji: '🦋',
    specialEffects: ['leaves', 'vines', 'flutter'],
  },
  {
    id: 'candy-land',
    name: 'Candy Land',
    description: 'Sweet treats and desserts',
    emojis: ['🍭', '🍬', '🍫', '🍰', '🧁', '🍩', '🍪', '🍦', '🍨', '🎂'],
    gradient: 'from-pink-300 via-purple-300 to-blue-300',
    particleCount: 35,
    speed: 'medium',
    features: {
      particleTrails: true,
      reactionBurst: true,
      progressEmojis: true,
      successConfetti: true,
      soundEffects: true,
      shakeOnError: false,
      pulseAnimation: true,
      magneticEffect: true,
    },
    successEmoji: '🍰',
    errorEmoji: '🍭',
    thinkingEmoji: '🍩',
    specialEffects: ['sparkle', 'sweet', 'bounce'],
  },
]

export function getAdvancedEmojiTheme(id: string) {
  return advancedEmojiThemes.find(theme => theme.id === id) || advancedEmojiThemes[0]
}

import { EmojiTheme } from './emoji-themes'
