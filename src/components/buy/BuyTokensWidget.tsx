'use client'
import { useNftGifterProgram } from '@/components/nftgifter/nftgifter-data-access'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function BuyTokensWidget() {
  const { purchaseTokens } = useNftGifterProgram() ?? {}
  const wallet = useWallet()
  const [amount, setAmount] = useState('')
  if (!wallet.publicKey) return null
  return (
    <form
      className="flex flex-col items-center gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return
        purchaseTokens?.mutateAsync(Number(amount))
      }}
    >
      <input
        type="number"
        min={1}
        step={1}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-48 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg text-center focus:border-accent-neon focus:ring-2 focus:ring-accent-neon outline-none transition-all duration-200"
      />
      <Button
        variant="primary"
        size="lg"
        loading={purchaseTokens?.isPending}
        disabled={purchaseTokens?.isPending || !amount || isNaN(Number(amount)) || Number(amount) <= 0}
        className="w-48"
        type="submit"
      >
        Buy Tokens
      </Button>
      {purchaseTokens?.isError && <span className="text-xs text-red-400 mt-1">Purchase failed. Try again.</span>}
      {purchaseTokens?.isSuccess && <span className="text-xs text-green-400 mt-1">Purchase successful!</span>}
    </form>
  )
}
