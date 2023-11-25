<script lang="ts">
  import Icon from './lib/Icon.svelte'
  import WalletView from './views/WalletView.svelte'
</script>

<!-- TODO: if app isn't installed yet, onboarding flow should be shown instead of `WalletView` -->

<main>
  <Icon />
  <WalletView />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 2em;
  }
</style>
