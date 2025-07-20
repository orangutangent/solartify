'use client'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { findUserClaimPda } from '@/lib/solanaConnection'
import { Spinner } from '@/components/ui/spinner'
import { PROGRAM_ID_PK } from '@/lib/constants'
import { useNftGifterProgram } from '@/components/nftgifter/nftgifter-data-access'

function formatTimeLeft(seconds: number) {
  if (seconds <= 0) return 'Available!'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h}h ${m}m ${s}s`
}

export function ClaimCooldownWidget() {
  const wallet = useWallet()
  const { program, claimTokens } = useNftGifterProgram()
  const [cooldown, setCooldown] = useState<number>(0)
  const [lastClaim, setLastClaim] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    const fetchLastClaim = async () => {
      if (!wallet.publicKey || !program) return
      setLoading(true)
      try {
        const programId = PROGRAM_ID_PK
        console.log('programId', programId.toBase58())
        const [userClaimPda] = findUserClaimPda(wallet.publicKey, programId)
        const userClaim = await program.account.userClaimData.fetch(userClaimPda)
        const lastClaimTs = Number(userClaim.lastClaimTs)
        console.log('lastClaimTs', lastClaimTs)
        setLastClaim(lastClaimTs)
        const now = Math.floor(Date.now() / 1000)
        const left = 86400 - (now - lastClaimTs)
        setCooldown(left > 0 ? left : 0)
        timer = setInterval(() => {
          const now2 = Math.floor(Date.now() / 1000)
          const left2 = 86400 - (now2 - lastClaimTs)
          setCooldown(left2 > 0 ? left2 : 0)
        }, 1000)
      } catch {
        setLastClaim(null)
        setCooldown(0)
      } finally {
        setLoading(false)
      }
    }
    fetchLastClaim()
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [wallet.publicKey, program])

  // Обновляем таймер после успешного claim
  useEffect(() => {
    if (claimTokens?.isSuccess) {
      // Повторно получаем lastClaimTs
      ;(async () => {
        if (!wallet.publicKey || !program) return
        const programId = PROGRAM_ID_PK
        const [userClaimPda] = findUserClaimPda(wallet.publicKey, programId)
        try {
          const userClaim = await program.account.userClaimData.fetch(userClaimPda)
          const lastClaimTs = Number(userClaim.lastClaimTs)
          setLastClaim(lastClaimTs)
          const now = Math.floor(Date.now() / 1000)
          const left = 86400 - (now - lastClaimTs)
          setCooldown(left > 0 ? left : 0)
        } catch {}
      })()
    }
  }, [claimTokens?.isSuccess, wallet.publicKey, program])

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-fuchsia-900/60 to-indigo-900/40 border border-zinc-700 shadow-lg mb-4">
      <div className="text-3xl mb-2">⏳</div>
      <div className="text-2xl font-bold text-indigo-300 flex items-center gap-2">
        {loading ? <Spinner className="w-5 h-5" /> : formatTimeLeft(cooldown)}
      </div>
      <div className="text-xs text-zinc-400 mt-1">Next claim available in</div>
      {lastClaim && (
        <div className="text-xs text-zinc-500 mt-1">Last claim: {new Date(lastClaim * 1000).toLocaleString()}</div>
      )}
    </div>
  )
}
