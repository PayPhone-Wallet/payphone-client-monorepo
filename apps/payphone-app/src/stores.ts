import { AppView, type BeforeInstallPromptEvent, LSKey } from './types'
import { updateWalletBalance } from './utils'
import { readable, writable } from 'svelte/store'
import { type Address } from 'viem'

export const appView = writable<AppView>(AppView.loading)

export const isAppInstalled = writable<boolean | undefined>(undefined)
export const beforeAppInstallPromptEvent = readable<BeforeInstallPromptEvent | undefined>(
  undefined,
  (setEvent) => {
    window.addEventListener('beforeinstallprompt', (event) => {
      setEvent(event as BeforeInstallPromptEvent)
    })
  }
)

isAppInstalled.subscribe((value) => {
  value !== undefined && isAppLoaded.update((obj) => ({ ...obj, install: true }))
})

export const isAppLoaded = writable<{
  install: boolean
  walletAddress: boolean
  walletName: boolean
  walletSecret: boolean
  walletBalance: boolean
}>({
  install: false,
  walletAddress: false,
  walletName: false,
  walletSecret: false,
  walletBalance: false
})

export const walletAddress = writable<Address | undefined>(undefined, (set) => {
  const storedValue = localStorage.getItem(LSKey.walletAddress)
  !!storedValue && set(storedValue as Address)
  isAppLoaded.update((obj) => ({ ...obj, walletAddress: true }))
})
export const walletName = writable<string | undefined>(undefined, (set) => {
  const storedValue = localStorage.getItem(LSKey.walletName)
  !!storedValue && set(storedValue)
  isAppLoaded.update((obj) => ({ ...obj, walletName: true }))
})
export const walletSecret = writable<string>(undefined, (set) => {
  const storedValue = localStorage.getItem(LSKey.walletSecret)
  !!storedValue && set(storedValue)
  isAppLoaded.update((obj) => ({ ...obj, walletSecret: true }))
})
export const walletBalance = writable<bigint | undefined>()

walletAddress.subscribe((value) => {
  !!value && localStorage.setItem(LSKey.walletAddress, value)
  updateWalletBalance()
})
walletName.subscribe((value) => {
  !!value && localStorage.setItem(LSKey.walletName, value)
})
walletSecret.subscribe((value) => {
  !!value && localStorage.setItem(LSKey.walletSecret, value)
})
