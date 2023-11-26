import { AppView, type BeforeInstallPromptEvent } from './types'
import { updateWalletBalance } from './utils'
import { readable, writable } from 'svelte/store'
import { type Address } from 'viem'

export const appView = writable<AppView>(AppView.loading)

export const isAppInstalled = writable<boolean>(false)
export const beforeAppInstallPromptEvent = readable<BeforeInstallPromptEvent | undefined>(
  undefined,
  (setEvent) => {
    window.addEventListener('beforeinstallprompt', (event) => {
      setEvent(event as BeforeInstallPromptEvent)
    })
  }
)

export const walletAddress = writable<Address | undefined>()
export const walletBalance = writable<bigint | undefined>()
export const walletName = writable<string | undefined>()

walletAddress.subscribe(() => {
  updateWalletBalance()
  // TODO: set `walletName` here
})
