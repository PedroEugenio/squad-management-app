'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProtectedError({
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-6">
      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">
          An error occurred while loading this section. Try again or go back.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/60 mt-1 font-mono">Ref: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="h-4 w-4 mr-2" /> Try again
        </Button>
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Go back
        </Button>
      </div>
    </div>
  )
}
