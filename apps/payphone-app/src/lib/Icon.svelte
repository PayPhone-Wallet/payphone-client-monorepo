<script lang="ts">
  import { appView } from '../stores'
  import { AppView } from '../types'
  import icon from '/icon.svg'

  $: isClickable = $appView === AppView.send || $appView === AppView.receive

  const onClick = () => {
    if (isClickable) {
      appView.set(AppView.wallet)
    }
  }
</script>

<div
  id="payphone-icon"
  on:click={onClick}
  on:keydown={onClick}
  role="button"
  tabindex={1}
  class:clickable={isClickable}
>
  <img src={icon} alt="PayPhone Icon" />
</div>

<style>
  #payphone-icon {
    height: 4em;
  }

  #payphone-icon.clickable {
    cursor: pointer;
  }
</style>
