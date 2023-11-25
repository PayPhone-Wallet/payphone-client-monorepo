import { PAY_TOKEN, SupportedNetwork } from '..'
import { formatUnits, parseUnits } from 'viem'

/**
 * Formats a raw pay token amount to account for decimals
 * @param chainId a chain ID
 * @param amount raw amount (example: `1_000_000n`)
 * @returns
 */
export const formatPayTokenAmount = (chainId: SupportedNetwork, amount: bigint | string) => {
  return parseFloat(formatUnits(BigInt(amount), PAY_TOKEN[chainId].decimals))
}

/**
 * Parses a pay token amount to its raw bigint form
 * @param chainId a chain ID
 * @param amount clean amount (example: `1.5`)
 * @returns
 */
export const parsePayTokenAmount = (chainId: SupportedNetwork, amount: number | string) => {
  return parseUnits(String(amount), PAY_TOKEN[chainId].decimals)
}
