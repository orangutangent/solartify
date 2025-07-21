'use client'

import * as React from 'react'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  neon?: boolean
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, neon = false, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={
          'text-xs font-medium select-none transition-colors ' +
          (neon ? 'text-accent-neon drop-shadow-[0_0_4px_#00d4ff]' : 'text-zinc-400') +
          (className ? ' ' + className : '')
        }
        {...props}
      >
        {children}
      </label>
    )
  },
)
Label.displayName = 'Label'
