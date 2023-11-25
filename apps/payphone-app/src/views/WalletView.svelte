<script lang="ts">
  import { walletBalance } from '../stores'
  import { formatPayTokenAmount } from '@payphone-client-monorepo/utilities'
  import { appChainId } from '../config'

  $: formattedWalletBalance = formatPayTokenAmount(appChainId, $walletBalance ?? 0n)
  $: prettifiedWalletBalance = formattedWalletBalance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  const onClickSend = () => {
    // TODO: change to send view
  }

  const onClickReceive = () => {
    // TODO: change to receive view
  }
</script>

<section id="wallet-view">
  <div class="header">
    <h1>${prettifiedWalletBalance}</h1>
    <!-- TODO: allow for editing this name -->
    <h2>Vitalik B.</h2>
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

  .header > h2 {
    font-size: 0.9em;
    font-weight: 500;
  }

  .buttons {
    display: flex;
    gap: 1em;
  }
</style>
