'use client'

import { create } from 'zustand'
import type { User } from '@/lib/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  // Actions
  login: (email: string, password: string) => Promise<void>
  loginWithProvider: (provider: 'google' | 'github' | 'microsoft') => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

function makeName(raw: string) {
  return raw
    .split('@')[0]
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Auth store — currently uses simulated async calls.
 * To connect a real auth API:
 *   1. Replace the setTimeout bodies with fetch('/api/auth/...')
 *   2. Persist the token in httpOnly cookies or localStorage
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, _password) => {
    await new Promise((r) => setTimeout(r, 800))
    set({
      user: { id: '1', name: makeName(email), email, role: 'Administrator' },
      isAuthenticated: true,
    })
  },

  loginWithProvider: async (provider) => {
    await new Promise((r) => setTimeout(r, 800))
    const providerNames = { google: 'Google User', github: 'GitHub User', microsoft: 'MS User' }
    set({
      user: {
        id: '2',
        name: providerNames[provider],
        email: `user@${provider}.com`,
        role: 'User',
      },
      isAuthenticated: true,
    })
  },

  register: async (name, email, _password) => {
    await new Promise((r) => setTimeout(r, 800))
    set({
      user: { id: '3', name, email, role: 'User' },
      isAuthenticated: true,
    })
  },

  logout: () => set({ user: null, isAuthenticated: false }),
}))
