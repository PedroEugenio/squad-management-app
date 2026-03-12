// ─── Player ───────────────────────────────────────────────────────────────────
export const PLAYER_POSITIONS = [
  'Goalkeeper',
  'Right Back',
  'Left Back',
  'Centre Back',
  'Defensive Mid',
  'Central Mid',
  'Attacking Mid',
  'Right Winger',
  'Left Winger',
  'Striker',
] as const

export type PlayerPosition = typeof PLAYER_POSITIONS[number]
export type PlayerStatus = 'Fit' | 'Injured' | 'Suspended' | 'Doubtful'

export interface Player {
  id: number
  number: number
  name: string
  position: PlayerPosition
  nationality: string
  age: number
  status: PlayerStatus
}


export type PracticeType = 'Tactical' | 'Physical' | 'Technical' | 'Recovery' | 'Set Pieces'

export interface Practice {
  id: number
  date: string       // ISO 'YYYY-MM-DD'
  time: string       // 'HH:MM' 24h
  type: PracticeType
  duration: string   // human string e.g. '90 min'
  location: string
  attendance: number
  notes: string
  drillIds?: number[] // attached drill library entries
}

// ─── Match ────────────────────────────────────────────────────────────────────
export type MatchVenue = 'Home' | 'Away' | 'Neutral'
export type MatchResult = 'Win' | 'Draw' | 'Loss' | 'Upcoming'

export interface Match {
  id: number
  date: string
  time: string
  competition: string
  opponent: string
  venue: MatchVenue
  location: string
  goalsFor: number | null
  goalsAgainst: number | null
  result: MatchResult
  notes: string
}

// ─── Report ───────────────────────────────────────────────────────────────────
export type ReportStatus = 'Ready' | 'Processing'
export type ReportType = 'Match' | 'Training' | 'Medical' | 'Scouting' | 'Planning' | 'Performance'

export interface Report {
  id: number
  name: string
  date: string       // display string e.g. 'Mar 2, 2026'
  status: ReportStatus
  type: ReportType
}

// ─── Staff ────────────────────────────────────────────────────────────────────
export type StaffStatus = 'Active' | 'Inactive' | 'Pending'

export interface StaffMember {
  id: number
  name: string
  email: string
  role: string
  status: StaffStatus
  phone?: string
  joined?: string    // ISO 'YYYY-MM-DD'
}

// ─── Drill Library ───────────────────────────────────────────────────────────
export type DrillLevel    = 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite'
export type DrillCategory = 'Tactical' | 'Technical' | 'Physical' | 'Warm-up' | 'Goalkeeping'
export type DrillObjective = 'Passing' | 'Shooting' | 'Pressing' | 'Transition' | 'Recovery' | 'Positioning'
export type DrillEquipment = 'Cones' | 'Bibs' | 'Small goals' | 'Full-size goals' | 'Balls' | 'Poles'
export type DrillSpace    = 'Full pitch' | 'Half pitch' | '20x20 box' | '30x20 box' | 'Gym'

export interface Drill {
  id: number
  title: string
  description: string
  category: DrillCategory
  level: DrillLevel
  durationMins: number
  playersMin: number
  playersMax: number
  objectives: DrillObjective[]
  equipment: DrillEquipment[]
  space: DrillSpace
  coachingPoints: string[]   // 3-5 bullet points
  imageUrl?: string
  youtubeId?: string
  tags: string[]
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}
