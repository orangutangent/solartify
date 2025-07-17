'use client'

import { useConnection } from '@solana/wallet-adapter-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { AnchorProvider, Program, Idl, Wallet as AnchorWallet } from '@coral-xyz/anchor'
import idl from '@/lib/idl.json'
import { PublicKey, SystemProgram, Keypair } from '@solana/web3.js'
import { toast } from 'sonner'
import { findConfigPda, findUserClaimPda } from '@/lib/solanaConnection'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'

import { ADMIN_PUBKEY_PK } from '@/lib/constants'
import { NftGifter } from '@/types/nft_gifter'

export function useNftGifterProgram() {
  const { connection } = useConnection()
  const wallet = useWallet() as unknown as AnchorWallet
  const programId = useMemo(() => new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!), [])
  const provider = useMemo(() => {
    if (!wallet || !wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) return null
    return new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' })
  }, [connection, wallet])
  const program = useMemo(() => (provider ? new Program<NftGifter>(idl as Idl, provider) : null), [provider, programId])

  // Получить конфиг
  const configQuery = useQuery({
    queryKey: ['nftgifter-config', { programId }],
    queryFn: async () => {
      if (!program || !wallet || !wallet.publicKey) throw new Error('No program or wallet')
      const [configPda] = findConfigPda(ADMIN_PUBKEY_PK, programId)
      const fetchConfig = await program.account.config.fetch(configPda)
      console.log('configPda', configPda.toBase58())

      return await fetchConfig
    },
    enabled: !!program && !!wallet && !!wallet.publicKey,
  })

  // Claim токенов
  const claimTokens = useMutation({
    mutationKey: ['nftgifter-claim', { programId }],
    mutationFn: async () => {
      if (!program || !wallet || !wallet.publicKey) throw new Error('No wallet/program')
      const [configPda] = findConfigPda(ADMIN_PUBKEY_PK, programId)
      const [userClaimPda] = findUserClaimPda(wallet.publicKey, programId)
      const mintPubkey = new PublicKey(process.env.NEXT_PUBLIC_MINT_PUBKEY!)
      const userTokenAccount = await getAssociatedTokenAddress(mintPubkey, wallet.publicKey)
      const tx = await program.methods
        .claimTokens()
        .accountsStrict({
          user: wallet.publicKey,
          config: configPda,
          tokenMint: mintPubkey,
          userTokenAccount,
          userClaim: userClaimPda,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
      return tx
    },
    onSuccess: (tx) => toast.success('Claimed! Tx: ' + tx),
    onError: (e) => toast.error('Claim failed: ' + (e instanceof Error ? e.message : String(e))),
    // mutation неактивна если нет wallet
    // enabled: !!program && !!wallet && !!wallet.publicKey,
  })

  // Mint NFT
  const mintNft = useMutation({
    mutationKey: ['nftgifter-mint-nft', { programId }],
    mutationFn: async () => {
      if (!program || !wallet || !wallet.publicKey) throw new Error('No wallet/program')
      const [configPda] = findConfigPda(ADMIN_PUBKEY_PK, programId)
      const mintPubkey = new PublicKey(process.env.NEXT_PUBLIC_MINT_PUBKEY!)
      const userTokenAccount = await getAssociatedTokenAddress(mintPubkey, wallet.publicKey)
      // Для NFT создаём новый mint
      const nftMint = Keypair.generate()
      const userNftAccount = await getAssociatedTokenAddress(nftMint.publicKey, wallet.publicKey)
      const tx = await program.methods
        .mintNft()
        .accountsStrict({
          user: wallet.publicKey,
          config: configPda,
          tokenMint: mintPubkey,
          userTokenAccount,
          nftMint: nftMint.publicKey,
          userNftAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        // .signers([wallet.payer])
        .rpc()
      return tx
    },
    onSuccess: (tx) => toast.success('NFT Minted! Tx: ' + tx),
    onError: (e) => toast.error('Mint failed: ' + (e instanceof Error ? e.message : String(e))),
  })

  // Покупка токенов
  const purchaseTokens = useMutation({
    mutationKey: ['nftgifter-purchase', { programId }],
    mutationFn: async (amountSol: number) => {
      if (!program || !wallet || !wallet.publicKey) throw new Error('No wallet/program')
      const [configPda] = findConfigPda(ADMIN_PUBKEY_PK, programId)
      const mintPubkey = new PublicKey(process.env.NEXT_PUBLIC_MINT_PUBKEY!)
      const userTokenAccount = await getAssociatedTokenAddress(mintPubkey, wallet.publicKey)
      // amountSol — сколько SOL пользователь хочет потратить
      // В контракте цена берётся из конфига, amount не передаётся, но можно сделать несколько покупок подряд если нужно больше токенов
      const tx = await program.methods
        .purchaseTokens()
        .accountsStrict({
          user: wallet.publicKey,
          config: configPda,
          tokenMint: mintPubkey,
          userTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
      return tx
    },
    onSuccess: (tx) => toast.success('Tokens purchased! Tx: ' + tx),
    onError: (e) => toast.error('Purchase failed: ' + (e instanceof Error ? e.message : String(e))),
  })

  // TODO: purchase, mint, withdraw, updateConfig, initConfig, etc.

  return {
    program,
    programId,
    configQuery,
    claimTokens,
    mintNft,
    purchaseTokens,
    // ...другие хуки
  }
}
