use anchor_lang::prelude::*;
use crate::state::config::Config;

#[derive(Accounts)]
pub struct InitConfig<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + std::mem::size_of::<Config>(),
        seeds = [b"config", owner.key().as_ref()],
        bump
    )]
    pub config: Account<'info, Config>,

    pub system_program: Program<'info, System>,
}

pub fn _init_config(
    ctx: Context<InitConfig>,
    purchase_price_lamports: u64,
    claim_price_lamports: u64,
    tokens_per_claim: u64,
    bump: u8,
) -> Result<()> {
    let config = &mut ctx.accounts.config;
    config.owner = ctx.accounts.owner.key();
    config.purchase_price_lamports = purchase_price_lamports;
    config.claim_price_lamports = claim_price_lamports;
    config.tokens_per_claim = tokens_per_claim;
    config.bump = bump;
    Ok(())
} 