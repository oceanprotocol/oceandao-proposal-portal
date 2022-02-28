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
  .text{
    font-size: var(--font-size-normal);
    padding: calc(var(--spacer) / 4)
  }
</style>

<div class="listContainer">
    {#if proposals.length > 0}
        {#each proposals as proposal}
            <div class="item">
                <span>{proposal.proposalTitle}</span>
                {#if actions }
                    <div class="actionContainer">
                    {#each actions as action}
                        <div class="action">
                            <Button
                                text={action.fieldName ? proposal[actions.fieldName] : action.text}
                                secondary={action.secondary ? true : false}
                                onclick={() => action.onClick(proposal._id)}
                            />
                        </div>
                    {/each}
                    </div>
                {/if}
            </div>
        {/each}
    {:else}
        <div class="text">No Proposals</div>
    {/if}
</div>