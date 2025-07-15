import { ellipsify } from '@wallet-ui/react'
import {
  useNftgifterAccountsQuery,
  useNftgifterCloseMutation,
  useNftgifterDecrementMutation,
  useNftgifterIncrementMutation,
  useNftgifterInitializeMutation,
  useNftgifterProgram,
  useNftgifterProgramId,
  useNftgifterSetMutation,
} from './nftgifter-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExplorerLink } from '../cluster/cluster-ui'
import { NftgifterAccount } from '@project/anchor'
import { ReactNode } from 'react'

export function NftgifterProgramExplorerLink() {
  const programId = useNftgifterProgramId()

  return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}

export function NftgifterList() {
  const nftgifterAccountsQuery = useNftgifterAccountsQuery()

  if (nftgifterAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!nftgifterAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {nftgifterAccountsQuery.data?.map((nftgifter) => (
        <NftgifterCard key={nftgifter.address} nftgifter={nftgifter} />
      ))}
    </div>
  )
}

export function NftgifterProgramGuard({ children }: { children: ReactNode }) {
  const programAccountQuery = useNftgifterProgram()

  if (programAccountQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!programAccountQuery.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }

  return children
}

function NftgifterCard({ nftgifter }: { nftgifter: NftgifterAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nftgifter: {nftgifter.data.count}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={nftgifter.address} label={ellipsify(nftgifter.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <NftgifterButtonIncrement nftgifter={nftgifter} />
          <NftgifterButtonSet nftgifter={nftgifter} />
          <NftgifterButtonDecrement nftgifter={nftgifter} />
          <NftgifterButtonClose nftgifter={nftgifter} />
        </div>
      </CardContent>
    </Card>
  )
}

export function NftgifterButtonInitialize() {
  const mutationInitialize = useNftgifterInitializeMutation()

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Nftgifter {mutationInitialize.isPending && '...'}
    </Button>
  )
}

export function NftgifterButtonIncrement({ nftgifter }: { nftgifter: NftgifterAccount }) {
  const incrementMutation = useNftgifterIncrementMutation({ nftgifter })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}

export function NftgifterButtonSet({ nftgifter }: { nftgifter: NftgifterAccount }) {
  const setMutation = useNftgifterSetMutation({ nftgifter })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', nftgifter.data.count.toString() ?? '0')
        if (!value || parseInt(value) === nftgifter.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}

export function NftgifterButtonDecrement({ nftgifter }: { nftgifter: NftgifterAccount }) {
  const decrementMutation = useNftgifterDecrementMutation({ nftgifter })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}

export function NftgifterButtonClose({ nftgifter }: { nftgifter: NftgifterAccount }) {
  const closeMutation = useNftgifterCloseMutation({ nftgifter })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
