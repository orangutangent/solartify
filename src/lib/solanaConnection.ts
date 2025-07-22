import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { AnchorProvider, Wallet as AnchorWallet } from '@coral-xyz/anchor'

export const SOLANA_CLUSTER = 'devnet'
export const SOLANA_RPC_ENDPOINT = clusterApiUrl(SOLANA_CLUSTER)
export const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed')

export function getProvider(wallet: AnchorWallet) {
  return new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' })
}

export async function getSolBalance(pubkey: PublicKey) {
  return connection.getBalance(pubkey, 'confirmed')
}

export async function getTokenBalance(owner: PublicKey, mint: PublicKey) {
  // Use getParsedTokenAccountsByOwner to get SPL token balance
  const accounts = await connection.getParsedTokenAccountsByOwner(owner, { mint })
  let amount = 0
  accounts.value.forEach((acc) => {
    amount += Number(acc.account.data.parsed.info.tokenAmount.amount)
  })
  return amount
}

export function findConfigPda(admin: PublicKey, programId: PublicKey) {
  return PublicKey.findProgramAddressSync([Buffer.from('config'), admin.toBuffer()], programId)
}

export function findUserClaimPda(user: PublicKey, programId: PublicKey) {
  return PublicKey.findProgramAddressSync([Buffer.from('claim'), user.toBuffer()], programId)
}
