import { appChainId } from './config'
import { isAppLoaded, walletAddress, walletBalance } from './stores'
import {
  getAlchemyProvider,
  getWalletPayTokenBalance,
  NETWORK,
  PAY_TOKEN,
  sendUserOperation
} from '@payphone-client-monorepo/utilities'
import { get } from 'svelte/store'
import { encodeFunctionData } from 'viem'

/**
 * Updates and returns the wallet's pay token balance
 * @returns
 */
export const updateWalletBalance = async () => {
  const address = get(walletAddress)

  if (!!address) {
    const balance = await getWalletPayTokenBalance(appChainId, address)
    walletBalance.set(balance)

    if (balance !== undefined && !get(isAppLoaded).walletBalance) {
      isAppLoaded.update((obj) => ({ ...obj, walletBalance: true }))
    }

    return balance
  }
}

// TODO: remove after no longer on testnet
/**
 * Sends a user operation request to mint a testnet balance
 * @param recipient the address to mint tokens to
 * @param amount the amount of tokens to mint
 * @returns
 */
export const sendMintUserOperation = async (amount: bigint, pk: `0x${string}`) => {
  if (appChainId !== NETWORK['base-goerli']) throw new Error('App not on Base Goerli!')

  const alchemyProvider = getAlchemyProvider(
    appChainId,
    pk,
    import.meta.env.VITE_ALCHEMY_API_KEY,
    import.meta.env.VITE_ALCHEMY_GAS_POLICY_ID
  )

  const walletAddress = await alchemyProvider.account.getAddress()

  const txData = encodeFunctionData({
    abi: [
      {
        inputs: [
          { internalType: 'contract ERC4626', name: 'vault', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' }
        ],
        name: 'mintAndDeposit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ],
    functionName: 'mintAndDeposit',
    args: [PAY_TOKEN[appChainId].address, walletAddress, amount]
  })

  const txHash = await sendUserOperation(
    '0x0c2341Ac7AeF10A84fDDE69cB3552D7a7263c656',
    txData,
    alchemyProvider
  )

  await updateWalletBalance()

  return txHash
}
