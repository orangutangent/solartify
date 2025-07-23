/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/nft_gifter.json`.
 */
export type NftGifter = {
  address: '5PvnABfeQoqHGGGQ87BmjPCJ41wBuiSu3L3h4RbH4Zj1'
  metadata: {
    name: 'nftGifter'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'claimTokens'
      discriminator: [108, 216, 210, 231, 0, 212, 42, 64]
      accounts: [
        {
          name: 'user'
          writable: true
          signer: true
        },
        {
          name: 'config'
          writable: true
        },
        {
          name: 'tokenMint'
          writable: true
        },
        {
          name: 'userTokenAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'user'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'tokenMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'userClaim'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [99, 108, 97, 105, 109]
              },
              {
                kind: 'account'
                path: 'user'
              },
            ]
          }
        },
        {
          name: 'tokenProgram'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'initConfig'
      discriminator: [23, 235, 115, 232, 168, 96, 1, 231]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
        },
        {
          name: 'config'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'owner'
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'purchasePriceLamports'
          type: 'u64'
        },
        {
          name: 'claimPriceLamports'
          type: 'u64'
        },
        {
          name: 'tokensPerClaim'
          type: 'u64'
        },
        {
          name: 'bump'
          type: 'u8'
        },
      ]
    },
    {
      name: 'mintNft'
      discriminator: [211, 57, 6, 167, 15, 219, 35, 251]
      accounts: [
        {
          name: 'user'
          writable: true
          signer: true
        },
        {
          name: 'config'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'config.owner'
                account: 'config'
              },
            ]
          }
        },
        {
          name: 'utilityTokenMint'
          writable: true
        },
        {
          name: 'userUtilityTokenAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'user'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'utilityTokenMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'nftMint'
          writable: true
          signer: true
        },
        {
          name: 'userNftAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'user'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'nftMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'nftMetadata'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 101, 116, 97, 100, 97, 116, 97]
              },
              {
                kind: 'account'
                path: 'metadataProgram'
              },
              {
                kind: 'account'
                path: 'nftMint'
              },
            ]
            program: {
              kind: 'account'
              path: 'metadataProgram'
            }
          }
        },
        {
          name: 'masterEditionAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 101, 116, 97, 100, 97, 116, 97]
              },
              {
                kind: 'account'
                path: 'metadataProgram'
              },
              {
                kind: 'account'
                path: 'nftMint'
              },
              {
                kind: 'const'
                value: [101, 100, 105, 116, 105, 111, 110]
              },
            ]
            program: {
              kind: 'account'
              path: 'metadataProgram'
            }
          }
        },
        {
          name: 'tokenProgram'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'rent'
          address: 'SysvarRent111111111111111111111111111111111'
        },
        {
          name: 'metadataProgram'
          address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
        },
      ]
      args: [
        {
          name: 'name'
          type: 'string'
        },
        {
          name: 'symbol'
          type: 'string'
        },
        {
          name: 'uri'
          type: 'string'
        },
      ]
    },
    {
      name: 'purchaseTokens'
      discriminator: [142, 1, 16, 160, 115, 120, 55, 254]
      accounts: [
        {
          name: 'user'
          writable: true
          signer: true
        },
        {
          name: 'config'
          writable: true
        },
        {
          name: 'tokenMint'
          writable: true
        },
        {
          name: 'userTokenAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'user'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'tokenMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'updateConfig'
      discriminator: [29, 158, 252, 191, 10, 83, 219, 99]
      accounts: [
        {
          name: 'owner'
          signer: true
          relations: ['config']
        },
        {
          name: 'config'
          writable: true
        },
      ]
      args: [
        {
          name: 'purchasePriceLamports'
          type: 'u64'
        },
        {
          name: 'claimPriceLamports'
          type: 'u64'
        },
        {
          name: 'tokensPerClaim'
          type: 'u64'
        },
      ]
    },
    {
      name: 'withdrawSol'
      discriminator: [145, 131, 74, 136, 65, 137, 42, 38]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
          relations: ['config']
        },
        {
          name: 'config'
          writable: true
        },
        {
          name: 'destination'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'config'
      discriminator: [155, 12, 170, 224, 30, 250, 204, 130]
    },
    {
      name: 'userClaimData'
      discriminator: [214, 233, 149, 224, 175, 229, 124, 134]
    },
  ]
  errors: [
    {
      code: 6000
      name: 'notOwner'
      msg: 'Only the owner can perform this action'
    },
    {
      code: 6001
      name: 'claimTooSoon'
      msg: 'Claim not allowed yet. Please wait 24 hours since last claim'
    },
    {
      code: 6002
      name: 'mathOverflow'
      msg: 'Math overflow'
    },
    {
      code: 6003
      name: 'insufficientFunds'
      msg: 'Insufficient funds sent'
    },
    {
      code: 6004
      name: 'invalidConfig'
      msg: 'Invalid or uninitialized config'
    },
    {
      code: 6005
      name: 'tokenMintError'
      msg: 'Token mint/burn error'
    },
    {
      code: 6006
      name: 'metadataError'
      msg: 'Metadata creation error'
    },
    {
      code: 6007
      name: 'withdrawError'
      msg: 'Withdraw error'
    },
    {
      code: 6008
      name: 'alreadyClaimed'
      msg: 'Already claimed in the last 24h'
    },
    {
      code: 6009
      name: 'unauthorized'
      msg: 'unauthorized'
    },
    {
      code: 6010
      name: 'vaultNotFound'
      msg: 'Vault account not found'
    },
    {
      code: 6011
      name: 'tokenTransferError'
      msg: 'Token transfer error'
    },
  ]
  types: [
    {
      name: 'config'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'owner'
            docs: ['Владелец (админ)']
            type: 'pubkey'
          },
          {
            name: 'purchasePriceLamports'
            docs: ['Цена покупки токенов (в лампортах)']
            type: 'u64'
          },
          {
            name: 'claimPriceLamports'
            docs: ['Цена за claim (в лампортах)']
            type: 'u64'
          },
          {
            name: 'tokensPerClaim'
            docs: ['Сколько токенов выдаётся за claim/purchase']
            type: 'u64'
          },
          {
            name: 'bump'
            docs: ['bump PDA']
            type: 'u8'
          },
        ]
      }
    },
    {
      name: 'userClaimData'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'lastClaimTs'
            docs: ["Последний timestamp claim'а"]
            type: 'i64'
          },
          {
            name: 'bump'
            docs: ['bump PDA']
            type: 'u8'
          },
        ]
      }
    },
  ]
}
