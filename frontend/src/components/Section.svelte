<script>
  import Button from "./Button.svelte";

  export let title;
  export let actions;
  export let description;
  export let descriptionBottom;
  export let descriptionTextLeft;
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
    overflow-y: auto;
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
  }
  .actionContainer{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .actionContainer div:only-child {
    margin-left: auto;
  }
  .topContent{
    margin-bottom: calc(var(--spacer) / 2);
  }
  .textLeft{
    text-align: start;
  }
</style>

<div class="section">
    <h2 class="text-lg font-bold title">{title}</h2>
    {#if !descriptionBottom}
      {#if description }
          <p class="description {descriptionTextLeft && "textLeft"}">{@html description}</p>
      {/if}
      <slot></slot>
    {:else}
      <div class="topContent">
        <slot ></slot>
      </div>
      {#if description }
          <p class="description {descriptionTextLeft && "textLeft"}">{@html description}</p>
      {/if}
    {/if}
    {#if actions }
        <div class="actionContainer">
        {#each actions as action}
            <div class="flex mt-5">
                {#if action.type}
                  <Button
                      text={action.text}
                      type={action.type}
                      loading={action.loading}
                      disabled={action.disabled}
                  />
                {:else}
                  <Button
                      text={action.text}
                      onclick={() => action.onClick()}
                      loading={action.loading}
                      disabled={action.disabled}
                    />
                {/if}
                <Button
                    text={action.text}
                    onclick={() => action.onClick()}
                    loading={action.loading}
                    disabled={action.disabled}
                />
            </div>
        {/each}
        </div>
    {/if}
</div>
