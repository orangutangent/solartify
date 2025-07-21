'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGetBalanceQuery } from '@/components/account/account-data-access'

export function BalanceWidget() {
  const { publicKey } = useWallet()
  const { data, isLoading } = useGetBalanceQuery({ address: publicKey?.toString() || '' })
  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-zinc-900 border border-zinc-800 min-w-[120px]">
      <div className="text-xs text-zinc-400 mb-1">SOL</div>
      <div className="text-2xl font-mono text-white">{isLoading ? '...' : ((data ?? 0) / 1e9).toFixed(2)}</div>
    </div>
  )
}
