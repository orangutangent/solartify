'use client'
import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

export function BuyTokensWidget() {
  const [amount, setAmount] = useState('1')
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')

  const handleBuy = async () => {
    setStatus('pending')
    try {
      // TODO: Реализовать покупку токенов через Anchor-программу
      await new Promise((r) => setTimeout(r, 1500))
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-fuchsia-900/40 border border-zinc-700 shadow-lg max-w-xs mx-auto">
      <div className="mb-2 text-lg font-semibold text-white">Buy Tokens</div>
      <input
        type="number"
        min={0.01}
        step={0.01}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
        placeholder="Amount in SOL"
        disabled={status === 'pending'}
      />
      <button
        className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        onClick={handleBuy}
        disabled={status === 'pending' || !amount || Number(amount) <= 0}
      >
        {status === 'pending' ? <Spinner className="w-5 h-5" /> : 'Купить'}
      </button>
      {status === 'success' && <div className="text-green-400 mt-2">Success!</div>}
      {status === 'error' && <div className="text-red-400 mt-2">Error. Try again.</div>}
    </div>
  )
}
