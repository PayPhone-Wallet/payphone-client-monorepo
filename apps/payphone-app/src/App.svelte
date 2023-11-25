<script lang="ts">
  import Icon from './lib/Icon.svelte'
  import OnboardingView from './views/OnboardingView.svelte'
  import WalletView from './views/WalletView.svelte'
</script>

<!-- TODO: need loading screen before any content is loaded, to avoid flickers (check current app state) -->
<!-- TODO: if app isn't installed yet, onboarding flow should be shown instead of `WalletView` -->

<main>
  <Icon />
  <WalletView />
  <!-- <OnboardingView /> -->
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 2em;
  }
</style>
