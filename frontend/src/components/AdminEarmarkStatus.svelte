<script>
  import earmarks from '../../src/utils/types/earmark.json'
  export let proposalEarmarkRequest;
</script>

<style>
  .earmarkRequest {
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
  }
</style>

{#if proposalEarmarkRequest !== "" && proposalEarmarkRequest !== undefined}
    <div class="earmarkRequest">
        {#if proposalEarmarkRequest === "coretech"}
            <div class="justify-center text-center bg-yellow-50 p-4">
              Core-Tech Earmark under review...<br/>
              Please <a class="underline" href="https://github.com/oceanprotocol/oceandao/wiki/OceanDAO-Tech-Earmarks">receive clearance from Core-Tech WG.</a>
            </div>
        {/if}
    </div>
{/if}
