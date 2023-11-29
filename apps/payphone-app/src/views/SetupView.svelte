<script lang="ts">
  import { toHex } from 'viem'
  import { appChainId, setupDrawingPrompts } from '../config'
  import SetupStepListItem from '../lib/SetupStepListItem.svelte'
  import {
    appView,
    beforeAppInstallPromptEvent,
    isAppInstalled,
    walletAddress,
    walletSecret
  } from '../stores'
  import { AppView } from '../types'
  import EntropyCanvas from '../lib/EntropyCanvas.svelte'
  import { getAlchemyProvider, parsePayTokenAmount } from '@payphone-client-monorepo/utilities'
  import Icon from '../lib/Icon.svelte'
  import { sendMintUserOperation } from '../utils'

  const setupSteps: string[] = ['Install PayPhone', 'Create Wallet']
  const drawingPrompt = setupDrawingPrompts[Math.floor(Math.random() * setupDrawingPrompts.length)]
  let currentStepId = 0
  let isCreatingWallet = false

  const minPk = BigInt(1)
  const maxPk = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141')
  let canvasEntropy = 0n

  $: isInstallButtonEnabled = !$isAppInstalled && !!$beforeAppInstallPromptEvent
  $: $isAppInstalled && currentStepId === 0 && currentStepId++
  $: $isAppInstalled && $walletAddress && appView.set(AppView.naming)

  $: isSufficientEntropy = checkEntropy(canvasEntropy)

  const onClickInstallApp = () => {
    if (!!$beforeAppInstallPromptEvent) {
      $beforeAppInstallPromptEvent.prompt()
    }
  }

  const onClickCreateWallet = async () => {
    if (isSufficientEntropy) {
      isCreatingWallet = true
      const randomSecret = toHex(canvasEntropy)
      walletSecret.set(randomSecret)

      // TODO: prompt user for auth to aid in generating a more secure private key than just the secret
      const alchemyProvider = getAlchemyProvider(
        appChainId,
        randomSecret,
        import.meta.env.VITE_ALCHEMY_API_KEY,
        import.meta.env.VITE_ALCHEMY_GAS_POLICY_ID
      )

      // TODO: remove this after not on testnet anymore
      await sendMintUserOperation(parsePayTokenAmount(appChainId, 100), randomSecret)

      walletAddress.set(await alchemyProvider.account.getAddress())
      isCreatingWallet = false
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
  <Icon />
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
      <button on:click={onClickCreateWallet} disabled={!isSufficientEntropy || isCreatingWallet}>
        {#if isCreatingWallet}
          <!-- TODO: add spinner or other loading indicator instead of text -->
          Creating Wallet...
        {:else}
          Create Wallet
        {/if}
      </button>
    {/if}
  </div>
</section>

<style>
  #setup-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    gap: 2.5rem;
  }

  .setup-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
  }

  .setup-header > h1 {
    font-size: 1.8rem;
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
    width: 100%;
    margin-top: auto;
  }

  .install-info {
    max-width: min(40em, 80%);
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .install-info > strong {
    font-weight: 500;
  }

  .draw-instructions {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .draw-info {
    position: relative;
    display: inline-block;
    text-decoration: underline;
    margin-bottom: 1rem;
  }

  .tooltip {
    --width: min(35em, 55vw);
    --padding-x: 1rem;
    position: absolute;
    bottom: 100%;
    left: 50%;
    visibility: hidden;
    width: var(--width);
    margin-bottom: 0.5rem;
    margin-left: calc(0rem - var(--padding-x) - var(--width) / 2);
    padding: 0.5rem var(--padding-x);
    background-color: var(--green-400);
    border-radius: 0.4rem;
    font-size: 0.9rem;
  }

  .tooltip::after {
    --arrow-size: 0.5rem;
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: calc(0rem - var(--arrow-size));
    border-width: var(--arrow-size);
    border-style: solid;
    border-color: var(--green-400) transparent transparent transparent;
  }

  .draw-info:hover > .tooltip {
    visibility: visible;
  }
</style>
