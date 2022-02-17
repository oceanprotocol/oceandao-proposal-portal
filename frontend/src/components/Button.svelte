<script>
  export let onclick;
  export let text;
  export let color = "blue";
</script>

<button
  on:click={onclick}
  class="button hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  type="button">{text}</button
>

<style>
  .button {
    background-color: var(--brand-color-primary);
  }
</style>
