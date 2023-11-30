<script lang="ts">
  import { createQrCode, formatPayTokenAmount } from '@payphone-client-monorepo/utilities'
  import { appView, walletAddress, walletBalance, walletName } from '../stores'
  import type { Address } from 'viem'
  import { appChainId, appUrl } from '../config'
  import Navbar from '../lib/Navbar.svelte'
  import { AppView } from '../types'
  import { onDestroy, onMount } from 'svelte'
  import { updateWalletBalance } from '../utils'
  import { notify } from '../notifications'

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

  const onClickBack = () => {
    appView.set(AppView.wallet)
  }

  let balanceCheckTimer: any;
  onMount(() => {
    balanceCheckTimer = setInterval(async () => {
      const balanceBefore = $walletBalance ?? 0n;
      try {
        const newBalance = await updateWalletBalance() ?? 0n;
        if (newBalance > balanceBefore) {
          const prettifiedAmount = formatPayTokenAmount(appChainId, newBalance - balanceBefore).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          notify(`🤑 Received $${prettifiedAmount}!`);
        }
      } catch (err) {
        console.error(err);
        clearInterval(balanceCheckTimer);
      }
    }, 5_000);
  })

  onDestroy(() => {
    clearInterval(balanceCheckTimer);
  })
</script>

<!-- TODO: add nfc tap functionality -->

<section id="receive-view">
  <Navbar />
  <div class="content-wrapper">
    <div id="qr-code" bind:this={qrCodeElement} />
    <!-- TODO: need validation for this value -->
    <input type="number" class="custom-amount-input" bind:value={amountToReceive} min={1} placeholder="Enter a $ amount" />
  </div>
  <button on:click={onClickBack}><i class="icofont-arrow-left" /> Back</button>
</section>

<style>
  #receive-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    height: 100%;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    height: 66%;
  }

  .custom-amount-input {
    font-size: 1.25rem;
    padding: 0.5rem;
  }

  #qr-code {
    aspect-ratio: 1;
    border-radius: 1rem;
    overflow: hidden;
  }

  input {
    width: calc(300px - 1rem);
  }

  button {
    margin-top: auto;
    margin-bottom: 1rem;
  }
</style>
