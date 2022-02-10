<script>
  export let title;
  export let placeHolder;
  export let value = null;
  export let disabled = false;
  export let wrong = false;
  export let rows = 3;
  export let wrongText = "";
</script>

<div class="mb-4">
  <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
    {title}
  </label>
  <textarea
    bind:value
    {rows}
    disabled={disabled === true}
    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline {wrong &&
      'border-red-500'}"
    type="text"
    placeholder={placeHolder ?? title}
  />
  {#if wrong}
    <p class="text-red-500 text-xs italic">{wrongText}</p>
  {/if}
</div>
