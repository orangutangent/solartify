import * as React from 'react'
import { Loader2 } from 'lucide-react'

export interface SpinnerProps {
  className?: string
  size?: number
  color?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '', size = 24, color = '#00d4ff' }) => {
  return (
    <Loader2
      className={`animate-spin ${className}`}
      style={{ width: size, height: size, color }}
      aria-label="Loading..."
    />
  )
}
