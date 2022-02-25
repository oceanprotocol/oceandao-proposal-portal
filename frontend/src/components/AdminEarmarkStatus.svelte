<script>
  export let proposalEarmarkRequest;
</script>

<div class="earmarkRequest">
  <div class="justify-center text-center bg-yellow-50 p-4">
    {#if proposalEarmarkRequest !== ""}
      Earmark under review...<br/>
      Please <a class="underline" href="https://github.com/oceanprotocol/oceandao/wiki/OceanDAO-Tech-Earmarks">receive clearance from Core-Tech WG.</a>
    {/if}
  </div>
</div>
