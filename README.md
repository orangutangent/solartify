# 🎨 SolArtify

**SolArtify** is a Solana dApp for AI NFT generation, minting, and sharing. Users can claim or buy tokens, then use them to mint unique NFTs — and soon, generate art with AI!

Built with:

- 🦀 **Anchor** (Rust smart contracts for Solana)
- 🎨 **Metaplex Token Metadata** for real NFTs
- ⚡ **Next.js frontend** (via `create-solana-dapp`)

---

## ✨ Features

- **Custom Token System**
  - Users can _claim_ free tokens daily (once per 24h) for a low SOL fee
  - Or _buy_ tokens for a higher SOL price
  - Tokens are required to mint NFTs

- **NFT Minting**
  - Burn 1 token to mint 1 NFT
  - NFT includes URI metadata on-chain via Metaplex standard

- **Admin Controls**
  - Owner can set/change claim price, purchase price, tokens per claim
  - Owner can withdraw accumulated SOL from the vault

- **Anti-abuse Measures**
  - 24h cooldown for claims per wallet
  - Claim requires small SOL fee
  - Optionally: prevent transfers of tokens to stop pooling

---

## 🗂 Project Structure

nft-gifter/
├── Anchor.toml
├── programs/
│ └── nft_gifter/
│ ├── src/
│ │ ├── lib.rs
│ │ ├── state/
│ │ │ ├── offer.rs
│ │ │ └── user_claim.rs
│ │ └── instructions/
│ │ ├── claim_tokens.rs
│ │ ├── buy_tokens.rs
│ │ ├── mint_nft.rs
│ │ └── withdraw_vault.rs
└── tests/
└── nftgifter.test.ts

yaml
Копировать
Редактировать

---

## 🧠 Smart Contract Overview

### State Accounts

- **OfferConfig (PDA)**
  - Owner
  - Token mint address
  - Purchase price (SOL)
  - Claim price (SOL)
  - Tokens per claim

- **Vault (PDA)**
  - Receives SOL from purchases & claims

- **UserClaimData (PDA)**
  - User address
  - last_claim_ts (for cooldown)

---

### Instructions

- ✅ `init_config`
  - Initialize offer settings

- ✅ `claim_tokens`
  - User pays small SOL fee
  - Can only claim once per 24h
  - Mints tokens to user

- ✅ `buy_tokens`
  - User pays SOL
  - Receives tokens immediately

- ✅ `mint_nft`
  - Burns user's tokens
  - Mints real NFT with URI

- ✅ `withdraw_vault`
  - Admin can withdraw accumulated SOL

---

## ⚙️ Anti-abuse Design

- 24-hour claim cooldown enforced on-chain
- Small SOL fee for claim reduces Sybil attacks
- Optional: restrict token transfers

---

## 💻 Frontend

Planned Next.js frontend (created with [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp)) with:

- Connect wallet
- View balance
- Claim daily tokens
- Buy tokens with SOL
- Mint NFTs (provide URI)
- View minted NFTs

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies

```bash
pnpm install
2️⃣ Start Local Validator
bash
Копировать
Редактировать
anchor localnet
3️⃣ Build & Deploy
bash
Копировать
Редактировать
anchor build
anchor deploy
4️⃣ Run Tests
bash
Копировать
Редактировать
anchor test
🧪 Example Test Accounts
OfferConfig PDA: stores prices and mint

Vault PDA: holds SOL payments

UserClaimData PDA: tracks last claim

SPL Token Mint: the in-app currency

🗺 Roadmap
✅ Initial Anchor program

✅ Claim / Buy tokens

✅ Mint NFT with URI

⏳ Admin UI

⏳ Mainnet deployment

⏳ Enhanced anti-bot systems

📄 License
MIT

🙌 Contributions
PRs, issues, and discussions welcome! Let's make NFT Gifter the best example of a Solana pay-to-mint NFT system!
```
