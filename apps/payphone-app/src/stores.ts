import { updateWalletBalance } from './utils'
import { writable } from 'svelte/store'
import { type Address } from 'viem'

export const isAppInstalled = writable<boolean>(false)

export const walletAddress = writable<Address | undefined>()
export const walletBalance = writable<bigint | undefined>()
export const walletName = writable<string | undefined>()

isAppInstalled.subscribe(() => {
  // TODO: try to set `walletAddress` here
})

walletAddress.subscribe(() => {
  updateWalletBalance()
  // TODO: set `walletName` here
})
