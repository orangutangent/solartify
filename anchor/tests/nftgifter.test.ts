/* eslint-disable @typescript-eslint/no-unused-vars */
import * as anchor from '@coral-xyz/anchor'
import BN from 'bn.js'
import { Program } from '@coral-xyz/anchor'
import { type NftGifter } from '../target/types/nft_gifter.ts'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { assert } from 'chai'
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, getAccount } from '@solana/spl-token'

describe('nftgifter - claim_tokens', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const program = anchor.workspace.Nftgifter as Program<NftGifter>

  const purchasePrice = 1_000_000 // 0.001 SOL
  const claimPrice = 100_000 // 0.0001 SOL
  const tokensPerClaim = 5_000_000_000 // 5 tokens

  async function setupTestEnv() {
    const user = anchor.web3.Keypair.generate()
    const admin = anchor.web3.Keypair.generate()
    console.log('--------------------')
    console.log('admin: ', admin.publicKey)
    console.log('--------------------')

    // Airdrop for admin
    const sigAdmin = await provider.connection.requestAirdrop(admin.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL)
    await provider.connection.confirmTransaction(sigAdmin, 'confirmed')

    // Airdrop for user
    const sigUser = await provider.connection.requestAirdrop(user.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL)
    await provider.connection.confirmTransaction(sigUser, 'confirmed')

    const [configPda, configBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('config'), admin.publicKey.toBuffer()],
      program.programId,
    )

    const mint = await createMint(
      provider.connection,
      admin,
      configPda,
      null,
      9,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID,
    )

    await new Promise((resolve) => setTimeout(resolve, 1000))

    await program.methods
      .initConfig(new BN(purchasePrice), new BN(claimPrice), new BN(tokensPerClaim), configBump)
      .accounts({
        owner: admin.publicKey,
        // config: configPda,
        // systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc()

    const configAccount = await program.account.config.fetch(configPda)
    console.log('Config after init:', configAccount)

    return {
      user,
      admin,
      configPda,
      configBump,
      mint,
      program,
      provider,
      purchasePrice,
      claimPrice,
      tokensPerClaim,
    }
  }

  it('User can claim tokens', async () => {
    const { user, configPda, mint, program, provider, tokensPerClaim, claimPrice } = await setupTestEnv()

    // console.log('TOKEN_PROGRAM_ID:', TOKEN_PROGRAM_ID?.toBase58?.() || TOKEN_PROGRAM_ID)
    // console.log('payer:', provider.wallet?.payer?.publicKey?.toBase58?.())
    // console.log('mint:', await provider.connection.getAccountInfo(mint))
    // console.log('user:', user.publicKey.toBase58())
    // const configInfo = await provider.connection.getAccountInfo(configPda)
    // console.log('config:', configInfo)
    if (!provider.wallet.payer) return
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer,
      mint,
      user.publicKey,
      true,
    )

    // console.log(userTokenAccount)

    const claimTx = await program.methods
      .claimTokens()
      .accounts({
        user: user.publicKey,
        tokenMint: mint,
        // userTokenAccount: userTokenAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        config: configPda,
        // associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        // tokenProgram: TOKEN_PROGRAM_ID,
        // systemProgram: SYSTEM_PROGRAM_ID,
      })
      .signers([user])
      .rpc()
      .then(async (txSig) => {
        await provider.connection.confirmTransaction(txSig, 'confirmed')
      })

    const userTokenAccInfo = await getAccount(
      provider.connection,
      userTokenAccount.address,
      'confirmed',
      TOKEN_PROGRAM_ID,
    )

    console.log('user token acc info: ', userTokenAccInfo)
    assert.equal(Number(userTokenAccInfo.amount), tokensPerClaim, 'User should have claimed tokens')

    const configBalance = await provider.connection.getBalance(configPda, 'confirmed')
    assert(configBalance > claimPrice, 'Config PDA should have received claim SOL')

    const userClaimPda = (
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('claim'), user.publicKey.toBuffer()],
        program.programId,
      )
    )[0]
    const userClaimAccount = await program.account.userClaimData.fetch(userClaimPda)
    assert.isAbove(Number(userClaimAccount.lastClaimTs), 0, 'last_claim_ts should be set')
  })

  it('User can purchase tokens', async () => {
    const { user, configPda, mint, program, provider, tokensPerClaim, purchasePrice } = await setupTestEnv()

    if (!provider.wallet.payer) return

    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer,
      mint,
      user.publicKey,
    )

    const balanceBefore = await provider.connection.getBalance(configPda, 'confirmed')
    console.log('Config balance before purchase:', balanceBefore)

    const purchaseTx = await program.methods
      .purchaseTokens(new BN(5))
      .accounts({
        user: user.publicKey,
        config: configPda,
        tokenMint: mint,
        // userTokenAccount: userTokenAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        // associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
      })
      .signers([user])
      .rpc()
      .then(async (txSig) => {
        await provider.connection.confirmTransaction(txSig, 'confirmed')
      })

    const userTokenAccInfo = await getAccount(
      provider.connection,
      userTokenAccount.address,
      'confirmed',
      TOKEN_PROGRAM_ID,
    )
    console.log('User token balance after purchase:', Number(userTokenAccInfo.amount))
    assert.equal(Number(userTokenAccInfo.amount), tokensPerClaim, 'User should have purchased tokens')

    const balanceAfter = await provider.connection.getBalance(configPda, 'confirmed')
    console.log('Config balance after purchase:', balanceAfter)
    assert.equal(balanceAfter - balanceBefore, purchasePrice * 5, 'Config PDA should have received purchase SOL')
  })

  it('Admin can withdraw SOL from config PDA', async () => {
    const { admin, configPda, program, provider, claimPrice } = await setupTestEnv()

    // Top up config PDA via airdrop
    await provider.connection.requestAirdrop(configPda, claimPrice)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const destination = anchor.web3.Keypair.generate()
    const airdropTx = await provider.connection.requestAirdrop(destination.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL)

    await provider.connection.confirmTransaction(airdropTx, 'confirmed')

    const balanceBefore = await provider.connection.getBalance(destination.publicKey, 'confirmed')
    const configBalanceBefore = await provider.connection.getBalance(configPda, 'confirmed')
    console.log('Config balance before withdraw:', configBalanceBefore)
    console.log('Destination balance before withdraw:', balanceBefore)

    // console.log('admin.publicKey (accounts.owner):', admin.publicKey.toBase58())
    // console.log('admin.toString:', admin.toString())
    const signers = [admin]
    // console.log('signers[0].publicKey:', signers[0].publicKey.toBase58())
    // console.log('admin === signers[0]:', admin === signers[0])
    // console.log('signers:', signers)

    const withdrawTx = await program.methods
      .withdrawSol(new BN(claimPrice))
      .accountsStrict({
        owner: admin.publicKey,
        config: configPda,
        destination: destination.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers(signers)
      .rpc()
      .then(async (txSig) => {
        await provider.connection.confirmTransaction(txSig, 'confirmed')
      })

    const balanceAfter = await provider.connection.getBalance(destination.publicKey, 'confirmed')
    const configBalanceAfter = await provider.connection.getBalance(configPda, 'confirmed')
    console.log('Config balance after withdraw:', configBalanceAfter)
    console.log('Destination balance after withdraw:', balanceAfter)

    assert.equal(balanceAfter - balanceBefore, claimPrice, 'Destination should receive withdrawn SOL')
  })

  it('Admin can update config', async () => {
    const { admin, configPda, program } = await setupTestEnv()

    const newPurchasePrice = 2_000_000
    const newClaimPrice = 200_000
    const newTokensPerClaim = 10

    // console.log('admin.publicKey (accounts.owner):', admin.publicKey.toBase58())
    // console.log('admin.toString:', admin.toString())
    const signers = [admin]
    // console.log('signers[0].publicKey:', signers[0].publicKey.toBase58())
    // console.log('admin === signers[0]:', admin === signers[0])
    // console.log('signers:', signers)

    const updateTx = await program.methods
      .updateConfig(new BN(newPurchasePrice), new BN(newClaimPrice), new BN(newTokensPerClaim))
      .accountsStrict({
        owner: admin.publicKey,
        config: configPda,
      })
      .signers(signers)
      .rpc()
      .then(async (txSig) => {
        await program.provider.connection.confirmTransaction(txSig, 'confirmed')
      })

    const configAccount = await program.account.config.fetch(configPda)
    console.log('Config after update:', configAccount)

    assert.equal(Number(configAccount.purchasePriceLamports), newPurchasePrice, 'Purchase price updated')
    assert.equal(Number(configAccount.claimPriceLamports), newClaimPrice, 'Claim price updated')
    assert.equal(Number(configAccount.tokensPerClaim), newTokensPerClaim, 'Tokens per claim updated')
  })

  it('User can mint NFT by burning tokens', async () => {
    const { user, configPda, mint, program, provider, tokensPerClaim } = await setupTestEnv()

    if (!provider.wallet.payer) return
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer,
      mint,
      user.publicKey,
    )
    const claimTx = await program.methods
      .claimTokens()
      .accounts({
        user: user.publicKey,
        config: configPda,
        tokenMint: mint,
        // userTokenAccount: userTokenAccount.address,
        // userClaim: (
        //   await anchor.web3.PublicKey.findProgramAddress(
        //     [Buffer.from('claim'), user.publicKey.toBuffer()],
        //     program.programId,
        //   )
        // )[0],
        tokenProgram: TOKEN_PROGRAM_ID,
        // associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        // systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc()
      .then(async (txSig) => {
        await provider.connection.confirmTransaction(txSig, 'confirmed')
      })

    // Create mint for NFT
    const nftMint = await createMint(
      provider.connection,
      provider.wallet.payer,
      user.publicKey,
      null,
      0,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID,
    )
    const userNftAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer,
      nftMint,
      user.publicKey,
    )

    const userTokenBalanceBefore = (
      await getAccount(provider.connection, userTokenAccount.address, 'confirmed', TOKEN_PROGRAM_ID)
    ).amount
    console.log('User token balance before mint NFT:', userTokenBalanceBefore)

    const mintNftTx = await program.methods
      .mintNft()
      .accounts({
        user: user.publicKey,
        config: configPda,
        tokenMint: mint,
        userTokenAccount: userTokenAccount.address,
        nftMint: nftMint,
        // userNftAccount: userNftAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        // associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        // systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc()
      .then(async (txSig) => {
        await provider.connection.confirmTransaction(txSig, 'confirmed')
      })

    const nftAccInfo = await getAccount(provider.connection, userNftAccount.address, 'confirmed', TOKEN_PROGRAM_ID)
    const userTokenBalanceAfter = (
      await getAccount(provider.connection, userTokenAccount.address, 'confirmed', TOKEN_PROGRAM_ID)
    ).amount
    console.log('User token balance after mint NFT:', userTokenBalanceAfter)
    console.log('User NFT balance after mint:', Number(nftAccInfo.amount))

    assert.equal(Number(nftAccInfo.amount), 1, 'User should have received NFT')
    assert.equal(Number(userTokenBalanceAfter), 4_000_000_000, 'User tokens should be burned')
  })
})
