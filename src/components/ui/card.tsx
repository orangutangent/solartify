import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'nft' | 'stats'
  className?: string
}

export function Card({ variant = 'default', className, ...props }: CardProps) {
  const base = 'flex flex-col gap-6 rounded-xl border shadow-sm transition-all duration-200'
  const variants = {
    default: 'bg-card border-white/10 backdrop-blur-lg',
    nft: 'bg-gradient-to-br from-[#111111e6] to-[#1a1a1ae6] border-accent-neon/20 hover:shadow-[0_0_20px_0_rgba(0,212,255,0.3)] hover:border-accent-neon/60 transition-all duration-300 backdrop-blur-lg',
    stats: 'bg-white/5 border-white/10 rounded-lg p-4',
  }
  return (
    <div
      data-slot="card"
      className={cn(base, variants[variant], className, variant === 'nft' && 'hover:scale-[1.02]')}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn('grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6', className)}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-title" className={cn('leading-none font-semibold', className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />
}

export function CardAction({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-footer" className={cn('flex items-center px-6', className)} {...props} />
}
