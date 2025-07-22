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
import BN from 'bn.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createProgrammableNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, percentAmount, signerIdentity } from '@metaplex-foundation/umi'
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async ({
      name,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

        // 1. Инициализация umi (только для Metaplex, без uploader)
        const umi = createUmi(process.env.NEXT_PUBLIC_UMI_RPC!).use(mplTokenMetadata())

        // 2. Генерируем ключевую пару (signer) для нового NFT
        const mintSigner = generateSigner(umi)
        umi.use(signerIdentity(mintSigner))

        // 3. Конвертируем signer в Keypair для Anchor
        const mintKeypair = Keypair.fromSecretKey(mintSigner.secretKey)

        // 4. Вызов Anchor-инструкции mintNft
        let tx = ''
        try {
          console.log('Calling Anchor mintNft instruction...')
          const [configPda] = findConfigPda(ADMIN_PUBKEY_PK, programId)
          const mintPubkey = new PublicKey(process.env.NEXT_PUBLIC_MINT_PUBKEY!)
          const userTokenAccount = await getAssociatedTokenAddress(mintPubkey, wallet.publicKey)
          const userNftAccount = await getAssociatedTokenAddress(mintKeypair.publicKey, wallet.publicKey)
          tx = await program.methods
            .mintNft()
            .accountsStrict({
              user: wallet.publicKey,
              config: configPda,
              tokenMint: mintPubkey,
              userTokenAccount,
              nftMint: mintKeypair.publicKey,
              userNftAccount,
              tokenProgram: TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
            })
            // .signers([mintKeypair])
            .rpc()
          console.log('Anchor mintNft successful, tx:', tx)
        } catch (e) {
          console.error('Ошибка вызова Anchor mintNft:', e)
          toast.error('Ошибка mintNft: ' + (e instanceof Error ? e.message : String(e)))
          throw e
        }

        // 5. Вызов createProgrammableNft (Metaplex umi)
        try {
          console.log('Calling Metaplex createProgrammableNft...')
          await createProgrammableNft(umi, {
            mint: mintSigner,
            sellerFeeBasisPoints: percentAmount(5.5),
            name,
            uri: metadataUri,
            ruleSet: null,
          }).sendAndConfirm(umi)
          console.log('Metaplex createProgrammableNft successful')
        } catch (e) {
          console.error('Ошибка createProgrammableNft:', e)
          toast.error('Ошибка создания метадаты: ' + (e instanceof Error ? e.message : String(e)))
          throw e
        }

        return tx
      } catch (e) {
        console.error('Mint NFT error:', e)
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

  // Удаляю uploadImage, теперь он в отдельном файле

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
