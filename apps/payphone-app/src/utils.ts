import { appChainId } from './config'
import { isAppLoaded, walletAddress, walletBalance } from './stores'
import { getWalletPayTokenBalance } from '@payphone-client-monorepo/utilities'
import { get } from 'svelte/store'

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
