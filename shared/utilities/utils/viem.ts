import { SupportedNetwork, VIEM_PUBLIC_CLIENT } from '..'
import { PublicClient } from 'viem'

/**
 * Returns a public client for the given chain ID
 * @param chainId a chain ID
 * @returns
 */
export const getPublicClient = (chainId: SupportedNetwork): PublicClient => {
  const publicClient = VIEM_PUBLIC_CLIENT[chainId]

  if (!publicClient) throw new Error(`No public client set for chain ID ${chainId}`)

  return publicClient
}
