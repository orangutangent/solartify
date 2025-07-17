import { useNftGifterProgram } from '@/components/nftgifter/nftgifter-data-access'
import { Spinner } from '@/components/ui/spinner'

export function ClaimTokensWidget() {
  const { claimTokens } = useNftGifterProgram()
  return (
    <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-fuchsia-900/60 to-indigo-900/40 border border-zinc-700 shadow-lg">
      <button
        className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 mb-2"
        onClick={() => claimTokens.mutateAsync()}
        disabled={claimTokens.isPending}
      >
        {claimTokens.isPending ? (
          <span className="flex items-center gap-2 justify-center">
            <Spinner className="w-6 h-6" /> Claiming...
          </span>
        ) : (
          <span>Claim Tokens</span>
        )}
      </button>
      {claimTokens.isError && <div className="text-sm text-red-400 mt-2">Claim failed. Try again.</div>}
      {claimTokens.isSuccess && <div className="text-sm text-green-400 mt-2">Claim successful!</div>}
    </div>
  )
}
