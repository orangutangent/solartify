/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  assertAccountExists,
  assertAccountsExist,
  combineCodec,
  decodeAccount,
  fetchEncodedAccount,
  fetchEncodedAccounts,
  fixDecoderSize,
  fixEncoderSize,
  getAddressDecoder,
  getAddressEncoder,
  getBytesDecoder,
  getBytesEncoder,
  getStructDecoder,
  getStructEncoder,
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
  transformEncoder,
  type Account,
  type Address,
  type Codec,
  type Decoder,
  type EncodedAccount,
  type Encoder,
  type FetchAccountConfig,
  type FetchAccountsConfig,
  type MaybeAccount,
  type MaybeEncodedAccount,
  type ReadonlyUint8Array,
} from '@solana/kit';

export const CONFIG_DISCRIMINATOR = new Uint8Array([
  155, 12, 170, 224, 30, 250, 204, 130,
]);

export function getConfigDiscriminatorBytes() {
  return fixEncoderSize(getBytesEncoder(), 8).encode(CONFIG_DISCRIMINATOR);
}

export type Config = {
  discriminator: ReadonlyUint8Array;
  /** Владелец (админ) */
  owner: Address;
  /** Цена покупки токенов (в лампортах) */
  purchasePriceLamports: bigint;
  /** Цена за claim (в лампортах) */
  claimPriceLamports: bigint;
  /** Сколько токенов выдаётся за claim/purchase */
  tokensPerClaim: bigint;
  /** bump PDA */
  bump: number;
};

export type ConfigArgs = {
  /** Владелец (админ) */
  owner: Address;
  /** Цена покупки токенов (в лампортах) */
  purchasePriceLamports: number | bigint;
  /** Цена за claim (в лампортах) */
  claimPriceLamports: number | bigint;
  /** Сколько токенов выдаётся за claim/purchase */
  tokensPerClaim: number | bigint;
  /** bump PDA */
  bump: number;
};

export function getConfigEncoder(): Encoder<ConfigArgs> {
  return transformEncoder(
    getStructEncoder([
      ['discriminator', fixEncoderSize(getBytesEncoder(), 8)],
      ['owner', getAddressEncoder()],
      ['purchasePriceLamports', getU64Encoder()],
      ['claimPriceLamports', getU64Encoder()],
      ['tokensPerClaim', getU64Encoder()],
      ['bump', getU8Encoder()],
    ]),
    (value) => ({ ...value, discriminator: CONFIG_DISCRIMINATOR })
  );
}

export function getConfigDecoder(): Decoder<Config> {
  return getStructDecoder([
    ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
    ['owner', getAddressDecoder()],
    ['purchasePriceLamports', getU64Decoder()],
    ['claimPriceLamports', getU64Decoder()],
    ['tokensPerClaim', getU64Decoder()],
    ['bump', getU8Decoder()],
  ]);
}

export function getConfigCodec(): Codec<ConfigArgs, Config> {
  return combineCodec(getConfigEncoder(), getConfigDecoder());
}

export function decodeConfig<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress>
): Account<Config, TAddress>;
export function decodeConfig<TAddress extends string = string>(
  encodedAccount: MaybeEncodedAccount<TAddress>
): MaybeAccount<Config, TAddress>;
export function decodeConfig<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress> | MaybeEncodedAccount<TAddress>
): Account<Config, TAddress> | MaybeAccount<Config, TAddress> {
  return decodeAccount(
    encodedAccount as MaybeEncodedAccount<TAddress>,
    getConfigDecoder()
  );
}

export async function fetchConfig<TAddress extends string = string>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig
): Promise<Account<Config, TAddress>> {
  const maybeAccount = await fetchMaybeConfig(rpc, address, config);
  assertAccountExists(maybeAccount);
  return maybeAccount;
}

export async function fetchMaybeConfig<TAddress extends string = string>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig
): Promise<MaybeAccount<Config, TAddress>> {
  const maybeAccount = await fetchEncodedAccount(rpc, address, config);
  return decodeConfig(maybeAccount);
}

export async function fetchAllConfig(
  rpc: Parameters<typeof fetchEncodedAccounts>[0],
  addresses: Array<Address>,
  config?: FetchAccountsConfig
): Promise<Account<Config>[]> {
  const maybeAccounts = await fetchAllMaybeConfig(rpc, addresses, config);
  assertAccountsExist(maybeAccounts);
  return maybeAccounts;
}

export async function fetchAllMaybeConfig(
  rpc: Parameters<typeof fetchEncodedAccounts>[0],
  addresses: Array<Address>,
  config?: FetchAccountsConfig
): Promise<MaybeAccount<Config>[]> {
  const maybeAccounts = await fetchEncodedAccounts(rpc, addresses, config);
  return maybeAccounts.map((maybeAccount) => decodeConfig(maybeAccount));
}
