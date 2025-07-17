export type OfferConfig = {
  owner: string
  purchasePriceLamports: number
  claimPriceLamports: number
  tokensPerClaim: number
  bump: number
}

export type UserClaimData = {
  lastClaimTs: number
  bump: number
}

export type ClaimResult = {
  success: boolean
  txid?: string
  error?: string
}

export type BuyResult = {
  success: boolean
  txid?: string
  error?: string
}

export type MintResult = {
  success: boolean
  txid?: string
  error?: string
}

export type WithdrawResult = {
  success: boolean
  txid?: string
  error?: string
}

export type UpdateConfigResult = {
  success: boolean
  txid?: string
  error?: string
}
