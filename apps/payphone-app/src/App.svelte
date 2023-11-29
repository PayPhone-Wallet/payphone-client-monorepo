<script lang="ts">
  import type { ComponentType } from 'svelte'
  import { appView } from './stores'
  import { AppView } from './types'
  import LoadingView from './views/LoadingView.svelte'
  import SetupView from './views/SetupView.svelte'
  import WalletView from './views/WalletView.svelte'
  import NamingView from './views/NamingView.svelte'
  import SendView from './views/SendView.svelte'
  import ReceiveView from './views/ReceiveView.svelte'
  import ServiceWorker from './lib/ServiceWorker.svelte'

  const appViews: Record<AppView, ComponentType> = {
    [AppView.loading]: LoadingView,
    [AppView.setup]: SetupView,
    [AppView.naming]: NamingView,
    [AppView.wallet]: WalletView,
    [AppView.send]: SendView,
    [AppView.receive]: ReceiveView
  }
</script>

<main>
  <svelte:component this={appViews[$appView]} />
</main>

<ServiceWorker />

<style>
  main {
    height: 100%;
    width: 100%;
  }
</style>
