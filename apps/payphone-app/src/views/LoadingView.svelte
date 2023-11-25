<script lang="ts">
  import { onMount } from 'svelte'
  import { appView } from '../stores'
  import { AppView } from '../types'

  onMount(() => {
    // TODO: check if the app is installed (and set `isAppInstalled`)
    // TODO: check if a wallet address can be found
    // TODO: direct to proper view depending on results
    setTimeout(() => appView.set(AppView.wallet), 3_000)
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
