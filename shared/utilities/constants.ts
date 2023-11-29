import { Address, Chain, createPublicClient, http, PublicClient } from 'viem'
import { baseGoerli } from 'viem/chains'

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
export const SUPPORTED_NETWORKS = [NETWORK['base-goerli']] as const
export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number]

/**
 * Pay Tokens
 */
export const PAY_TOKEN: Record<SupportedNetwork, { address: Address; decimals: number }> = {
  [NETWORK['base-goerli']]: {
    address: '0x5927b63E88764D6250b7801eBfDEb7B6c1ac35d0',
    decimals: 18
  }
}

/**
 * Viem Chains
 */
export const VIEM_CHAIN: Record<SupportedNetwork, Chain> = {
  [NETWORK['base-goerli']]: baseGoerli
}

/**
 * Viem Public Clients
 */
export const VIEM_PUBLIC_CLIENT: Record<SupportedNetwork, PublicClient> = {
  [NETWORK['base-goerli']]: createPublicClient({
    chain: VIEM_CHAIN[NETWORK['base-goerli']],
    transport: http(),
    batch: { multicall: true }
  }) as PublicClient
}
