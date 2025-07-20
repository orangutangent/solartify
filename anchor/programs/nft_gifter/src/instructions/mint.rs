use anchor_lang::prelude::*;
use anchor_spl::{
    token_interface::{self, Mint, Burn, MintTo, TokenAccount, TokenInterface},
    associated_token::AssociatedToken,
};
use crate::state::config::Config;

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub token_mint: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub nft_mint: InterfaceAccount<'info, Mint>,
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = nft_mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_nft_account: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn _mint_nft(ctx: Context<MintNft>) -> Result<()> {
    let decimals = ctx.accounts.token_mint.decimals;
    let burn_amount = 10u64.pow(decimals as u32); // 1 token with  decimals
    let burn_accounts = Burn {
        mint: ctx.accounts.token_mint.to_account_info(),
        from: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        burn_accounts,
    );
    token_interface::burn(cpi_ctx, burn_amount)?;
    let mint_to_accounts = MintTo {
        mint: ctx.accounts.nft_mint.to_account_info(),
        to: ctx.accounts.user_nft_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        mint_to_accounts,
    );
    token_interface::mint_to(cpi_ctx, 1)?;
    Ok(())
} 