<script lang="ts">
  import { zeroAddress } from 'viem'
  import { setupDrawingPrompts } from '../config'
  import SetupStepListItem from '../lib/SetupStepListItem.svelte'
  import { appView, beforeAppInstallPromptEvent, isAppInstalled, walletAddress } from '../stores'
  import { AppView } from '../types'
  import EntropyCanvas from '../lib/EntropyCanvas.svelte'

  const setupSteps: string[] = ['Install PayPhone', 'Create wallet']
  const drawingPrompt = setupDrawingPrompts[Math.floor(Math.random() * setupDrawingPrompts.length)]
  let currentStepId = 0
  let canvasEntropy = BigInt(0);
  let sufficientEntropy = false;

  $: isInstallButtonEnabled = !$isAppInstalled && !!$beforeAppInstallPromptEvent
  $: $isAppInstalled && currentStepId === 0 && currentStepId++
  $: $isAppInstalled && $walletAddress && appView.set(AppView.wallet)
  $: checkEntropy(canvasEntropy)

  const onClickInstallApp = () => {
    if (!!$beforeAppInstallPromptEvent) {
      $beforeAppInstallPromptEvent.prompt()
    }
  }

  const checkEntropy = (entropy: bigint) => {
    // check if entropy is sufficient before moving on to next step
    let numZeros = 0;
    const entropyHex = entropy.toString(16).padStart(64, '0')
    for (let i = 0; i < entropyHex.length; i++) {
      if (entropyHex.charAt(i) === "0") numZeros++
    }
    // console.log(entropyHex, entropy, numZeros)
    const minPk = BigInt(1)
    const maxPk = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141')
    if (numZeros < 8 && entropy >= minPk && entropy < maxPk) {
      sufficientEntropy = true
      if (currentStepId == 1) currentStepId = 2
    }
  }

  const onClickCreateWallet = () => {
    // TODO: prompt user for auth with randomness to generate private key
    // (for now just use entropy as pk)
    walletAddress.set(zeroAddress)
    currentStepId++
  }
</script>

<section id="setup-view">
  <div class="setup-header">
    <h1>Set up your digital wallet</h1>
    <ol>
      {#each setupSteps as step, i}
        <SetupStepListItem stepId={i} {currentStepId} text={step} />
      {/each}
    </ol>
  </div>
  <div class="setup-step-content">
    {#if currentStepId === 0}
      <button on:click={onClickInstallApp} disabled={!isInstallButtonEnabled}>Install App</button>
      <p class="install-info">
        <strong>Is the button above disabled?</strong> If so, and your browser has not prompted you to
        install the app, check for an installation icon on the top right or try a different browser.
      </p>
    {:else if currentStepId === 1 || currentStepId === 2}
      <h2 class="draw-instructions">Draw {drawingPrompt} to create your wallet</h2>
      <EntropyCanvas bind:entropy={canvasEntropy} />
      <span class="draw-info">
        Why {drawingPrompt}?
        <span class="tooltip">
          We use your drawing as part of the randomness necessary to generate a unique cryptographic
          key for your wallet.
        </span>
      </span>
      <br>
      <button on:click={onClickCreateWallet} disabled={!sufficientEntropy}>Create Wallet</button>
    {/if}
  </div>
</section>

<style>
  #setup-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    gap: 2.5em;
  }

  .setup-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5em;
  }

  .setup-header > h1 {
    font-size: 1.8em;
  }

  .setup-header > ol {
    display: flex;
    flex-direction: column;
    text-align: start;
  }

  .setup-step-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .install-info {
    max-width: min(40em, 80%);
    font-size: 0.8em;
    opacity: 0.8;
  }

  .install-info > strong {
    font-weight: 500;
  }

  .draw-instructions {
    color: var(--green-700);
    font-size: 1.5em;
    font-weight: 600;
  }

  .draw-info {
    position: relative;
    display: inline-block;
    text-decoration: underline;
  }

  .tooltip {
    --width: min(35em, 55vw);
    --padding-x: 1em;
    position: absolute;
    bottom: 100%;
    left: 50%;
    visibility: hidden;
    width: var(--width);
    margin-bottom: 0.5em;
    margin-left: calc(0em - var(--padding-x) - var(--width) / 2);
    padding: 0.5em var(--padding-x);
    color: var(--green-700);
    background-color: var(--green-400);
    border-radius: 0.4em;
    font-size: 0.9em;
  }

  .tooltip::after {
    --arrow-size: 0.5em;
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: calc(0em - var(--arrow-size));
    border-width: var(--arrow-size);
    border-style: solid;
    border-color: var(--green-400) transparent transparent transparent;
  }

  .draw-info:hover > .tooltip {
    visibility: visible;
  }
</style>
