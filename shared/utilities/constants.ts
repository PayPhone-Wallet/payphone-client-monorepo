import { Address, createPublicClient, http, PublicClient } from 'viem'
import { base } from 'viem/chains'

/**
 * Network IDs
 */
export enum NETWORK {
  'mainnet' = 1,
  'goerli' = 5,
  'sepolia' = 11155111,
  'optimism' = 10,
  'optimism-goerli' = 420,
  'optimism-sepolia' = 11155420,
  'arbitrum' = 42161,
  'arbitrum-goerli' = 421613,
  'arbitrum-sepolia' = 421614,
  'base' = 8453,
  'base-goerli' = 84531,
  'base-sepolia' = 84532
}

/**
 * Supported Networks
 */
export const SUPPORTED_NETWORKS = [NETWORK.base] as const
export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number]

/**
 * Pay Tokens
 */
export const PAY_TOKEN: Record<SupportedNetwork, { address: Address; decimals: number }> = {
  [NETWORK.base]: {
    address: '0x0a1d576f3eFeF75b330424287a95A366e8281D54',
    decimals: 6
  }
}

/**
 * Viem Public Clients
 */
export const VIEM_PUBLIC_CLIENT: Record<SupportedNetwork, PublicClient> = {
  [NETWORK.base]: createPublicClient({
    chain: base,
    transport: http(),
    batch: { multicall: true }
  }) as PublicClient
}
