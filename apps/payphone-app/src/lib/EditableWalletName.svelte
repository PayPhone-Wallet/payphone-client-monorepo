<script lang="ts">
  import { walletAddress, walletName } from '../stores'

  const fallbackName = `User ${$walletAddress?.slice(2, 6)}`
  let isEditing = false
  let newName = $walletName ?? fallbackName

  const onClickEdit = () => {
    isEditing = true
  }

  const onSubmit = () => {
    if (!!newName) {
      walletName.set(newName)
    }
    isEditing = false
  }
</script>

<div class="editable-wallet-name">
  <span class="not-editing" class:hidden={isEditing}>
    {$walletName ?? fallbackName}
    <i
      class="icofont-pencil-alt-2"
      on:click={onClickEdit}
      on:keydown={onClickEdit}
      role="button"
      aria-roledescription="Edit wallet name"
      tabindex={1}
    />
  </span>
  <form on:submit|preventDefault={onSubmit} class:hidden={!isEditing}>
    <input type="text" bind:value={newName} />
    <button type="submit">Save</button>
  </form>
</div>

<style>
  .editable-wallet-name {
    height: 2.5em;
  }

  .not-editing {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    font-size: 0.9em;
    font-weight: 500;
  }

  .not-editing > i {
    font-size: 0.75em;
    cursor: pointer;
  }

  form {
    display: inline-flex;
  }

  form > input {
    height: 2.5em;
    padding: 0.1em 0.5em;
    border-radius: 0.5em 0 0 0.5em;
  }

  form > button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>
