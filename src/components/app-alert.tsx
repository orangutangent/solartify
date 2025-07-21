import { Toast } from '@/components/ui/alert'
import { ReactNode } from 'react'

export function AppAlert({ children }: { children: ReactNode }) {
  return (
    <Toast type="info" message={typeof children === 'string' ? children : ''} onClose={() => {}} duration={999999} />
  )
}
