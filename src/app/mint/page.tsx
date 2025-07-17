'use client'
import { MintNftWidget } from '@/features/mint/MintNftWidget'

export default function MintPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <MintNftWidget />
    </div>
  )
}
