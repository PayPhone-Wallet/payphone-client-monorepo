/**
 * App Views
 */
export enum AppView {
  'loading' = 'loading',
  'setup' = 'setup',
  'naming' = 'naming',
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

/**
 * NFC API Types
 */
export declare class NDEFReader extends EventTarget {
  constructor()
  onreading: (this: this, event: NDEFReadingEvent) => any
  onreadingerror: (this: this, error: Event) => any
  scan: (options?: NDEFScanOptions) => Promise<void>
  write: (message: NDEFMessageSource, options?: NDEFWriteOptions) => Promise<void>
  makeReadOnly: (options?: NDEFMakeReadOnlyOptions) => Promise<void>
}
declare class NDEFMessage {
  constructor(messageInit: NDEFMessageInit)
  records: ReadonlyArray<NDEFRecord>
}
declare interface NDEFMessageInit {
  records: NDEFRecordInit[]
}
declare type NDEFRecordDataSource = string | BufferSource | NDEFMessageInit
declare class NDEFRecord {
  constructor(recordInit: NDEFRecordInit)
  readonly recordType: string
  readonly mediaType?: string
  readonly id?: string
  readonly data?: DataView
  readonly encoding?: string
  readonly lang?: string
  toRecords?: () => NDEFRecord[]
}
declare interface NDEFRecordInit {
  recordType: string
  mediaType?: string
  id?: string
  encoding?: string
  lang?: string
  data?: NDEFRecordDataSource
}
declare type NDEFMessageSource = string | BufferSource | NDEFMessageInit
declare class NDEFReadingEvent extends Event {
  constructor(type: string, readingEventInitDict: NDEFReadingEventInit)
  serialNumber: string
  message: NDEFMessage
}
interface NDEFReadingEventInit extends EventInit {
  serialNumber?: string
  message: NDEFMessageInit
}
interface NDEFWriteOptions {
  overwrite?: boolean
  signal?: AbortSignal
}
interface NDEFMakeReadOnlyOptions {
  signal?: AbortSignal
}
interface NDEFScanOptions {
  signal: AbortSignal
}
