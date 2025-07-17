import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

// Баланс SOL
export function useGetBalanceQuery({ address }: { address: string | PublicKey }) {
  const { connection } = useConnection()
  const pubkey = typeof address === 'string' ? new PublicKey(address) : address
  return useQuery({
    queryKey: ['get-balance', pubkey.toString()],
    queryFn: () => connection.getBalance(pubkey),
  })
}

// Токены (SPL)
export function useGetTokenAccountsQuery({ address }: { address: string | PublicKey }) {
  const { connection } = useConnection()
  const pubkey = typeof address === 'string' ? new PublicKey(address) : address
  return useQuery({
    queryKey: ['get-token-accounts', pubkey.toString()],
    queryFn: async () => {
      const res = await connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      })
      return res.value
    },
  })
}

// Транзакции
export function useGetSignaturesQuery({ address }: { address: string | PublicKey }) {
  const { connection } = useConnection()
  const pubkey = typeof address === 'string' ? new PublicKey(address) : address
  return useQuery({
    queryKey: ['get-signatures', pubkey.toString()],
    queryFn: () => connection.getSignaturesForAddress(pubkey),
  })
}

// Аирдроп (только devnet/testnet)
export function useRequestAirdropMutation({ address }: { address: string | PublicKey }) {
  const { connection } = useConnection()
  const pubkey = typeof address === 'string' ? new PublicKey(address) : address
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (amount: number = 1) => {
      const sig = await connection.requestAirdrop(pubkey, amount * LAMPORTS_PER_SOL)
      await connection.confirmTransaction(sig, 'confirmed')
      return sig
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-balance', pubkey.toString()] })
    },
  })
}
