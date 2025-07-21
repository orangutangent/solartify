'use client'
import { BuyTokensWidget } from '@/components/buy/BuyTokensWidget'

export default function BuyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <BuyTokensWidget />
    </div>
  )
}
