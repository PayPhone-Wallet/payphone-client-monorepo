<script lang="ts">
  import { appView } from '../stores'
  import { AppView } from '../types'
  import Icon from './Icon.svelte'

  export let isSettingsDisabled = false

  const onClickSettings = () => {
    if (!isSettingsDisabled) {
      appView.set(AppView.naming)
    }
  }
</script>

<section id="navbar">
  <div class="logo">
    <Icon size="sm" />
    <span>PayPhone</span>
  </div>
  <i
    class="icofont-gear"
    on:click={onClickSettings}
    on:keydown={onClickSettings}
    role="button"
    aria-roledescription="Settings"
    tabindex={2}
  />
</section>

<style>
  #navbar {
    display: inline-flex;
    align-items: center;
    width: 100%;
  }

  .logo {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .icofont-gear {
    margin-left: auto;
    font-size: 1.5rem;
    color: var(--green-500);
    cursor: pointer;
  }
</style>
