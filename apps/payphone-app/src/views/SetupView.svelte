<script lang="ts">
  import SetupStepListItem from '../lib/SetupStepListItem.svelte'
  import { beforeAppInstallPromptEvent, isAppInstalled } from '../stores'

  const setupSteps: string[] = ['Install PayPhone', 'Create wallet', 'Pair with your device']
  let currentStepId = 0

  $: isInstallButtonEnabled = !$isAppInstalled && !!$beforeAppInstallPromptEvent
  $: $isAppInstalled && currentStepId === 0 && currentStepId++

  const onClickInstallApp = () => {
    if (!!$beforeAppInstallPromptEvent) {
      $beforeAppInstallPromptEvent.prompt()
    }
  }
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
      <button on:click={onClickInstallApp} disabled={!isInstallButtonEnabled}>
        Install the App
      </button>
      <p class="install-info">
        <strong>Is the button above disabled?</strong> If so, and your browser has not prompted you to
        install the app, check for an installation icon on the top right or try a different browser.
      </p>
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

  .setup-step-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: auto;
  }

  .install-info {
    max-width: min(40em, 80%);
    font-size: 0.8em;
    opacity: 0.8;
  }

  .install-info > strong {
    font-weight: 500;
  }
</style>
