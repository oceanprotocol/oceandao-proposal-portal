<script>
  import Button from "./Button.svelte";

  export let title;
  export let actions;
  export let description;
</script>

<style>
  .section{
    width: 100%;
    text-align: center;
    padding-bottom: var(--spacer);
  }
  .section h2{
    font-size: var(--font-size-large);
    margin: calc(var(--spacer) / 2) 0;
  }
  .description{
    font-size: var(--font-size-small);
    margin-bottom: calc(var(--spacer) / 2);
    padding: calc(var(--spacer) / 2);
    max-height: 55vh;
    overflow-y: scroll;
  }
  .actionContainer{
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  .actionContainer div:only-child {
    margin-left: auto;
  }
</style>

<div class="section">
    <h2 class="text-lg font-bold title">{title}</h2>
    {#if description }
        <p class="bg-slate-50 description">{description}</p>
    {/if}
    <slot></slot>
    {#if actions }
        <div class="actionContainer">
        {#each actions as action}
            <div class="flex mt-5">
                <Button
                    text={action.text}
                    onclick={() => action.onClick()}
                />
            </div>
        {/each}
        </div>
    {/if}
</div>
