// Скрипт для передачи mint authority на PDA
// Запуск: npx ts-node scripts/set_mint_authority.ts <MINT_ADDRESS> <NEW_AUTHORITY_PUBKEY>

import { Keypair, Connection, PublicKey } from '@solana/web3.js'
import { setAuthority, AuthorityType } from '@solana/spl-token'
import fs from 'fs'
import os from 'os'

const [, , mintArg, newAuthArg] = process.argv
if (!mintArg || !newAuthArg) {
  console.error('Usage: npx ts-node scripts/set_mint_authority.ts <MINT_ADDRESS> <NEW_AUTHORITY_PUBKEY>')
  process.exit(1)
}

const MINT = new PublicKey(mintArg)
const NEW_AUTH = new PublicKey(newAuthArg)

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8899'
const connection = new Connection(RPC_URL, 'confirmed')
const secret = JSON.parse(fs.readFileSync(`${os.homedir()}/.config/solana/devnet.json`, 'utf-8'))
const payer = Keypair.fromSecretKey(Uint8Array.from(secret))

async function main() {
  const sig = await setAuthority(
    connection,
    payer,
    MINT,
    payer.publicKey, // current authority
    AuthorityType.MintTokens,
    NEW_AUTH,
  )
  console.log('Mint authority for', MINT.toBase58(), 'is now', NEW_AUTH.toBase58())
  console.log('TX Signature:', sig)
}

main()
