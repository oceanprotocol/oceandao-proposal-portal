<script>
  import Button from "./Button.svelte";
  import SvelteMarkdown from 'svelte-markdown';

  export let title;
  export let actions;
  export let source;
</script>

<style>
  .section{
    width: 100%;
    text-align: center;
    padding-bottom: var(--spacer);
  }
  .section h2{
    font-size: 32px;
    margin: calc(var(--spacer) / 2) 0;
  }
  .sourceContainer{
    margin-bottom: calc(var(--spacer) / 2);
    max-height: 55vh;
    overflow-y: scroll;
  }
</style>

<div class="section">
    <h2 class="text-lg font-bold title">{title}</h2>
    {#if source }
        <div class="bg-slate-50 sourceContainer">
            <SvelteMarkdown {source}/>
        </div>
    {/if}
    <slot></slot>
    {#if actions }
        {#each actions as action}
            <div class="flex mt-5 justify-end">
                <Button
                    text={action.text}
                    onclick={() => action.onClick()}
                />
            </div>
        {/each}
    {/if}
</div>
