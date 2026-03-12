'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'

const NOTIFICATION_OPTIONS = [
  { id: 'match-reminders', label: 'Match Reminders', description: 'Get notified 24 hours before a match' },
  { id: 'training-updates', label: 'Training Updates', description: 'Session additions, cancellations and changes' },
  { id: 'player-alerts', label: 'Player Status Alerts', description: 'Injury and recovery status changes' },
]

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    'match-reminders': true,
    'training-updates': true,
    'player-alerts': false,
  })
  const [saved, setSaved] = useState(false)

  function toggle(id: string) {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleSave() {
    // TODO: persist settings
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>Choose which events trigger notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {NOTIFICATION_OPTIONS.map((opt, index) => (
            <div key={opt.id}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor={opt.id} className="cursor-pointer">{opt.label}</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                </div>
                <input
                  id={opt.id}
                  type="checkbox"
                  checked={notifications[opt.id] ?? false}
                  onChange={() => toggle(opt.id)}
                  className="h-4 w-4 accent-primary cursor-pointer"
                />
              </div>
              {index < NOTIFICATION_OPTIONS.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Theme preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Theme is inherited from your system preferences.
            <Badge variant="outline">System</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions — proceed with care</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently removes your account and all associated data.</p>
            </div>
            <Button variant="destructive" size="sm">Delete Account</Button>
          </div>
        </CardContent>
      </Card>

      <Separator />
      <div className="flex justify-end pb-4">
        <Button onClick={handleSave} className="min-w-32">{saved ? 'Saved!' : 'Save Settings'}</Button>
      </div>
    </div>
  )
}
