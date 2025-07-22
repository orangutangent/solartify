/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useConnection } from '@solana/wallet-adapter-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { AnchorProvider, Program, Idl, Wallet as AnchorWallet } from '@coral-xyz/anchor'
import idl from '@/lib/idl.json'
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
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
import { mplTokenMetadata, createV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { publicKey, percentAmount } from '@metaplex-foundation/umi'
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
    mutationFn: async ({ name, metadataUri }: { name: string; description: string; metadataUri: string }) => {
      try {
        if (!program || !wallet || !wallet.publicKey) throw new Error('No wallet/program')
        if (!metadataUri) throw new Error('Metadata URI is required')

        console.log('Starting classic mint process with:', { name, metadataUri })

        // 1. Генерируем Keypair для нового NFT. Он будет подписывать создание своего аккаунта.
        const nftMintKeypair = Keypair.generate()
        console.log('Generated new mint keypair:', nftMintKeypair.publicKey.toBase58())

        // 2. Создаем транзакцию
        const transaction = new Transaction()

        // 3. Инструкция для создания аккаунта под mint
        const lamports = await getMinimumBalanceForRentExemptMint(connection)
        transaction.add(
          SystemProgram.createAccount({
            fromPubkey: wallet.publicKey, // Плательщик - пользователь
            newAccountPubkey: nftMintKeypair.publicKey,
            space: MINT_SIZE,
            lamports,
            programId: TOKEN_PROGRAM_ID,
          }),
        )

        // 4. Инструкция для инициализации mint'а
        transaction.add(
          createInitializeMintInstruction(
            nftMintKeypair.publicKey,
            0, // Decimals
            wallet.publicKey, // Mint Authority
            wallet.publicKey, // Freeze Authority
          ),
        )

        // 5. Инструкция для создания ATA для NFT
        const userNftAta = await getAssociatedTokenAddress(nftMintKeypair.publicKey, wallet.publicKey)
        transaction.add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey, // Плательщик
            userNftAta,
            wallet.publicKey, // Владелец ATA
            nftMintKeypair.publicKey, // Mint
          ),
        )

        // 6. Ваша Anchor-инструкция
        const [configPda] = findConfigPda(ADMIN_PUBKEY_PK, programId)
        const utilityTokenMint = new PublicKey(process.env.NEXT_PUBLIC_MINT_PUBKEY!)
        const userUtilityTokenAta = await getAssociatedTokenAddress(utilityTokenMint, wallet.publicKey)

        const anchorInstruction = await program.methods
          .mintNft()
          .accountsStrict({
            user: wallet.publicKey,
            config: configPda,
            tokenMint: utilityTokenMint,
            userTokenAccount: userUtilityTokenAta,
            nftMint: nftMintKeypair.publicKey,
            userNftAccount: userNftAta,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .instruction()
        transaction.add(anchorInstruction)

        // 7. Отправляем транзакцию
        console.log('Sending transaction to create mint and call Anchor program...')
        const { blockhash } = await connection.getLatestBlockhash()
        transaction.recentBlockhash = blockhash
        transaction.feePayer = wallet.publicKey

        // Mint Keypair должен подписать создание своего аккаунта
        transaction.partialSign(nftMintKeypair)

        const signedTx = await wallet.signTransaction(transaction)
        const txSignature = await connection.sendRawTransaction(signedTx.serialize())
        await connection.confirmTransaction(txSignature, 'confirmed')
        console.log('Transaction successful, signature:', txSignature)

        // 8. Создание метаданных
        console.log('Creating metadata...')
        const umi = createUmi(connection.rpcEndpoint).use(walletAdapterIdentity(wallet)).use(mplTokenMetadata())

        await createV1(umi, {
          mint: publicKey(nftMintKeypair.publicKey.toBase58()),
          authority: umi.identity,
          name: name,
          uri: metadataUri,
          sellerFeeBasisPoints: percentAmount(5.5),
          tokenStandard: TokenStandard.NonFungible,
        }).sendAndConfirm(umi, { confirm: { commitment: 'confirmed' } })
        console.log('Metadata created successfully')

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
