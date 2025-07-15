use anchor_lang::prelude::*;

#[account]
pub struct UserClaimData {
    /// Последний timestamp claim'а
    pub last_claim_ts: i64,
    /// bump PDA
    pub bump: u8,
} 