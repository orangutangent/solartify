'use client'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { MINT_PUBKEY_PK } from '@/lib/constants'
import { Spinner } from '@/components/ui/spinner'

export function TokenBalanceWidget() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [balance, setBalance] = useState<string>('—')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!wallet.publicKey) return
    setLoading(true)
    connection
      .getParsedTokenAccountsByOwner(wallet.publicKey, { mint: MINT_PUBKEY_PK })
      .then((accounts) => {
        let bal = '0'
        accounts.value.forEach((acc) => {
          bal = acc.account.data.parsed.info.tokenAmount.uiAmountString
        })
        setBalance(bal)
      })
      .catch(() => setBalance('—'))
      .finally(() => setLoading(false))
  }, [wallet.publicKey, connection])

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-indigo-900/60 to-fuchsia-900/40 border border-zinc-700 shadow-lg mb-4">
      <div className="text-3xl mb-2">🪙</div>
      <div className="text-2xl font-bold text-green-400 flex items-center gap-2">
        {loading ? <Spinner className="w-5 h-5" /> : balance}
        <span className="text-base text-zinc-300 font-normal ml-1">TOKEN</span>
      </div>
      <div className="text-xs text-zinc-400 mt-1">Your Balance</div>
    </div>
  )
}
