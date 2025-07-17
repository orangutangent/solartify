import { useMemo } from 'react'
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { connection } from './solanaConnection'
import idl from './idl.json'
import { PublicKey } from '@solana/web3.js'

export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID as string)

export function useAnchorProgram() {
  const wallet = useWallet()
  return useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) return null
    const anchorWallet = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    }
    const provider = new AnchorProvider(connection, anchorWallet, { preflightCommitment: 'confirmed' })
    return new Program(idl as Idl, provider)
  }, [wallet])
}
