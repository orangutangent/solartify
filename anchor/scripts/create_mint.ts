// Скрипт для создания нового токен-минта
// Запуск: npx ts-node scripts/create_mint.ts

import { Keypair, Connection } from '@solana/web3.js'
import { createMint } from '@solana/spl-token'
import fs from 'fs'
import os from 'os'

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8899'
const connection = new Connection(RPC_URL, 'confirmed')
const secret = JSON.parse(fs.readFileSync(`${os.homedir()}/.config/solana/devnet.json`, 'utf-8'))
const payer = Keypair.fromSecretKey(Uint8Array.from(secret))

async function main() {
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey, // mint authority
    null, // freeze authority
    9, // decimals
  )
  console.log('Mint address:', mint.toBase58())
}

main()
