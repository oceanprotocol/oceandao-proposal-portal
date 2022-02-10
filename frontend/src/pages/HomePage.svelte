<script>
  export let userAddress;
  import Button from "../components/Button.svelte";
</script>

<div class="flex h-screen justify-center">
  <div class="m-auto flex justify-center flex-col">
   
    <p class="text-lg font-bold">Your proposals</p>
    <Button
      onclick={() => (location.href = "submitProposal")}
      text={`Create new proposal`}
    />
  </div>
</div>
