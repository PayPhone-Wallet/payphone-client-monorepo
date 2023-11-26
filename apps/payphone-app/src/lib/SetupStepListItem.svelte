<script lang="ts">
  export let stepId: number
  export let currentStepId: number
  export let text: string

  $: isActive = currentStepId >= stepId
  $: isDone = currentStepId > stepId
</script>

<li class:active={isActive}>
  <span>
    {text}
    <i class="icofont-check" class:done={isDone} />
  </span>
</li>

<style>
  li {
    color: var(--green-400);
  }

  li.active {
    color: var(--green-600);
    font-weight: 700;
  }

  li > span {
    display: flex;
    gap: 0.5em;
  }

  i.icofont-check {
    font-size: 1.5em;
    opacity: 0;
  }

  i.icofont-check.done {
    opacity: 1;
  }
</style>
