use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Mint, MintTo, TokenAccount, TokenInterface};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::config::Config;
use crate::error::NftGifterError;

#[derive(Accounts)]
pub struct PurchaseTokens<'info> {
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
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn _purchase_tokens(ctx: Context<PurchaseTokens>, amount: u64) -> Result<()> {
    let config = &ctx.accounts.config;
    let price_per_token = config.purchase_price_lamports;
    let decimals = ctx.accounts.token_mint.decimals;
    let amount_on_chain = amount.checked_mul(10u64.pow(decimals as u32)).ok_or(NftGifterError::MathOverflow)?;
    let total_price = price_per_token.checked_mul(amount).ok_or(NftGifterError::MathOverflow)?;
    require!(ctx.accounts.user.lamports() >= total_price, NftGifterError::InsufficientFunds);

    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &ctx.accounts.user.key(),
        &ctx.accounts.config.key(),
        total_price,
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
    token_interface::mint_to(cpi_ctx, amount_on_chain)?;
    Ok(())
} 