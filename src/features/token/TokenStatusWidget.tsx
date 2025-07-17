/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGetTokenAccountsQuery } from '@/components/account/account-data-access'

const MINT = process.env.NEXT_PUBLIC_MINT_PUBKEY as string

export function TokenStatusWidget({ mint = MINT }: { mint?: string }) {
  const { publicKey } = useWallet()
  const { data, isLoading } = useGetTokenAccountsQuery({ address: publicKey?.toString() || '' })
  const tokenAcc = data?.find((acc: any) => acc.account.data.parsed.info.mint === mint)
  const amount = tokenAcc?.account.data.parsed.info.tokenAmount.uiAmount ?? 0
  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-zinc-900 border border-zinc-800 min-w-[120px]">
      <div className="text-xs text-zinc-400 mb-1">TOKEN</div>
      <div className="text-2xl font-mono text-white">{isLoading ? '...' : amount}</div>
    </div>
  )
}
