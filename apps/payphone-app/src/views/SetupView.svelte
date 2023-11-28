<script lang="ts">
  import { toHex } from 'viem'
  import { appChainId, setupDrawingPrompts } from '../config'
  import SetupStepListItem from '../lib/SetupStepListItem.svelte'
  import { appView, beforeAppInstallPromptEvent, isAppInstalled, walletAddress } from '../stores'
  import { AppView } from '../types'
  import EntropyCanvas from '../lib/EntropyCanvas.svelte'
  import { getAlchemyProvider } from '@payphone-client-monorepo/utilities'

  const setupSteps: string[] = ['Install PayPhone', 'Create Wallet']
  const drawingPrompt = setupDrawingPrompts[Math.floor(Math.random() * setupDrawingPrompts.length)]
  let currentStepId = 0

  const minPk = BigInt(1)
  const maxPk = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141')
  let canvasEntropy = 0n

  $: isInstallButtonEnabled = !$isAppInstalled && !!$beforeAppInstallPromptEvent
  $: $isAppInstalled && currentStepId === 0 && currentStepId++
  $: $isAppInstalled && $walletAddress && appView.set(AppView.wallet)

  $: isSufficientEntropy = checkEntropy(canvasEntropy)

  const onClickInstallApp = () => {
    if (!!$beforeAppInstallPromptEvent) {
      $beforeAppInstallPromptEvent.prompt()
    }
  }

  const onClickCreateWallet = async () => {
    if (isSufficientEntropy) {
      const walletSecret = toHex(canvasEntropy)

      // TODO: prompt user for auth to aid in generating a more secure private key than just the secret
      const alchemyProvider = getAlchemyProvider(
        appChainId,
        walletSecret,
        import.meta.env.VITE_ALCHEMY_API_KEY
      )

      walletAddress.set(await alchemyProvider.account.getAddress())
    }
  }

  const checkEntropy = (entropy: bigint) => {
    const entropyHex = entropy.toString(16).padStart(64, '0')
    let numZeros = 0

    for (let i = 0; i < entropyHex.length; i++) {
      if (entropyHex.charAt(i) === '0') numZeros++
    }

    return numZeros < 8 && entropy >= minPk && entropy < maxPk
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
    {:else if currentStepId === 1}
      <h2 class="draw-instructions">Draw {drawingPrompt} to create your wallet</h2>
      <EntropyCanvas bind:entropy={canvasEntropy} />
      <span class="draw-info">
        Why {drawingPrompt}?
        <span class="tooltip">
          We use your drawing as part of the randomness necessary to generate a unique cryptographic
          key for your wallet.
        </span>
      </span>
      <button on:click={onClickCreateWallet} disabled={!isSufficientEntropy}>Create Wallet</button>
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
    margin-bottom: 1em;
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
