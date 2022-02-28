<script>
  import ProposalItem from "./ProposalItem.svelte";

  export let proposals;
</script>

<style>
  .proposalsContainer{
    display: grid;
    grid-gap: calc(var(--spacer) / 3);
    grid-template-columns: repeat(3, 1fr);
    padding-top:  5px;
  }
</style>

<div class="proposalsContainer">
    {#each proposals as proposal}
        <ProposalItem
            proposal={proposal}
        />
    {/each}
</div>
