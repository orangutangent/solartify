import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs font-medium text-zinc-400 mb-1 select-none pl-1">{label}</label>}
      <input
        ref={ref}
        data-slot="input"
        className={cn(
          'w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-base text-white placeholder:text-muted transition-all duration-200 outline-none',
          'focus:border-accent-neon focus:ring-2 focus:ring-accent-neon focus:shadow-[0_0_10px_0_rgba(0,212,255,0.3)]',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className,
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1 pl-1">{error}</span>}
    </div>
  )
})
Input.displayName = 'Input'
