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
 * Chromium PWA install prompt event
 */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}
