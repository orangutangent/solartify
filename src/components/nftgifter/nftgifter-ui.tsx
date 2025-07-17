import { useNftGifterProgram } from './nftgifter-data-access'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useWallet } from '@solana/wallet-adapter-react'

export function NftgifterUI() {
  const { configQuery, claimTokens } = useNftGifterProgram() ?? {}
  const wallet = useWallet()

  if (!wallet.publicKey) {
    return <div className="text-center text-zinc-400">Connect your wallet to use NFT Gifter</div>
  }

  if (configQuery?.isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (configQuery?.isError) {
    return <div className="text-center text-red-400">Config not initialized. Ask admin to initialize config.</div>
  }

  const config = configQuery?.data

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6 p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl shadow-xl border border-zinc-700 mt-8">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-bold text-white mb-2">NFT Gifter</div>
        <div className="text-sm text-zinc-400">
          <div>
            Admin: <span className="font-mono text-zinc-200">{config?.owner.toString() ?? '—'}</span>
          </div>
          <div>
            Purchase price:{' '}
            <span className="font-mono text-zinc-200">{config?.purchasePriceLamports?.toString() ?? '—'}</span> lamports
          </div>
          <div>
            Claim price:{' '}
            <span className="font-mono text-zinc-200">{config?.claimPriceLamports?.toString() ?? '—'}</span> lamports
          </div>
          <div>
            Tokens per claim:{' '}
            <span className="font-mono text-zinc-200">{config?.tokensPerClaim?.toString() ?? '—'}</span>
          </div>
        </div>
      </div>
      <Button
        onClick={() => claimTokens?.mutateAsync()}
        disabled={claimTokens?.isPending || !config}
        className="transition-all duration-200 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:scale-105 active:scale-95"
      >
        {claimTokens?.isPending ? (
          <span className="flex items-center gap-2">
            <Spinner className="w-4 h-4" /> Claiming...
          </span>
        ) : (
          <span>Claim Tokens</span>
        )}
      </Button>
      {claimTokens?.isError && <div className="text-xs text-red-400 mt-2">Claim failed. Try again later.</div>}
      {claimTokens?.isSuccess && (
        <div className="text-xs text-green-400 mt-2">Claim successful! Tx: {claimTokens.data}</div>
      )}
    </div>
  )
}
