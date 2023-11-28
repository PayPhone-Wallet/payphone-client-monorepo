<script lang="ts">
  import QrScanner from 'qr-scanner'
  import { onDestroy, onMount } from 'svelte'
  import { isAddress, type Address } from 'viem'
  import { appChainId, appUrl } from '../config'
  import { formatPayTokenAmount } from '@payphone-client-monorepo/utilities'
  import { appView } from '../stores'
  import { AppView } from '../types'

  let mode: 'qr' | 'nfc' = 'nfc'
  let isNfcEnabled = false
  let isQrEnabled = false

  let videoElement: HTMLVideoElement | undefined = undefined
  let isQrScannerActive = false

  let txRequest: { address: Address; name?: string; amount?: bigint } | undefined = undefined

  $: qrScanner = !!videoElement ? createQrScanner() : undefined
  $: isQrEnabled && !!qrScanner && mode === 'qr' && !txRequest && startQrScanner()
  $: mode === 'nfc' && stopQrScanner()

  $: formattedTxAmount = formatPayTokenAmount(appChainId, txRequest?.amount ?? 0n)
  $: prettifiedTxAmount = formattedTxAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  $: isModeSwitchingEnabled = (mode === 'nfc' && isQrEnabled) || (mode === 'qr' && isNfcEnabled)
  $: otherMode = (mode === 'nfc' ? 'qr' : 'nfc') as typeof mode

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
    if (isAddress(result.data)) {
      txRequest = { address: result.data }
      stopQrScanner()
    } else if (result.data.startsWith(appUrl)) {
      const url = new URL(result.data)
      const address = url.searchParams.get('address')

      if (!!address && isAddress(address)) {
        const name = url.searchParams.get('name') ?? undefined
        const _amount = url.searchParams.get('amount')
        const amount = !!_amount ? BigInt(_amount) : undefined

        txRequest = { address, name, amount }
        stopQrScanner()
      }
    } else {
      // TODO: display some sort of error message
    }
  }

  const onClickSend = async () => {
    if (!!txRequest && !!txRequest.amount) {
      // TODO: ask for signature and send tx through gas api
      // TODO: show some success/fail screen
    }
  }

  const onClickCancel = async () => {
    appView.set(AppView.wallet)
  }

  onMount(async () => {
    isNfcEnabled = false
    isQrEnabled = await QrScanner.hasCamera()

    if (!isNfcEnabled && isQrEnabled) {
      mode = 'qr'
    }
  })

  onDestroy(() => {
    qrScanner?.destroy()
  })
</script>

<!-- TODO: add nfc tap functionality (use nfc first if device is compatible) -->

<section id="send-view">
  {#if !!txRequest}
    <div class="tx-request-info">
      {#if !!txRequest.amount}
        <span class="tx-request-name">
          {txRequest.name ?? `User ${txRequest.address.slice(2, 8)}`} is requesting
        </span>
        <span class="tx-request-amount">${prettifiedTxAmount}</span>
      {:else}
        <!-- TODO: prompt the user to enter an amount -->
      {/if}
    </div>
    <div class="tx-request-buttons">
      <button on:click={onClickSend} disabled={!txRequest.amount}>Send</button>
      <button on:click={onClickCancel}>Cancel</button>
    </div>
  {:else}
    <div class="video-wrapper" class:hidden={mode !== 'qr'}>
      <!-- TODO: add loading animation while video isn't on yet (permissions or render time) -->
      <!-- svelte-ignore a11y-media-has-caption -->
      <video id="camera-video" bind:this={videoElement} />
    </div>
    <!-- TODO: add cute nfc icon and some small text to tell the user to tap another device -->
  {/if}
  <button on:click={() => (mode = otherMode)} disabled={!isModeSwitchingEnabled}>
    Switch to {otherMode.toUpperCase()}
  </button>
</section>

<style>
  #send-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    gap: 3em;
  }

  .tx-request-info {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    color: var(--green-900);
  }

  .tx-request-name {
    font-size: 0.9em;
    font-weight: 500;
  }

  .tx-request-amount {
    font-size: 2.25em;
    font-weight: 600;
  }

  .tx-request-buttons {
    display: flex;
    gap: 1em;
  }

  .video-wrapper {
    padding: 1em;
    background-color: var(--green-100);
    border-radius: 1em;
  }

  /* TODO: fix weird bottom padding issue */
  #camera-video {
    max-width: 100%;
    border-radius: 0.5em;
  }
</style>
