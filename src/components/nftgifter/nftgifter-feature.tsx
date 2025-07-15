import { WalletButton } from '../solana/solana-provider'
import { NftgifterButtonInitialize, NftgifterList, NftgifterProgramExplorerLink, NftgifterProgramGuard } from './nftgifter-ui'
import { AppHero } from '../app-hero'
import { useWalletUi } from '@wallet-ui/react'

export default function NftgifterFeature() {
  const { account } = useWalletUi()

  return (
    <NftgifterProgramGuard>
      <AppHero
        title="Nftgifter"
        subtitle={
          account
            ? "Initialize a new nftgifter onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <NftgifterProgramExplorerLink />
        </p>
        {account ? (
          <NftgifterButtonInitialize />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletButton />
          </div>
        )}
      </AppHero>
      {account ? <NftgifterList /> : null}
    </NftgifterProgramGuard>
  )
}
