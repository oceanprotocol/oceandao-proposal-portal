<script>
  export let deliverables;
</script>

<style>
  .deliverablesContainer{
    display: flex;
    flex-direction: column;
    background-color: #F8FAFC;
    max-height: 55vh;
    overflow-y: scroll;
  }
  .deliverable{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: calc(var(--spacer) / 4)
  }
  .deliverable p{
    text-align: start;
    font-size: var(--font-size-small);
  }
  .deliverable span{
    text-align: start;
    font-size: var(--font-size-normal);
    font-weight: bold;
  }
</style>

<div class="deliverablesContainer">
    {#each deliverables as deliverable}
        <div class="deliverable">
            <span>{deliverable.name}</span>
            <p>{deliverable.description}</p>
        </div>
    {/each}
</div>