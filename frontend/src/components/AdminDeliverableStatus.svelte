<script>
  export let adminDescription;
  export let deliverableStatus;
  // 0: not delivered, 1: delivered, 2: delivered and accepted, 3: delivered and rejected
</script>

<style>
  .deliverables {
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
  }
</style>

{#if deliverableStatus > 0}
  <div class="deliverables">
    <div class="justify-center text-center bg-slate-50">
      {#if deliverableStatus === 1}
        <p class="bg-yellow-50 p-4">Deliverables Submitted. Proposal in review.</p>
      {/if}
      {#if deliverableStatus === 2}
        <p class="bg-green-50 p-4">Deliverables Accepted. Proposal Completed.</p>
      {/if}
      {#if deliverableStatus === 3}
        <div class="bg-red-50 p-4">
          <p>Deliverables Rejected. Please submit new Deliverables.</p>
          <br/>
          {adminDescription}
        </div>
      {/if}
    </div>
  </div>
{/if}
