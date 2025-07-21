import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variantClasses = {
  primary:
    'bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-lg focus-visible:ring-2 focus-visible:ring-fuchsia-400 hover:from-fuchsia-500 hover:to-indigo-500 transition-all transition-colors duration-300',
  secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all',
  ghost: 'bg-transparent text-zinc-300 hover:bg-white/5 transition-all',
  danger:
    'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-glow focus-visible:ring-2 focus-visible:ring-red-400 hover:from-red-600 hover:to-pink-600 transition-all',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-2.5 text-base rounded-xl',
  lg: 'px-8 py-3 text-lg rounded-2xl',
}

const glowPulse = {
  animate: {
    boxShadow: ['0 0 20px rgba(168,85,247,0.3)', '0 0 30px rgba(14,165,233,0.5)', '0 0 20px rgba(168,85,247,0.3)'],
    transition: { duration: 2, repeat: Infinity },
  },
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        data-slot="button"
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none',
          variantClasses[variant],
          sizeClasses[size],
          loading && 'opacity-60 pointer-events-none',
          className,
        )}
        whileHover={{ y: -2 }}
        {...(variant === 'primary' ? glowPulse : {})}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin w-5 h-5" />}
        {children as React.ReactNode}
      </motion.button>
    )
  },
)
Button.displayName = 'Button'
