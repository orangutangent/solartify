use anchor_lang::prelude::*;
use anchor_spl::{
    token_interface::{self, Mint, Burn, MintTo, TokenAccount, TokenInterface},
    associated_token::AssociatedToken,
    metadata::{Metadata, create_metadata_accounts_v3, create_master_edition_v3, CreateMetadataAccountsV3, CreateMasterEditionV3},
};
use mpl_token_metadata::types::{DataV2, Creator};
use crate::state::config::Config;

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        seeds = [b"config", config.owner.key().as_ref()],
        bump = config.bump,
    )]
    pub config: Account<'info, Config>,

    // --- Utility Token Accounts (for burning) ---
    #[account(mut)]
    pub utility_token_mint: InterfaceAccount<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = utility_token_mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_utility_token_account: InterfaceAccount<'info, TokenAccount>,

    // --- NFT Accounts (to be created and minted) ---
    #[account(
        init,
        payer = user,
        mint::decimals = 0,
        mint::authority = config, // PDA of config is the mint authority
        mint::freeze_authority = config,
    )]
    pub nft_mint: InterfaceAccount<'info, Mint>,
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = nft_mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_nft_account: InterfaceAccount<'info, TokenAccount>,

    // --- Metaplex Accounts ---
    #[account(
        mut,
        seeds = [
            b"metadata".as_ref(),
            metadata_program.key().as_ref(),
            nft_mint.key().as_ref(),
        ],
        bump,
        seeds::program = metadata_program.key()
    )]
    /// CHECK: Metaplex will validate this
    pub nft_metadata: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [
            b"metadata".as_ref(),
            metadata_program.key().as_ref(),
            nft_mint.key().as_ref(),
            b"edition".as_ref(),
        ],
        bump,
        seeds::program = metadata_program.key()
    )]
    /// CHECK: Metaplex will validate this
    pub master_edition_account: UncheckedAccount<'info>,

    // --- Programs ---
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub metadata_program: Program<'info, Metadata>,
}

pub fn _mint_nft(ctx: Context<MintNft>, name: String, symbol: String, uri: String) -> Result<()> {
    // Get config PDA signer seeds
    let config_owner = ctx.accounts.config.owner.key();
    let config_bump = ctx.accounts.config.bump;
    let config_seeds = &[b"config", config_owner.as_ref(), &[config_bump]];
    let signer_seeds = &[&config_seeds[..]];

    // 1. Burn utility token
    let burn_amount = 10u64.pow(ctx.accounts.utility_token_mint.decimals as u32); // 1 token unit based on decimals
    let burn_accounts = Burn {
        mint: ctx.accounts.utility_token_mint.to_account_info(),
        from: ctx.accounts.user_utility_token_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        burn_accounts,
    );
    token_interface::burn(cpi_ctx, burn_amount)?;

    // 2. Mint 1 NFT to user's ATA
    let mint_to_accounts = MintTo {
        mint: ctx.accounts.nft_mint.to_account_info(),
        to: ctx.accounts.user_nft_account.to_account_info(),
        authority: ctx.accounts.config.to_account_info(), // Authority is config PDA
    };
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        mint_to_accounts,
        signer_seeds,
    );
    token_interface::mint_to(cpi_ctx, 1)?;

    // 3. Create Metadata Account
    let creators = vec![Creator {
        address: config_owner,
        verified: false,
        share: 100,
    }];
    let data_v2 = DataV2 {
        name,
        symbol,
        uri,
        seller_fee_basis_points: 550, // 5.5%
        creators: Some(creators),
        collection: None,
        uses: None,
    };

    let create_metadata_accounts_v3_cpi_accounts = CreateMetadataAccountsV3 {
        payer: ctx.accounts.user.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
        metadata: ctx.accounts.nft_metadata.to_account_info(),
        mint_authority: ctx.accounts.config.to_account_info(), // Authority is config PDA
        update_authority: ctx.accounts.config.to_account_info(), // Authority is config PDA
        system_program: ctx.accounts.system_program.to_account_info(),
        rent: ctx.accounts.rent.to_account_info(),
    };
    let create_metadata_accounts_v3_cpi_program = ctx.accounts.metadata_program.to_account_info();
    let create_metadata_accounts_v3_cpi_context = CpiContext::new_with_signer(
        create_metadata_accounts_v3_cpi_program,
        create_metadata_accounts_v3_cpi_accounts,
        signer_seeds,
    );
    create_metadata_accounts_v3(create_metadata_accounts_v3_cpi_context, data_v2, true, true, None)?;

    // 4. Create Master Edition Account
    let create_master_edition_v3_cpi_accounts = CreateMasterEditionV3 {
        edition: ctx.accounts.master_edition_account.to_account_info(),
        payer: ctx.accounts.user.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
        metadata: ctx.accounts.nft_metadata.to_account_info(),
        mint_authority: ctx.accounts.config.to_account_info(), // Authority is config PDA
        update_authority: ctx.accounts.config.to_account_info(), // Authority is config PDA
        system_program: ctx.accounts.system_program.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        rent: ctx.accounts.rent.to_account_info(),
    };
    let create_master_edition_v3_cpi_program = ctx.accounts.metadata_program.to_account_info();
    let create_master_edition_v3_cpi_context = CpiContext::new_with_signer(
        create_master_edition_v3_cpi_program,
        create_master_edition_v3_cpi_accounts,
        signer_seeds,
    );
    create_master_edition_v3(create_master_edition_v3_cpi_context, Some(1))?;

    Ok(())
}