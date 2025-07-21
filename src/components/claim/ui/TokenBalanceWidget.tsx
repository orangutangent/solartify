'use client'
import { useGetTokenAccountsQuery } from '@/components/account/account-data-access'
import { useWallet } from '@solana/wallet-adapter-react'

export function TokenBalanceWidget() {
  const wallet = useWallet()
  const { data, isLoading, isError } = useGetTokenAccountsQuery({ address: wallet.publicKey?.toBase58() ?? '' })
  if (!wallet.publicKey) return <span className="text-zinc-500">—</span>
  if (isLoading) return <span className="text-zinc-400 animate-pulse">...</span>
  if (isError) return <span className="text-red-400">Error</span>
  // Суммируем все токены (если несколько аккаунтов)
  const total = data?.reduce((sum, acc) => sum + Number(acc.account.data.parsed.info.tokenAmount.uiAmount || 0), 0) ?? 0
  return <span className="text-2xl font-bold text-white">{total}</span>
}
