'use client'

import { useState, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNftGifterProgram } from '@/components/nftgifter/nftgifter-data-access'
import { useClaimStore } from '../store/claim.store'
import { Button } from '../../../components/ui/button'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { findConfigPda, findUserClaimPda } from '@/lib/solanaConnection'
import { Spinner } from '@/components/ui/spinner'
import { ADMIN_PUBKEY_PK, MINT_PUBKEY_PK, PROGRAM_ID_PK } from '@/lib/constants'

export function ClaimForm() {
  const wallet = useWallet()
  const { claimTokens } = useNftGifterProgram()
  const { status, setStatus } = useClaimStore()
  const [loading, setLoading] = useState(false)
  const [txid, setTxid] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Вычисляем PDA и адреса заранее
  const pdas = useMemo(() => {
    if (!wallet.publicKey) return null
    const [configPda] = findConfigPda(ADMIN_PUBKEY_PK, PROGRAM_ID_PK)
    const [userClaimPda] = findUserClaimPda(wallet.publicKey, MINT_PUBKEY_PK)
    return { configPda, userClaimPda }
  }, [wallet.publicKey])

  const [userTokenAccount, setUserTokenAccount] = useState<string | null>(null)

  // Получаем адрес токен-аккаунта пользователя
  useMemo(() => {
    if (!wallet.publicKey || !pdas) return
    getAssociatedTokenAddress(MINT_PUBKEY_PK, wallet.publicKey).then((ata) => setUserTokenAccount(ata.toBase58()))
  }, [wallet.publicKey, pdas])

  const handleClaim = async () => {
    setError(null)
    setTxid(null)
    if (!wallet.publicKey || !pdas || !userTokenAccount) return
    setLoading(true)
    setStatus('pending')
    try {
      const result = await claimTokens.mutateAsync()
      setStatus('success')
      setTxid(result)
      // Можно обновить cooldown, если нужно
    } catch (e: unknown) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl shadow-xl border border-zinc-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-bold tracking-tight text-white">Claim your daily tokens</span>
        {loading && <Spinner className="w-5 h-5 text-primary animate-spin" />}
      </div>
      <div className="text-xs text-zinc-400 mb-2">
        <div>
          Wallet: <span className="font-mono text-zinc-200">{wallet.publicKey?.toBase58() ?? '—'}</span>
        </div>
        <div>
          Token Account: <span className="font-mono text-zinc-200">{userTokenAccount ?? '—'}</span>
        </div>
        <div>
          Config PDA: <span className="font-mono text-zinc-200">{pdas?.configPda?.toBase58() ?? '—'}</span>
        </div>
      </div>
      <Button
        onClick={handleClaim}
        disabled={loading || status === 'pending' || !wallet.publicKey || !userTokenAccount}
        className="transition-all duration-200 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:scale-105 active:scale-95"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Spinner className="w-4 h-4" /> Claiming...
          </span>
        ) : (
          <span>Claim Tokens</span>
        )}
      </Button>
      {txid && (
        <div className="text-xs text-green-400 break-all mt-2">
          Success! Tx:{' '}
          <a
            href={`https://solscan.io/tx/${txid}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {txid}
          </a>
        </div>
      )}
      {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
      <div className="text-xs text-zinc-500 mt-2">
        <span>Tip: You can claim once every 24h. Make sure you have some SOL for fees.</span>
      </div>
    </div>
  )
}
