use anchor_lang::prelude::*;

#[account]
pub struct Config {
    pub owner: Pubkey,
    pub purchase_price_lamports: u64,
    pub claim_price_lamports: u64,
    pub tokens_per_claim: u64,
    pub bump: u8,
} 