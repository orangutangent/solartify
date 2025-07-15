import {
  NftgifterAccount,
  getCloseInstruction,
  getNftgifterProgramAccounts,
  getNftgifterProgramId,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '@project/anchor'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { generateKeyPairSigner } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useWalletTransactionSignAndSend } from '../solana/use-wallet-transaction-sign-and-send'
import { useClusterVersion } from '@/components/cluster/use-cluster-version'
import { toastTx } from '@/components/toast-tx'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill'

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519()

export function useNftgifterProgramId() {
  const { cluster } = useWalletUi()
  return useMemo(() => getNftgifterProgramId(cluster.id), [cluster])
}

export function useNftgifterProgram() {
  const { client, cluster } = useWalletUi()
  const programId = useNftgifterProgramId()
  const query = useClusterVersion()

  return useQuery({
    retry: false,
    queryKey: ['get-program-account', { cluster, clusterVersion: query.data }],
    queryFn: () => client.rpc.getAccountInfo(programId).send(),
  })
}

export function useNftgifterInitializeMutation() {
  const { cluster } = useWalletUi()
  const queryClient = useQueryClient()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => {
      const nftgifter = await generateKeyPairSigner()
      return await signAndSend(getInitializeInstruction({ payer: signer, nftgifter }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await queryClient.invalidateQueries({ queryKey: ['nftgifter', 'accounts', { cluster }] })
    },
    onError: () => toast.error('Failed to run program'),
  })
}

export function useNftgifterDecrementMutation({ nftgifter }: { nftgifter: NftgifterAccount }) {
  const invalidateAccounts = useNftgifterAccountsInvalidate()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ nftgifter: nftgifter.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useNftgifterIncrementMutation({ nftgifter }: { nftgifter: NftgifterAccount }) {
  const invalidateAccounts = useNftgifterAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ nftgifter: nftgifter.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useNftgifterSetMutation({ nftgifter }: { nftgifter: NftgifterAccount }) {
  const invalidateAccounts = useNftgifterAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async (value: number) =>
      await signAndSend(
        getSetInstruction({
          nftgifter: nftgifter.address,
          value,
        }),
        signer,
      ),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useNftgifterCloseMutation({ nftgifter }: { nftgifter: NftgifterAccount }) {
  const invalidateAccounts = useNftgifterAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getCloseInstruction({ payer: signer, nftgifter: nftgifter.address }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useNftgifterAccountsQuery() {
  const { client } = useWalletUi()

  return useQuery({
    queryKey: useNftgifterAccountsQueryKey(),
    queryFn: async () => await getNftgifterProgramAccounts(client.rpc),
  })
}

function useNftgifterAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useNftgifterAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}

function useNftgifterAccountsQueryKey() {
  const { cluster } = useWalletUi()

  return ['nftgifter', 'accounts', { cluster }]
}
