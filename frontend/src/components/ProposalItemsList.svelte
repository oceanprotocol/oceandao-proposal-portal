<script>
  import ProposalItem from "./ProposalItem.svelte";

  export let proposals;
</script>

<style>
  .proposalsContainer{
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
    background-color: #F8FAFC;
  }
</style>

<div class="proposalsContainer">
    {#each proposals as proposal}
        <ProposalItem
            proposal={proposal}
        />
    {/each}
</div>