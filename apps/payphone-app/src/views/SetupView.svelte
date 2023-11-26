<script lang="ts">
  import SetupStepListItem from '../lib/SetupStepListItem.svelte'

  let currentStepId = 1

  const setupSteps: string[] = ['Install PayPhone', 'Create wallet', 'Pair with your device']
</script>

<section id="setup-view">
  <h1>Set up your digital wallet</h1>
  <ol class="setup-steps">
    {#each setupSteps as step, i}
      <SetupStepListItem stepId={i} {currentStepId} text={step} />
    {/each}
  </ol>
  <div class="setup-step-content">
    {#if currentStepId === 0}
      <span>step 1 content</span>
    {:else if currentStepId === 1}
      <span>step 2 content</span>
    {:else if currentStepId === 2}
      <span>step 3 content</span>
    {/if}
  </div>
</section>

<style>
  #setup-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    gap: 2.5em;
  }

  h1 {
    font-size: 1.8em;
  }

  .setup-steps {
    display: flex;
    flex-direction: column;
    text-align: start;
  }
</style>
