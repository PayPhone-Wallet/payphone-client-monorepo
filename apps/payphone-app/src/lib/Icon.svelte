<script lang="ts">
  import icon from '/icon.svg'

  export let size: 'sm' | 'md' | 'lg' = 'md'
</script>

<img id="payphone-icon" src={icon} alt="PayPhone Icon" class={size} />

<style>
  #payphone-icon {
    aspect-ratio: 1;
  }

  .sm {
    height: 2rem;
  }

  .md {
    height: 4rem;
  }

  .lg {
    height: 8rem;
  }
</style>
