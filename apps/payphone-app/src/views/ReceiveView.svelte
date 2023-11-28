<script lang="ts">
  import { createQrCode } from '@payphone-client-monorepo/utilities'
  import { walletAddress, walletName } from '../stores'
  import type { Address } from 'viem'
  import { appUrl } from '../config'

  let qrCodeElement: HTMLElement | undefined = undefined
  let isQrCodeAppended = false
  let amountToReceive: number | undefined = undefined

  $: qrCode = $walletAddress
    ? createQrCode(formatQrCodeData($walletAddress, $walletName))
    : undefined
  $: !!qrCode && !!qrCodeElement && appendQrCode()
  $: !!qrCode &&
    qrCode.update({ data: formatQrCodeData($walletAddress, $walletName, amountToReceive) })

  const appendQrCode = () => {
    if (!!qrCode && !isQrCodeAppended && !!qrCodeElement) {
      qrCode.append(qrCodeElement)
      isQrCodeAppended = true
    }
  }

  const formatQrCodeData = (address?: Address, name?: string, amount?: number) => {
    const url = new URL(appUrl)

    !!address && url.searchParams.append('address', address)
    !!name && url.searchParams.append('name', name)
    !!amount && url.searchParams.append('amount', amount.toString())

    return url.toString()
  }
</script>

<!-- TODO: add nfc tap functionality -->

<section id="receive-view">
  <div id="qr-code" bind:this={qrCodeElement} />
  <input type="number" bind:value={amountToReceive} min={0} placeholder="Enter a $ amount" />
</section>

<style>
  #receive-view {
    display: flex;
    flex-direction: column;
    gap: 2em;
    height: 100%;
  }

  #qr-code {
    border-radius: 1em;
    overflow: hidden;
  }
</style>
