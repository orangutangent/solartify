'use client'
import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { useNftGifterProgram } from '@/components/nftgifter/nftgifter-data-access'
import { useWallet } from '@solana/wallet-adapter-react'

export function BuyTokensWidget() {
  const [amount, setAmount] = useState('1')
  const [txid, setTxid] = useState<string | null>(null)
  const { purchaseTokens } = useNftGifterProgram()
  const wallet = useWallet()

  const handleBuy = async () => {
    setTxid(null)
    if (!wallet.publicKey || !amount || isNaN(Number(amount)) || Number(amount) <= 0) return
    try {
      const tx = await purchaseTokens.mutateAsync(Number(amount))
      setTxid(tx)
    } catch {}
  }

  return (
    <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-fuchsia-900/40 border border-zinc-700 shadow-lg max-w-xs mx-auto">
      <div className="mb-2 text-lg font-semibold text-white">Buy Tokens</div>
      <input
        type="number"
        min={1}
        step={1}
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
        className="w-full mb-3 px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
        placeholder="Amount of tokens"
        disabled={purchaseTokens.isPending}
      />
      <button
        className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        onClick={handleBuy}
        disabled={purchaseTokens.isPending || !amount || Number(amount) <= 0}
      >
        {purchaseTokens.isPending ? <Spinner className="w-5 h-5" /> : 'Buy Tokens'}
      </button>
      {txid && <div className="text-green-400 mt-2 break-all">Success! Tx: {txid}</div>}
      {purchaseTokens.isError && <div className="text-red-400 mt-2">Error. Try again.</div>}
    </div>
  )
}
