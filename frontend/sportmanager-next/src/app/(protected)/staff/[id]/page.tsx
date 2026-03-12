'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useStaffMember } from '@/lib/queries'
import type { StaffStatus } from '@/lib/types'
import type { BadgeProps } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const STATUS_VARIANT: Record<StaffStatus, BadgeProps['variant']> = {
  Active: 'default', Inactive: 'secondary', Pending: 'outline',
}

const RESPONSIBILITIES: Record<string, string[]> = {
  'Head Coach': ['Overall team strategy and tactics', 'Match preparation and game plans', 'Player development oversight', 'Media and public communications', 'Final squad selection'],
  'Assistant Coach': ['Supporting head coach in tactical planning', 'Leading specific training sessions', 'Analysing opponent footage', 'Individual player mentoring'],
  'Goalkeeper Coach': ['Goalkeeper-specific training sessions', 'Shot-stopping drills and positioning', 'Distribution and footwork development'],
  'Fitness Coach': ['Designing physical conditioning plans', 'Managing player load and recovery', 'GPS and biometric data analysis', 'Injury prevention protocols'],
  'Analyst': ['Video analysis of matches and training', 'Producing scouting and opponent reports', 'KPI tracking and performance dashboards'],
  'Physiotherapist': ['Injury diagnosis and rehabilitation', 'Pre-match and post-match treatment', 'Advising coaches on player availability', 'Recovery protocols and monitoring'],
  'Team Doctor': ['Medical assessments and clearances', 'Managing player health records', 'Emergency match-day coverage', 'Nutritional and wellness guidance'],
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function StaffDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: member, isLoading } = useStaffMember(Number(params.id))

  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-36" />
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-5">
            <Skeleton className="h-16 w-16 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-44" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 shrink-0" />
              <Skeleton className="h-4 w-52" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
  if (!member) return (
    <div className="space-y-4 text-center py-16">
      <p className="text-lg font-semibold">Staff member not found</p>
      <Button variant="ghost" onClick={() => router.push('/users')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Staff
      </Button>
    </div>
  )

  const responsibilities = RESPONSIBILITIES[member.role] ?? ['Responsibilities for this role are not yet documented.']

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/users')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{member.name}</h1>
          <p className="text-muted-foreground">{member.role}</p>
        </div>
      </div>

      {/* Hero */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl font-bold">{initials(member.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-xl font-bold">{member.name}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={STATUS_VARIANT[member.status]}>{member.status}</Badge>
                <Badge variant="outline">{member.role}</Badge>
              </div>
              {member.joined && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Joined {member.joined}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a>
          </div>
          {member.phone && (
            <>
              <Separator />
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={`tel:${member.phone}`} className="hover:underline">{member.phone}</a>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Responsibilities */}
      <Card>
        <CardHeader><CardTitle className="text-base">Responsibilities</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {responsibilities.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
