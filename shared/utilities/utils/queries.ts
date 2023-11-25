import { erc20ABI, getPublicClient, PAY_TOKEN, SupportedNetwork } from '..'
import { Address } from 'viem'

/**
 * Returns the pay token balance of a given wallet address
 * @param chainId a chain ID
 * @param walletAddress the wallet address to query a balance for
 * @returns
 */
export const getWalletPayTokenBalance = async (
  chainId: SupportedNetwork,
  walletAddress: Address
) => {
  try {
    const publicClient = getPublicClient(chainId)

    const balance = await publicClient.readContract({
      abi: erc20ABI,
      address: PAY_TOKEN[chainId].address,
      functionName: 'balanceOf',
      args: [walletAddress]
    })

    return balance
  } catch (e) {
    console.error(e)
  }
}
