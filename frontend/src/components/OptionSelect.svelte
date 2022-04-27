<script>
  export let title;
  export let value;
  export let disabled = false;
  export let wrong = false;
  export let wrongText = "";
  export let importantText;
  export let options;
</script>

<div class="mb-4">
  <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
    {title}
  </label>
  <select
    {disabled}
    bind:value
    class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    id="grid-state"
  >
    {#each options as option}
      <option value={option.value}>{option.text}</option>
    {/each}
  </select>
  {#if wrong}
    <p class="text-red-500 text-xs italic">{wrongText}</p>
  {/if}
  {#if importantText !== "" || importantText !== null}
    <p class="text-gray opacity-60 text-xs italic text-left mt-1">
      {importantText ?? ""}
    </p>
  {/if}
</div>
