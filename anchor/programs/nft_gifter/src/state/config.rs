use anchor_lang::prelude::*;

#[account]
pub struct Config {
    /// Владелец (админ)
    pub owner: Pubkey,
    /// Цена покупки токенов (в лампортах)
    pub purchase_price_lamports: u64,
    /// Цена за claim (в лампортах)
    pub claim_price_lamports: u64,
    /// Сколько токенов выдаётся за claim/purchase
    pub tokens_per_claim: u64,
    /// bump PDA
    pub bump: u8,
} 