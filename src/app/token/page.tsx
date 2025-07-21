'use client'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ClaimForm } from '@/components/claim/ui/ClaimForm'
import { ClaimCooldownWidget } from '@/components/claim/ui/ClaimCooldownWidget'
import { TokenBalanceWidget } from '@/components/claim/ui/TokenBalanceWidget'
import { BuyTokensWidget } from '@/components/buy/BuyTokensWidget'
import { Coins, Gift, Info, DollarSign } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGetBalanceQuery } from '@/components/account/account-data-access'
import { useState } from 'react'

export default function TokenPage() {
  const wallet = useWallet()
  const address = wallet.publicKey?.toBase58() ?? ''
  const { data: solBalance } = useGetBalanceQuery({ address })
  const [tab, setTab] = useState<'claim' | 'buy'>('claim')

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-12 px-2 bg-gradient-to-b from-[#0a0a0a] to-[#18181b]">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-xl w-full flex flex-col gap-8"
      >
        {/* Балансы */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex flex-col items-center justify-center py-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-5 h-5 text-accent-neon" />
              <span className="text-zinc-400 text-sm">SOL</span>
            </div>
            <span className="text-2xl font-bold text-white">{solBalance ? (solBalance / 1e9).toFixed(3) : '—'}</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-4">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-5 h-5 text-accent-neon" />
              <span className="text-zinc-400 text-sm">Tokens</span>
            </div>
            <span className="text-2xl font-bold text-white">
              <TokenBalanceWidget />
            </span>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex justify-center gap-2">
          <button
            className={`px-6 py-2 rounded-xl font-semibold transition-all text-base flex items-center gap-2 ${tab === 'claim' ? 'bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-glow scale-105' : 'bg-white/5 text-zinc-300 hover:bg-white/10'}`}
            onClick={() => setTab('claim')}
          >
            <Gift className="w-5 h-5" /> Claim
          </button>
          <button
            className={`px-6 py-2 rounded-xl font-semibold transition-all text-base flex items-center gap-2 ${tab === 'buy' ? 'bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-glow scale-105' : 'bg-white/5 text-zinc-300 hover:bg-white/10'}`}
            onClick={() => setTab('buy')}
          >
            <Coins className="w-5 h-5" /> Buy
          </button>
        </div>
        {/* Tab content */}
        <Card variant="nft" className="flex flex-col items-center p-8 gap-4">
          {tab === 'claim' ? (
            <>
              <span className="flex items-center gap-2 text-zinc-400 text-lg">
                <Gift className="w-6 h-6 text-accent-neon" /> Claim Tokens
              </span>
              <ClaimCooldownWidget />
              <ClaimForm />
            </>
          ) : (
            <>
              <span className="flex items-center gap-2 text-zinc-400 text-lg">
                <Coins className="w-6 h-6 text-accent-neon" /> Buy More Tokens
              </span>
              <BuyTokensWidget />
            </>
          )}
        </Card>
        {/* Информация */}
        <Card className="flex flex-col items-center p-6 gap-2">
          <span className="flex items-center gap-2 text-zinc-400 text-sm">
            <Info className="w-5 h-5 text-accent-neon" /> Info
          </span>
          <ul className="text-zinc-400 text-base list-disc pl-6 space-y-1 text-left w-full max-w-md">
            <li>Claim tokens once per cooldown period</li>
            <li>Buy any amount of tokens with SOL</li>
            <li>All actions are on-chain and transparent</li>
            <li>Check your balances and claim status above</li>
          </ul>
        </Card>
      </motion.div>
    </div>
  )
}
