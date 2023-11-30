<script lang="ts">
  import { appView, walletName } from '../stores'
  import { AppView } from '../types'

  let newName: string | undefined = $walletName

  // TODO: improve validity checks with regex
  $: isValidNewName = !!newName?.trim() && !newName.includes('?') && !newName.includes('&')

  const onSubmit = () => {
    if (!!newName && isValidNewName) {
      walletName.set(newName.trim())
      appView.set(AppView.wallet)
    }
  }

  const onClickBack = () => {
    appView.set(AppView.wallet)
  }
</script>

<section id="naming-view">
  <div class="header">
    <h2>What should we call you?</h2>
    <span>This is what others see when sending you money.</span>
    <span>(you can change this later)</span>
  </div>
  <form on:submit|preventDefault={onSubmit}>
    <input type="text" bind:value={newName} placeholder="John Smith" />
    <div class="form-buttons">
      <button on:click={onClickBack}><i class="icofont-arrow-left" /> Back</button>
      <button type="submit" disabled={!isValidNewName}>Set Name</button>
    </div>
  </form>
</section>

<style>
  #naming-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50%;
    gap: 2rem;
  }

  .header {
    display: flex;
    flex-direction: column;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 75%;
  }

  form > input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .form-buttons {
    display: flex;
    gap: 1rem;
  }
</style>
