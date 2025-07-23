// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, address, getBase58Decoder, SolanaClient } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Nftgifter, NFTGIFTER_DISCRIMINATOR, NFTGIFTER_PROGRAM_ADDRESS, getNftgifterDecoder } from './client/js'
import NftgifterIDL from '../../src/lib/idl.json'

export type NftgifterAccount = Account<Nftgifter, string>

// Re-export the generated IDL and type
export { NftgifterIDL }

// This is a helper function to get the program ID for the Nftgifter program depending on the cluster.
export function getNftgifterProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case 'solana:devnet':
    case 'solana:testnet':
      // This is the program ID for the Nftgifter program on devnet and testnet.
      return address('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'solana:mainnet':
    default:
      return NFTGIFTER_PROGRAM_ADDRESS
  }
}

export * from './client/js'

export function getNftgifterProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getNftgifterDecoder(),
    filter: getBase58Decoder().decode(NFTGIFTER_DISCRIMINATOR),
    programAddress: NFTGIFTER_PROGRAM_ADDRESS,
  })
}
