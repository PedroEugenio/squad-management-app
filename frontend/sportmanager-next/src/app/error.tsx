'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 gap-6">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">
          An unexpected error occurred. You can try again or return to the dashboard.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/60 mt-1 font-mono">Ref: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="h-4 w-4 mr-2" /> Try again
        </Button>
        <Button asChild>
          <a href="/dashboard">Go to Dashboard</a>
        </Button>
      </div>
    </div>
  )
}
