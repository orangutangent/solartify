/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import os from 'os'
import path from 'path'
import dotenv from 'dotenv'
import BN from 'bn.js'
import pkg from '@coral-xyz/anchor'
const { AnchorProvider, Program } = pkg
import { Keypair, PublicKey, Connection, SystemProgram } from '@solana/web3.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const PROGRAM_ID = new PublicKey('5PvnABfeQoqHGGGQ87BmjPCJ41wBuiSu3L3h4RbH4Zj1')
const ADMIN_KEYPAIR_PATH = process.env.ADMIN_KEYPAIR_PATH || `${os.homedir()}/.config/solana/devnet.json`
const RPC_URL = process.env.RPC_URL || 'https://api.devnet.solana.com'
// const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8899'

const idl = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../target/idl/nft_gifter.json'), 'utf-8'))

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 3) {
    console.log('Usage: anchor run init-config -- <purchase_price_lamports> <claim_price_lamports> <tokens_per_claim>')
    process.exit(1)
  }
  const [purchasePrice, claimPrice, tokensPerClaim] = args.map((v) => new BN(v))

  const secret = JSON.parse(fs.readFileSync(ADMIN_KEYPAIR_PATH, 'utf-8'))
  const admin = Keypair.fromSecretKey(Uint8Array.from(secret))

  const connection = new Connection(RPC_URL, 'confirmed')
  const provider = new AnchorProvider(
    connection,
    {
      publicKey: admin.publicKey,
      signTransaction: async (tx: any) => {
        tx.partialSign(admin)
        return tx
      },
      signAllTransactions: async (txs: any[]) => {
        txs.forEach((tx: any) => tx.partialSign(admin))
        return txs
      },
    } as any,
    {},
  )

  const program = new Program(idl, provider)

  const [configPda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from('config'), admin.publicKey.toBuffer()],
    PROGRAM_ID,
  )

  const tx = await program.methods
    .initConfig(purchasePrice, claimPrice, tokensPerClaim, bump)
    .accounts({
      owner: admin.publicKey,
      config: configPda,
      systemProgram: SystemProgram.programId,
    })
    .signers([admin])
    .rpc()

  console.log('Config PDA:', configPda.toBase58())
  console.log('TX Signature:', tx)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
