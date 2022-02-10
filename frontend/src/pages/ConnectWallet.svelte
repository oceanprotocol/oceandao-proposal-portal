<script>
  export let connectWallet;
  import Button from "../components/Button.svelte";
</script>

<div class="flex h-screen justify-center">
  <div class="m-auto flex justify-center flex-col">
    <Button onclick={() => connectWallet()} text={`Connect Wallet`} />
  </div>
</div>
