<script>
  import Button from "./Button.svelte";

  export let proposals;
  export let actions;
</script>

<style>
  .listContainer{
    display: flex;
    flex-direction: column;
    background-color: var(--brand-white);
    max-height: 55vh;
    overflow-y: scroll;
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
  }
  .item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: calc(var(--spacer) / 4)
  }
  .list actions{
    text-align: start;
    font-size: var(--font-size-small);
  }
  .list span{
    text-align: start;
    font-size: var(--font-size-normal);
    font-weight: bold;
    margin-bottom: calc(var(--spacer) / 4)
  }
  .actionContainer{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .action{
      margin-left: 20px;
  }
</style>

<div class="listContainer">
    {#each proposals as proposal}
        <div class="item">
            <span>{proposal.proposalTitle}</span>
            {#if actions }
                <div class="actionContainer">
                {#each actions as action}
                    <div class="action">
                        <Button
                            text={action.text}
                            action?.secondary && secondary
                            onclick={() => action.onClick()}
                        />
                    </div>
                {/each}
                </div>
            {/if}
        </div>
    {/each}
</div>