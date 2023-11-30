<script lang="ts">
  import { appView, walletBalance } from '../stores'
  import { formatPayTokenAmount } from '@payphone-client-monorepo/utilities'
  import { appChainId } from '../config'
  import { AppView } from '../types'
  import Navbar from '../lib/Navbar.svelte'
  import { onMount } from 'svelte'
  import { requestNotificationPermission } from '../notifications'

  $: formattedWalletBalance = formatPayTokenAmount(appChainId, $walletBalance ?? 0n)
  $: prettifiedWalletBalance = formattedWalletBalance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  const onClickSend = () => {
    appView.set(AppView.send)
  }

  const onClickReceive = () => {
    appView.set(AppView.receive)
  }

  onMount(() => {
    requestNotificationPermission().catch(console.error);
  });
</script>

<section id="wallet-view">
  <Navbar />
  <div class="header">
    <h1>Your Balance</h1>
    <span>${prettifiedWalletBalance}</span>
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
    gap: 3rem;
  }

  .header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    height: 33%;
  }

  .header > h1 {
    font-size: 1.5rem;
    font-weight: 400;
  }

  .header > span {
    font-size: 2.4rem;
    font-weight: 700;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    margin-top: auto;
    margin-bottom: 1rem;
  }
</style>
