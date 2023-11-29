<script lang="ts">
  import QrScanner from 'qr-scanner'
  import { onDestroy, onMount } from 'svelte'
  import { isAddress, type Address } from 'viem'
  import { appChainId, appUrl } from '../config'
  import {
    getAlchemyProvider,
    parsePayTokenAmount,
    sendTransferPayTokenUserOperation
  } from '@payphone-client-monorepo/utilities'
  import { appView, walletBalance, walletSecret } from '../stores'
  import { AppView, NDEFReader } from '../types'
  import { updateWalletBalance } from '../utils'
  import Navbar from '../lib/Navbar.svelte'

  let mode: 'qr' | 'nfc' = 'nfc'
  let isNfcEnabled = false
  let isQrEnabled = false

  let videoElement: HTMLVideoElement | undefined = undefined
  let isQrScannerActive = false

  let txRequest: { address: Address; name?: string; amount?: number } | undefined = undefined
  let customAmountToSend: number | undefined = undefined
  let isSendingTx = false

  $: nfcReader = isNfcEnabled ? (new (window as any).NDEFReader() as NDEFReader) : undefined
  $: !!nfcReader && isNfcEnabled && mode === 'nfc' && !txRequest && startNfcScanning()

  $: qrScanner = !!videoElement ? createQrScanner() : undefined
  $: isQrEnabled && !!qrScanner && mode === 'qr' && !txRequest && startQrScanner()
  $: mode === 'nfc' && stopQrScanner()

  $: txRecipient = !!txRequest ? txRequest.name ?? `User ${txRequest.address.slice(2, 6)}` : '?'

  $: txAmount = txRequest?.amount ?? customAmountToSend
  $: rawTxAmount = !!txAmount ? parsePayTokenAmount(appChainId, txAmount) : undefined
  $: prettifiedTxAmount = txAmount?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  $: isValidTxAmount = !!rawTxAmount && !!$walletBalance && rawTxAmount <= $walletBalance

  $: isModeSwitchingEnabled = (mode === 'nfc' && isQrEnabled) || (mode === 'qr' && isNfcEnabled)
  $: otherMode = (mode === 'nfc' ? 'qr' : 'nfc') as typeof mode

  const startNfcScanning = async () => {
    if (!!nfcReader) {
      nfcReader
        .scan()
        .then(() => {
          if (!!nfcReader) {
            nfcReader.onreadingerror = () => {
              // TODO: show some error message here
            }

            nfcReader.onreading = (event) => {
              // TODO: maybe should check more than just the first record?
              const record = event.message.records[0]
              if (record.recordType === 'text') {
                const decoder = new TextDecoder(record.encoding)
                const data = decoder.decode(record.data)
                // TODO: should find a way to stop scanning and pass it to `onSuccess` here
                handleData(data)
              }
            }
          }
        })
        .catch(() => {
          console.warn(`Error while trying to initiate NFC scanning.`)
          isNfcEnabled = false
          mode = 'qr'
        })
    }
  }

  const createQrScanner = () => {
    if (!!videoElement) {
      return new QrScanner(videoElement, handleQrScan, {
        highlightScanRegion: true,
        highlightCodeOutline: true
      })
    }
  }

  const startQrScanner = () => {
    if (!!qrScanner && !isQrScannerActive) {
      isQrScannerActive = true
      qrScanner.start()
    }
  }

  const stopQrScanner = () => {
    if (!!qrScanner && isQrScannerActive) {
      qrScanner.stop()
      isQrScannerActive = false
    }
  }

  const handleQrScan = (result: QrScanner.ScanResult) => {
    handleData(result.data, stopQrScanner)
  }

  const handleData = (data: string, onSuccess?: () => void) => {
    if (isAddress(data)) {
      txRequest = { address: data }
      onSuccess?.()
    } else if (data.startsWith(appUrl)) {
      const url = new URL(data)
      const address = url.searchParams.get('address')

      if (!!address && isAddress(address)) {
        const name = url.searchParams.get('name') ?? undefined
        const _amount = url.searchParams.get('amount')
        const amount = !!_amount ? parseFloat(_amount) : undefined

        txRequest = { address, name, amount }
        onSuccess?.()
      }
    } else {
      // TODO: display some sort of error message
    }
  }

  const onClickSend = async () => {
    if (!!txRequest && !!rawTxAmount && isValidTxAmount) {
      isSendingTx = true

      const alchemyProvider = getAlchemyProvider(
        appChainId,
        $walletSecret as `0x${string}`,
        import.meta.env.VITE_ALCHEMY_API_KEY,
        import.meta.env.VITE_ALCHEMY_GAS_POLICY_ID
      )

      // TODO: show some "sending" screen

      const txHash = await sendTransferPayTokenUserOperation(
        txRequest.address,
        rawTxAmount,
        alchemyProvider
      )

      await updateWalletBalance()

      // TODO: show some "success" or "fail" screen
      appView.set(AppView.wallet)

      isSendingTx = false
    }
  }

  onMount(async () => {
    isNfcEnabled = 'NDEFReader' in window
    isQrEnabled = await QrScanner.hasCamera()

    if (!isNfcEnabled && isQrEnabled) {
      mode = 'qr'
    }
  })

  onDestroy(() => {
    qrScanner?.destroy()
  })
