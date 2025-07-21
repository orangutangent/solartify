'use client'

import { useNftGifterProgram } from '@/components/nftgifter/nftgifter-data-access'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { useConnection } from '@solana/wallet-adapter-react'
import { findUserClaimPda } from '@/lib/solanaConnection'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

function useClaimCooldownQuery() {
  const { connection } = useConnection()
  const wallet = useWallet()
  return useQuery({
    queryKey: ['claim-cooldown', wallet.publicKey?.toBase58()],
    enabled: !!wallet.publicKey,
    queryFn: async () => {
      if (!wallet.publicKey) throw new Error('No wallet')
      const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!)
      const [userClaimPda] = findUserClaimPda(wallet.publicKey, programId)
      const account = await connection.getAccountInfo(userClaimPda)
      if (!account || !account.data) {
        return { canClaim: true, lastClaimTs: 0, nextClaimDate: null }
      }
      const lastClaimTs = Number(
        account.data.slice(8, 16).reduce((acc, b, i) => acc + BigInt(b) * (1n << (8n * BigInt(i))), 0n),
      )
      const now = Math.floor(Date.now() / 1000)
      const cooldown = 24 * 3600
      const canClaim = now - lastClaimTs >= cooldown
      const nextClaimDate = canClaim ? null : new Date((lastClaimTs + cooldown) * 1000)
      return { canClaim, lastClaimTs, nextClaimDate }
    },
  })
}

function formatTimeLeft(date: Date | null) {
  if (!date) return ''
  const left = Math.max(0, Math.floor((date.getTime() - Date.now()) / 1000))
  const h = Math.floor(left / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60
  return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':')
}

export function ClaimForm() {
  const { claimTokens } = useNftGifterProgram() ?? {}
  const wallet = useWallet()
  const { data: cooldownData, isLoading: cooldownLoading } = useClaimCooldownQuery()
  const [timeLeft, setTimeLeft] = useState('')
  useEffect(() => {
    if (!cooldownData?.nextClaimDate) return setTimeLeft('')
    const update = () => setTimeLeft(formatTimeLeft(cooldownData.nextClaimDate))
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [cooldownData?.nextClaimDate])
  if (!wallet.publicKey) return null
  const canClaim = cooldownData?.canClaim
  const disabled = claimTokens?.isPending || !canClaim || cooldownLoading
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="primary"
        size="lg"
        loading={claimTokens?.isPending}
        onClick={() => claimTokens?.mutateAsync()}
        disabled={disabled}
        className={`w-48 ${disabled ? 'opacity-60 cursor-not-allowed shadow-none' : ''}`}
      >
        Claim Tokens
      </Button>
      {!canClaim && timeLeft && <span className="text-xs text-zinc-400 mt-1">Wait for cooldown</span>}
      {claimTokens?.isError && <span className="text-xs text-red-400 mt-1">Claim failed. Try again.</span>}
      {claimTokens?.isSuccess && <span className="text-xs text-green-400 mt-1">Claim successful!</span>}
    </div>
  )
}
