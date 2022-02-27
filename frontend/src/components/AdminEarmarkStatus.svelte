<script>
  import earmarks from '../../src/utils/types/earmark.json'
  export let proposalEarmarkRequest;
</script>

<div class="earmarkRequest">
  {#if proposalEarmarkRequest !== "" && proposalEarmarkRequest !== undefined}
    <div class="justify-center text-center bg-yellow-50 p-4">
      Core-Tech Earmark under review...<br/>
      Please <a class="underline" href="https://github.com/oceanprotocol/oceandao/wiki/OceanDAO-Tech-Earmarks">receive clearance from Core-Tech WG.</a>
    </div>
  {/if}
</div>
