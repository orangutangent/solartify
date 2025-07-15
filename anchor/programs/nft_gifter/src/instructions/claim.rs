use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Mint, MintTo, TokenAccount, TokenInterface};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::config::Config;
use crate::state::user_claim::UserClaimData;
use crate::error::NftGifterError;

#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub token_mint: InterfaceAccount<'info, Mint>,
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token_mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + std::mem::size_of::<UserClaimData>(),
        seeds = [b"claim", user.key().as_ref()],
        bump
    )]
    pub user_claim: Account<'info, UserClaimData>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn _claim_tokens(ctx: Context<ClaimTokens>, clock: Clock) -> Result<()> {
    let config = &ctx.accounts.config;
    let price = config.claim_price_lamports;
    let amount = config.tokens_per_claim;
    let user_claim = &mut ctx.accounts.user_claim;
    let now = clock.unix_timestamp;
    if user_claim.last_claim_ts > 0 {
        require!(now - user_claim.last_claim_ts >= 86400, NftGifterError::ClaimTooSoon);
    }
    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &ctx.accounts.user.key(),
        &ctx.accounts.config.key(),
        price,
    );
    anchor_lang::solana_program::program::invoke(
        &ix,
        &[
            ctx.accounts.user.to_account_info(),
            ctx.accounts.config.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;
    let cpi_accounts = MintTo {
        mint: ctx.accounts.token_mint.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.config.to_account_info(),
    };
    let seeds = &[b"config", ctx.accounts.config.owner.as_ref(), &[ctx.accounts.config.bump]];
    let signer = &[&seeds[..]];
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
        signer,
    );
    token_interface::mint_to(cpi_ctx, amount)?;
    user_claim.last_claim_ts = now;
    user_claim.bump = ctx.bumps.user_claim;
    Ok(())
} 