// Скрипт для минтинга токенов на указанный адрес
// Запуск: npx ts-node scripts/mint_to.ts <MINT_ADDRESS> <DESTINATION_ADDRESS> <AMOUNT>

import { Keypair, Connection, PublicKey } from '@solana/web3.js'
import { mintTo } from '@solana/spl-token'
import fs from 'fs'
import os from 'os'

const [, , mintArg, destArg, amountArg] = process.argv
if (!mintArg || !destArg || !amountArg) {
  console.error('Usage: npx ts-node scripts/mint_to.ts <MINT_ADDRESS> <DESTINATION_ADDRESS> <AMOUNT>')
  process.exit(1)
}

const MINT = new PublicKey(mintArg)
const DEST = new PublicKey(destArg)
const AMOUNT = Number(amountArg)

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8899'
const connection = new Connection(RPC_URL, 'confirmed')
const secret = JSON.parse(fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, 'utf-8'))
const payer = Keypair.fromSecretKey(Uint8Array.from(secret))

async function main() {
  const sig = await mintTo(
    connection,
    payer,
    MINT,
    DEST,
    payer, // mint authority
    AMOUNT,
  )
  console.log('Minted', AMOUNT, 'tokens to', DEST.toBase58())
  console.log('TX Signature:', sig)
}

main()
