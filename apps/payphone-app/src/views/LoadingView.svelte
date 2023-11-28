<script lang="ts">
  import { onMount } from 'svelte'
  import { appView, isAppInstalled, isAppLoaded, walletAddress } from '../stores'
  import { AppView } from '../types'

  $: isLoaded =
    $isAppLoaded.install &&
    $isAppLoaded.walletAddress &&
    $isAppLoaded.walletName &&
    $isAppLoaded.walletSecret &&
    ((!!$walletAddress && $isAppLoaded.walletBalance) || !$walletAddress)
  $: isLoaded && setAppView()

  const setAppView = () => {
    if ($isAppInstalled && !!$walletAddress) {
      appView.set(AppView.wallet)
    } else {
      appView.set(AppView.setup)
    }
  }

  const checkAppInstallState = () => {
    window.addEventListener('DOMContentLoaded', () => {
      const mediaEvent = window.matchMedia('(display-mode: standalone)')
      isAppInstalled.set(mediaEvent.matches)
      mediaEvent.addEventListener('change', (event) => isAppInstalled.set(event.matches))
    })
  }

  onMount(() => {
    checkAppInstallState()
  })
</script>

<section id="loading-view">
  <span>Loading...</span>
  <span>pretend there's a cool animation here</span>
</section>

<style>
  #loading-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    gap: 3em;
  }
</style>
