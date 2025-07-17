/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import os from 'os'
import path from 'path'
import dotenv from 'dotenv'
import pkg from '@coral-xyz/anchor'
const { AnchorProvider, Program } = pkg
import { PublicKey, Connection, Keypair } from '@solana/web3.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

// const PROGRAM_ID = new PublicKey('5gm1Nn7N3BDn2og4Umw5JePUhLUF2azKqwJduQx3tApg')
const CONFIG_PDA_STR = process.argv[2]

if (!CONFIG_PDA_STR) {
  console.error('Usage: anchor run show-config -- <CONFIG_PDA>')
  process.exit(1)
}

const CONFIG_PDA = new PublicKey(CONFIG_PDA_STR)
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8899'

const idl = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../target/idl/nft_gifter.json'), 'utf-8'))

async function main() {
  const connection = new Connection(RPC_URL, 'confirmed')
  // Используем реальный ключ из ~/.config/solana/id.json
  const keypairPath = `${os.homedir()}/.config/solana/id.json`
  const secret = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))
  const keypair = Keypair.fromSecretKey(Uint8Array.from(secret))
  const wallet = {
    publicKey: keypair.publicKey,
    signTransaction: async (tx: any) => tx,
    signAllTransactions: async (txs: any[]) => txs,
  }
  const provider = new AnchorProvider(connection, wallet as any, {})
  const program = new Program(idl, provider)

  const config = await (program.account as any).config.fetch(CONFIG_PDA)
  console.log('Config PDA:', CONFIG_PDA.toBase58())
  console.log('Config data:', config)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
