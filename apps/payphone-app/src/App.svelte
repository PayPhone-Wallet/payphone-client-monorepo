<script lang="ts">
  import type { ComponentType } from 'svelte'
  import Icon from './lib/Icon.svelte'
  import { appView } from './stores'
  import { AppView } from './types'
  import LoadingView from './views/LoadingView.svelte'
  import SetupView from './views/SetupView.svelte'
  import WalletView from './views/WalletView.svelte'
  import SendView from './views/SendView.svelte'
  import ReceiveView from './views/ReceiveView.svelte'

  const appViews: Record<AppView, ComponentType> = {
    [AppView.loading]: LoadingView,
    [AppView.setup]: SetupView,
    [AppView.wallet]: WalletView,
    [AppView.send]: SendView,
    [AppView.receive]: ReceiveView
  }
</script>

<main>
  {#if $appView !== AppView.loading}
    <Icon />
  {/if}
  <svelte:component this={appViews[$appView]} />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 2em;
  }
</style>
