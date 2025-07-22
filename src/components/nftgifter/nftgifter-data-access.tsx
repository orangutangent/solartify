/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useConnection } from '@solana/wallet-adapter-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { AnchorProvider, Program, Idl, Wallet as AnchorWallet } from '@coral-xyz/anchor'
import idl from '@/lib/idl.json'
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  SYSVAR_RENT_PUBKEY,
  ComputeBudgetProgram,
} from '@solana/web3.js'
import { toast } from 'sonner'
import { findConfigPda, findUserClaimPda } from '@/lib/solanaConnection'
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token'

import { ADMIN_PUBKEY_PK } from '@/lib/constants'
import { NftGifter } from '@/types/nft_gifter'
import BN from 'bn.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { mplTokenMetadata, createMetadataAccountV3, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { transactionBuilder, publicKey, percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'
// import * as anchor from '@coral-xyz/anchor'

export function useNftGifterProgram() {
  const { connection } = useConnection()
  const wallet = useWallet() as unknown as AnchorWallet
  const programId = useMemo(() => new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!), [])
  const provider = useMemo(() => {
    if (!wallet || !wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) return null
    return new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' })
  }, [connection, wallet])
  const program = useMemo(() => (provider ? new Program<NftGifter>(idl as Idl, provider) : null), [provider, programId])

  // Get config
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

  // Claim tokens
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
    mutationFn: async ({
      name,
      description,
      metadataUri,
    }: {
      name: string
      description: string
      metadataUri: string
    }) => {
      try {
        if (!program || !wallet || !wallet.publicKey) throw new Error('No wallet/program')
        if (!metadataUri) throw new Error('Metadata URI is required')

        console.log('Starting Anchor-driven NFT mint process with:', { name, description, metadataUri })

        // 1. Generate Keypair for the new NFT. It will sign its own account creation.
        const nftMintKeypair = Keypair.generate()
        console.log('Generated new mint keypair:', nftMintKeypair.publicKey.toBase58())

        // Add instructions to increase Compute Units limit
        const transaction = new Transaction().add(
          ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }),
          ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1 }),
        )

        // 2. Calculate PDA for Metadata and Master Edition
        // IMPORTANT: If your contract uses different seeds for PDA, adjust them here!
        const [nftMetadataPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('metadata'),
            new PublicKey(process.env.NEXT_PUBLIC_METAPLEX_PROGRAM_ID!).toBuffer(),
            nftMintKeypair.publicKey.toBuffer(),
          ],
          new PublicKey(process.env.NEXT_PUBLIC_METAPLEX_PROGRAM_ID!),
        )
        const [masterEditionPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('metadata'),
            new PublicKey(process.env.NEXT_PUBLIC_METAPLEX_PROGRAM_ID!).toBuffer(),
            nftMintKeypair.publicKey.toBuffer(),
            Buffer.from('edition'),
          ],
          new PublicKey(process.env.NEXT_PUBLIC_METAPLEX_PROGRAM_ID!),
        )

        // 3. Get ATA for NFT (Anchor will create it if needed)
        const userNftAccount = await getAssociatedTokenAddress(nftMintKeypair.publicKey, wallet.publicKey)

        // 4. Get ATA for utility token
        const utilityTokenMint = new PublicKey(process.env.NEXT_PUBLIC_MINT_PUBKEY!)
        const userUtilityTokenAta = await getAssociatedTokenAddress(utilityTokenMint, wallet.publicKey)

        const [configPda] = await findConfigPda(ADMIN_PUBKEY_PK, program.programId)

        // 5. Call your Anchor mintNft instruction
        console.log('Calling Anchor mintNft instruction...')
        const txSignature = await program.methods
          .mintNft(name, 'GIFT', metadataUri) // Pass name, symbol, uri
          .accountsStrict({
            user: wallet.publicKey,
            config: configPda,
            utilityTokenMint: utilityTokenMint,
            userUtilityTokenAccount: userUtilityTokenAta,
            nftMint: nftMintKeypair.publicKey, // Передаем publicKey сгенерированного Keypair
            userNftAccount: userNftAccount,
            nftMetadata: nftMetadataPda,
            masterEditionAccount: masterEditionPda,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY, // Add rent
            metadataProgram: new PublicKey(process.env.NEXT_PUBLIC_METAPLEX_PROGRAM_ID!), // Add metadataProgram
          })
          .signers([nftMintKeypair]) // IMPORTANT: Add nftMintKeypair to signers
          .rpc()
        await connection.confirmTransaction(txSignature, 'confirmed')
        console.log('Anchor mintNft successful, signature:', txSignature)

        return txSignature
      } catch (e) {
        console.error('Mint NFT error:', e)
        toast.error('Mint failed: ' + (e instanceof Error ? e.message : String(e)))
        throw e
      }
    },
    onSuccess: (tx) => toast.success('NFT Minted! Tx: ' + tx),
    onError: (e) => toast.error('Mint failed: ' + (e instanceof Error ? e.message : String(e))),
  })

  // Покупка токенов
  const purchaseTokens = useMutation({
    mutationKey: ['nftgifter-purchase', { programId }],
    mutationFn: async (amount: number) => {
      if (!program || !wallet || !wallet.publicKey) throw new Error('No wallet/program')
      if (!amount || amount <= 0) throw new Error('Amount must be positive')
      const [configPda] = findConfigPda(ADMIN_PUBKEY_PK, programId)
      const mintPubkey = new PublicKey(process.env.NEXT_PUBLIC_MINT_PUBKEY!)
      const userTokenAccount = await getAssociatedTokenAddress(mintPubkey, wallet.publicKey)

      const amountOnChain = new BN(amount)
      const tx = await program.methods
        .purchaseTokens(amountOnChain)
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
    // uploadImage,
    // ...другие хуки
  }
}
