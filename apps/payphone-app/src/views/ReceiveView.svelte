<script lang="ts">
  import { createQrCode } from '@payphone-client-monorepo/utilities'
  import { walletAddress } from '../stores'

  let qrCodeElement: HTMLElement | undefined = undefined
  let isQrCodeAppended = false

  $: qrCode = !!$walletAddress ? createQrCode($walletAddress) : undefined
  $: !!qrCode && !!qrCodeElement && appendQrCode()

  const appendQrCode = () => {
    if (!!qrCode && !isQrCodeAppended && !!qrCodeElement) {
      qrCode.append(qrCodeElement)
      isQrCodeAppended = true
    }
  }
</script>

<!-- TODO: add option to set amount to receive -->

<section id="receive-view">
  <div id="qr-code" bind:this={qrCodeElement} />
</section>

<style>
  #receive-view {
    height: 100%;
  }

  #qr-code {
    border-radius: 1em;
    overflow: hidden;
  }
</style>
