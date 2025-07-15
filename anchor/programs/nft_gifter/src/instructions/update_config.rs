use anchor_lang::prelude::*;
use crate::state::config::Config;

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    pub owner: Signer<'info>,
    #[account(mut, has_one = owner)]
    pub config: Account<'info, Config>,
}

pub fn _update_config(
    ctx: Context<UpdateConfig>,
    purchase_price_lamports: u64,
    claim_price_lamports: u64,
    tokens_per_claim: u64,
) -> Result<()> {
    let config = &mut ctx.accounts.config;
    config.purchase_price_lamports = purchase_price_lamports;
    config.claim_price_lamports = claim_price_lamports;
    config.tokens_per_claim = tokens_per_claim;
    Ok(())
} 