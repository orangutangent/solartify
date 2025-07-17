import { ReactNode } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '@/components/solana/solana-provider'

export default function AccountFeatureIndex({ redirect }: { redirect: (path: string) => ReactNode }) {
  const wallet = useWallet()

  if (wallet.publicKey) {
    return redirect(`/account/${wallet.publicKey.toString()}`)
  }

  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <WalletButton />
      </div>
    </div>
  )
}
