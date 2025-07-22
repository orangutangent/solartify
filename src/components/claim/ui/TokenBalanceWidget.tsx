'use client'
import { useNftGifterProgram } from '@/components/nftgifter/nftgifter-data-access'
import { useWallet } from '@solana/wallet-adapter-react'

export function TokenBalanceWidget() {
  const wallet = useWallet()
  const { userUtilityTokenBalanceQuery } = useNftGifterProgram()
  const { data: balance, isLoading, isError } = userUtilityTokenBalanceQuery

  if (!wallet.publicKey) return <span className="text-zinc-500">—</span>
  if (isLoading) return <span className="text-zinc-400 animate-pulse">...</span>
  if (isError) return <span className="text-red-400">Error</span>

  return <span className="text-2xl font-bold text-white">{balance}</span>
}
