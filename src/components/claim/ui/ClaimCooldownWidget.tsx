'use client'
import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { findUserClaimPda } from '@/lib/solanaConnection'
import { PublicKey } from '@solana/web3.js'

function formatTimeLeft(seconds: number) {
  if (seconds <= 0) return '00:00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':')
}

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
      // Декодируем lastClaimTs (первые 8 байт, little-endian, BN)
      const lastClaimTs = Number(
        account.data.slice(8, 16).reduce((acc, b, i) => acc + BigInt(b) * (1n << (8n * BigInt(i))), 0n),
      )
      const now = Math.floor(Date.now() / 1000)
      const cooldown = 24 * 3600 // 24h
      const canClaim = now - lastClaimTs >= cooldown
      const nextClaimDate = canClaim ? null : new Date((lastClaimTs + cooldown) * 1000)
      return { canClaim, lastClaimTs, nextClaimDate }
    },
  })
}

export function ClaimCooldownWidget() {
  const wallet = useWallet()
  const { data, isLoading, isError } = useClaimCooldownQuery()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!wallet.publicKey || !data) return
    if (data.canClaim) {
      setTimeLeft(0)
      return
    }
    if (data.nextClaimDate !== null) {
      const update = () => {
        const now = Date.now()
        const left = Math.max(0, Math.floor((data.nextClaimDate!.getTime() - now) / 1000))
        setTimeLeft(left)
      }
      update()
      const timer = setInterval(update, 1000)
      return () => clearInterval(timer)
    }
  }, [wallet.publicKey, data])

  if (!wallet.publicKey) return null
  if (isLoading) return <span className="text-zinc-400 animate-pulse">...</span>
  if (isError) return <span className="text-red-400">Error</span>
  if (data?.canClaim) return <span className="text-green-400 font-semibold">Claim available</span>
  if (timeLeft !== null) {
    return <span className="text-2xl font-mono text-zinc-300">{formatTimeLeft(timeLeft)}</span>
  }
  return null
}
