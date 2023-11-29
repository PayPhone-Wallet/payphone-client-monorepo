<script lang="ts">
  import { appView, walletAddress, walletBalance, walletName } from '../stores'
  import { formatPayTokenAmount } from '@payphone-client-monorepo/utilities'
  import { appChainId } from '../config'
  import { AppView } from '../types'

  $: formattedWalletBalance = formatPayTokenAmount(appChainId, $walletBalance ?? 0n)
  $: prettifiedWalletBalance = formattedWalletBalance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  $: fallbackWalletName = `User ${$walletAddress?.slice(2, 6) ?? '?'}`

  const onClickSend = () => {
    appView.set(AppView.send)
  }

  const onClickReceive = () => {
    appView.set(AppView.receive)
  }
</script>

<section id="wallet-view">
  <div class="header">
    <h1>${prettifiedWalletBalance}</h1>
    <span>{$walletName ?? fallbackWalletName}</span>
  </div>
  <div class="buttons">
    <button on:click={onClickSend} disabled={!$walletBalance}>Send</button>
    <button on:click={onClickReceive}>Receive</button>
  </div>
</section>

<style>
  #wallet-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    gap: 3em;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .header > h1 {
    font-size: 2.25em;
  }

  .buttons {
    display: flex;
    gap: 1em;
  }
</style>
