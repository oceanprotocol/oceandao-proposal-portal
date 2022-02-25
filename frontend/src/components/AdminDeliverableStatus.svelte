<script>
  export let adminDescription;
  export let deliverableStatus;
  // 0: not delivered, 1: delivered, 2: delivered and accepted, 3: delivered and rejected
</script>

<div class="deliverableStatus">
  <div class="justify-center text-center bg-slate-50">
    {#if deliverableStatus === 0}
      <p class="bg-slate-50 p-4">Please submit deliverables.</p>
    {/if}
    {#if deliverableStatus === 1}
      <p class="bg-yellow-50 p-4">Deliverables submitted. In review.</p>
    {/if}
    {#if deliverableStatus === 2}
      <p class="bg-green-50 p-4">Deliverables accepted. Proposal completed.</p>
    {/if}
    {#if deliverableStatus === 3}
      <p class="bg-red-50 p-4">Deliverables rejected: [{adminDescription}]</p>
    {/if}
  </div>
</div>
