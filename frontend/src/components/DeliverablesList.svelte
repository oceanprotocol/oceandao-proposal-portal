<script>
  export let deliverables;
  export let title;
</script>

<style>
  .deliverablesContainer{
    display: flex;
    flex-direction: column;
    background-color: var(--brand-white);
    max-height: 55vh;
    overflow-y: scroll;
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
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
    margin-bottom: calc(var(--spacer) / 4)
  }
</style>

<div class="deliverablesContainer">
    {#each deliverables as deliverable}
        <div class="deliverable">
            <span>{title || Deliverables}</span>
            <p>{@html deliverables}</p>
        </div>
    {/each}
</div>