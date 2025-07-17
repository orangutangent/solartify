use anchor_lang::prelude::*;

pub mod error;
pub mod state;
pub mod instructions;

use instructions::{
    init_config::*,
    update_config::*,
    withdraw_sol::*,
    claim::*,
    purchase::*,
    mint::*
};

declare_id!("5gm1Nn7N3BDn2og4Umw5JePUhLUF2azKqwJduQx3tApg");

#[program]
pub mod nft_gifter {
    use super::*;

    pub fn init_config(
        ctx: Context<InitConfig>,
        purchase_price_lamports: u64,
        claim_price_lamports: u64,
        tokens_per_claim: u64,
        bump: u8,
    ) -> Result<()> {
        _init_config(ctx, purchase_price_lamports, claim_price_lamports, tokens_per_claim, bump)
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        purchase_price_lamports: u64,
        claim_price_lamports: u64,
        tokens_per_claim: u64,
    ) -> Result<()> {
        _update_config(ctx, purchase_price_lamports, claim_price_lamports, tokens_per_claim)
    }

    pub fn withdraw_sol(ctx: Context<WithdrawSol>, amount: u64) -> Result<()> {
        _withdraw_sol(ctx, amount)
    }

    pub fn purchase_tokens(ctx: Context<PurchaseTokens>) -> Result<()> {
        _purchase_tokens(ctx)
    }

    pub fn claim_tokens(ctx: Context<ClaimTokens>) -> Result<()> {
        let clock = anchor_lang::prelude::Clock::get()?;
        _claim_tokens(ctx, clock)
    }

    pub fn mint_nft(ctx: Context<MintNft>) -> Result<()> {
        _mint_nft(ctx)
    }
}
