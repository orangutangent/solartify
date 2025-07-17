/* eslint-disable @typescript-eslint/no-explicit-any */
import { Program } from '@coral-xyz/anchor'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { ClaimResult } from '../../../types/types'
import { findConfigPda, findUserClaimPda } from '../../../lib/solanaConnection'

export async function claimTokens({
  program,
  adminPubkey,
  mintPubkey,
  walletPubkey,
}: {
  program: Program
  adminPubkey: PublicKey
  mintPubkey: PublicKey
  walletPubkey: PublicKey
}): Promise<ClaimResult> {
  try {
    const [configPda] = findConfigPda(adminPubkey, program.programId)
    const userTokenAccount = await getAssociatedTokenAddress(mintPubkey, walletPubkey)
    const [userClaimPda] = findUserClaimPda(walletPubkey, program.programId)

    const tx = await program.methods
      .claimTokens()
      .accounts({
        user: walletPubkey,
        config: configPda,
        tokenMint: mintPubkey,
        userTokenAccount,
        userClaim: userClaimPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    return { success: true, txid: tx }
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : String(e) }
  }
}

export async function getClaimCooldown({ program, userPubkey }: { program: Program; userPubkey: PublicKey }) {
  const [userClaimPda] = findUserClaimPda(userPubkey, program.programId)
  try {
    // Anchor snake_case: user_claim_data
    const userClaim = await (program.account as any).user_claim_data.fetch(userClaimPda)
    return userClaim.lastClaimTs as number
  } catch {
    return 0
  }
}