</script>

<section id="send-view">
  <Navbar isSettingsDisabled={isSendingTx} />
  {#if !!txRequest}
    <div class="content-wrapper">
      <div class="tx-request-info">
        {#if !!txRequest.amount}
          <span class="tx-request-name">
            {txRecipient} is requesting
          </span>
          <span class="tx-request-amount">${prettifiedTxAmount}</span>
        {:else}
          <span class="tx-request-name">
            How much to send to {txRecipient}?
          </span>
          <!-- TODO: need validation for this value -->
          <input
            class="custom-amount-input"
            type="number"
            bind:value={customAmountToSend}
            min={1}
            placeholder="$"
          />
        {/if}
      </div>
      <!-- TODO: need to show warning if amount to send is higher than wallet balance -->
      <div class="tx-request-buttons">
        <button on:click={() => (txRequest = undefined)} disabled={isSendingTx}>
          <i class="icofont-arrow-left" /> Back
        </button>
        <button on:click={onClickSend} disabled={!isValidTxAmount || isSendingTx}>
          {#if isSendingTx}
            Sending...
          {:else}
            Send
          {/if}
        </button>
      </div>
    </div>
  {:else}
    <div class="content-wrapper">
      <div class="video-wrapper" class:hidden={mode !== 'qr'}>
        <!-- TODO: add loading animation while video isn't on yet (permissions or render time) -->
        <!-- svelte-ignore a11y-media-has-caption -->
        <video id="camera-video" bind:this={videoElement} />
      </div>
      <!-- TODO: add cute nfc icon and some small text to tell the user to tap another device -->
    </div>
    <div class="buttons">
      <button on:click={() => appView.set(AppView.wallet)}>
        <i class="icofont-arrow-left" /> Back
      </button>
      <button on:click={() => (mode = otherMode)} disabled={!isModeSwitchingEnabled}>
        Switch to {otherMode.toUpperCase()}
      </button>
    </div>
  {/if}
</section>

<style>
  #send-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    gap: 3rem;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    height: 66%;
  }

  .tx-request-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: var(--green-900);
  }

  .tx-request-name {
    font-size: 1.25rem;
    font-weight: 400;
  }

  .tx-request-amount {
    font-size: 2.25rem;
    font-weight: 600;
  }

  .custom-amount-input {
    font-size: 1.25rem;
    padding: 0.5rem;
  }

  .tx-request-buttons {
    display: flex;
    gap: 1rem;
  }

  .video-wrapper {
    padding: 1rem;
    background-color: var(--green-100);
    border-radius: 1rem;
    overflow: hidden;
  }

  /* TODO: fix weird bottom padding issue */
  #camera-video {
    max-width: 100%;
    border-radius: 0.5rem;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    margin-top: auto;
    margin-bottom: 1rem;
  }
</style>
