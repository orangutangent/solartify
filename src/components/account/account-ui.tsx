/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetBalanceQuery,
  useGetTokenAccountsQuery,
  useGetSignaturesQuery,
  useRequestAirdropMutation,
} from './account-data-access'
import { PublicKey } from '@solana/web3.js'
import { ExplorerLink } from '@/components/cluster/cluster-ui'
import { Button } from '@/components/ui/button'

export function AccountBalance({ address }: { address: string | PublicKey }) {
  const { data, isLoading } = useGetBalanceQuery({ address })
  return (
    <h1 className="text-5xl font-bold cursor-pointer">{isLoading ? '...' : `${((data ?? 0) / 1e9).toFixed(2)} SOL`}</h1>
  )
}

export function AccountButtons({ address }: { address: string | PublicKey }) {
  const { mutateAsync, isPending } = useRequestAirdropMutation({ address })
  return (
    <div className="space-x-2">
      <Button onClick={() => mutateAsync(1)} disabled={isPending}>
        {isPending ? 'Airdropping...' : 'Airdrop 1 SOL'}
      </Button>
    </div>
  )
}

export function AccountTokens({ address }: { address: string | PublicKey }) {
  const { data, isLoading } = useGetTokenAccountsQuery({ address })
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Token Accounts</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data?.map((item: any) => (
            <li key={item.pubkey.toString()}>
              <ExplorerLink path={item.pubkey.toString()} label={item.pubkey.toString()} /> — Mint:{' '}
              {item.account.data.parsed.info.mint}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function AccountTransactions({ address }: { address: string | PublicKey }) {
  const { data, isLoading } = useGetSignaturesQuery({ address })
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Transaction History</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data?.map((item: any) => (
            <li key={item.signature}>
              <ExplorerLink path={item.signature} label={item.signature} /> — Slot: {item.slot}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
