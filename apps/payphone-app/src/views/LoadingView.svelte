<script lang="ts">
  import { onMount } from 'svelte'
  import { appView, isAppInstalled, walletAddress } from '../stores'
  import { AppView } from '../types'

  const loadingChecks = {
    install: false
    // wallet: false
    // balance: false
  }

  $: isLoaded = Object.values(loadingChecks).every((state) => state)
  $: isLoaded && setAppView()

  const checkAppInstallState = () => {
    window.addEventListener('DOMContentLoaded', () => {
      const mediaEvent = window.matchMedia('(display-mode: standalone)')
      isAppInstalled.set(mediaEvent.matches)
      mediaEvent.addEventListener('change', (event) => isAppInstalled.set(event.matches))
      loadingChecks.install = true
    })
  }

  const checkWallet = () => {
    // TODO: check if a wallet address can be found on the device
  }

  // TODO: check balance if wallet address is found, before completing loading sequence

  const setAppView = () => {
    if ($isAppInstalled && !!$walletAddress) {
      appView.set(AppView.wallet)
    } else {
      appView.set(AppView.setup)
    }
  }

  onMount(() => {
    checkAppInstallState()
    checkWallet()
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
