use anchor_lang::prelude::*;
use crate::state::config::Config;
use crate::error::NftGifterError;

#[derive(Accounts)]
pub struct WithdrawSol<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut, has_one = owner)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub destination: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn _withdraw_sol(ctx: Context<WithdrawSol>, mut amount: u64) -> Result<()> {
    let config = &mut ctx.accounts.config;
    let destination = &mut ctx.accounts.destination;
    let config_lamports = **config.to_account_info().lamports.borrow();
    let rent_exempt = Rent::get()?.minimum_balance(8 + 32 + 8 + 8 + 8 + 1);
    let withdrawable = config_lamports.saturating_sub(rent_exempt);
    if withdrawable == 0 {
        return err!(NftGifterError::InsufficientFunds);
    }
    if amount > withdrawable {
        amount = withdrawable;
    }
    require!(amount > 0, NftGifterError::InsufficientFunds);
    **config.to_account_info().lamports.borrow_mut() -= amount;
    **destination.to_account_info().lamports.borrow_mut() += amount;
    Ok(())
} 