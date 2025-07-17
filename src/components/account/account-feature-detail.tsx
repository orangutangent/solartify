import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { ExplorerLink } from '@/components/cluster/cluster-ui'
import { AppHero } from '@/components/app-hero'
import { ellipsify } from '@/lib/utils'
import { AccountBalance, AccountButtons, AccountTokens, AccountTransactions } from './account-ui'
import { PublicKey } from '@solana/web3.js'
import { address as toAddress } from 'gill'

export default function AccountFeatureDetail() {
  const params = useParams()
  const address = useMemo(() => {
    if (!params.address || typeof params.address !== 'string') {
      return undefined
    }
    try {
      return new PublicKey(params.address)
    } catch {
      return undefined
    }
  }, [params])
  if (!address) {
    return <div>Error loading account</div>
  }
  const addr = toAddress(address.toString())

  return (
    <div>
      <AppHero
        title={<AccountBalance address={addr} />}
        subtitle={
          <div className="my-4">
            <ExplorerLink path={address.toString()} label={ellipsify(address.toString())} />
          </div>
        }
      >
        <div className="my-4">
          <AccountButtons address={addr} />
        </div>
      </AppHero>
      <div className="space-y-8">
        <AccountTokens address={addr} />
        <AccountTransactions address={addr} />
      </div>
    </div>
  )
}
