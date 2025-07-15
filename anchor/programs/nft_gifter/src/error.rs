use anchor_lang::prelude::*;

/// Custom errors for the NFT Gifter program
#[error_code]
pub enum NftGifterError {
    /// Only the owner can perform this action
    #[msg("Only the owner can perform this action")] 
    NotOwner,
    /// Claim is not allowed yet (24h not passed)
    #[msg("Claim not allowed yet. Please wait 24 hours since last claim")] 
    ClaimTooSoon,
    /// Math overflow
    #[msg("Math overflow")] 
    MathOverflow,
    /// Insufficient funds sent for this operation
    #[msg("Insufficient funds sent")] 
    InsufficientFunds,
    /// Invalid or uninitialized config
    #[msg("Invalid or uninitialized config")] 
    InvalidConfig,
    /// Error minting or burning tokens
    #[msg("Token mint/burn error")] 
    TokenMintError,
    /// Error creating NFT metadata
    #[msg("Metadata creation error")] 
    MetadataError,
    /// Error withdrawing SOL
    #[msg("Withdraw error")] 
    WithdrawError,
    /// User already claimed in the last 24h
    #[msg("Already claimed in the last 24h")] 
    AlreadyClaimed,
    /// Unauthorized
    #[msg("Unauthorized")] 
    Unauthorized,
    /// Vault account not found
    #[msg("Vault account not found")] 
    VaultNotFound,
    /// Token transfer error
    #[msg("Token transfer error")] 
    TokenTransferError,
} 