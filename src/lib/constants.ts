// src/lib/constants.ts

import { PublicKey } from '@solana/web3.js'

export const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID as string
export const MINT_PUBKEY = process.env.NEXT_PUBLIC_MINT_PUBKEY as string
export const ADMIN_PUBKEY = process.env.NEXT_PUBLIC_ADMIN_PUBKEY as string
export const SOLANA_RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT as string

export const PROGRAM_ID_PK = new PublicKey(PROGRAM_ID)
export const MINT_PUBKEY_PK = new PublicKey(MINT_PUBKEY)
export const ADMIN_PUBKEY_PK = new PublicKey(ADMIN_PUBKEY)
