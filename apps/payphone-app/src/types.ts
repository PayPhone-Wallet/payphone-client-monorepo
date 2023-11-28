/**
 * App Views
 */
export enum AppView {
  'loading' = 'loading',
  'setup' = 'setup',
  'wallet' = 'wallet',
  'send' = 'send',
  'receive' = 'receive'
}

/**
 * Local Storage Keys
 */
export enum LSKey {
  'walletSecret' = 'walletSecret',
  'walletAddress' = 'walletAddress',
  'walletName' = 'walletName'
}

/**
 * Chromium PWA install prompt event
 */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}
