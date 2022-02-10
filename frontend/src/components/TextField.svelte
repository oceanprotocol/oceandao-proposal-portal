<script>
  export let title;
  export let placeHolder;
  export let value = null;
  export let disabled = false;
  export let wrong = false;
  export let wrongText = "";
  export let textFormat = "text";
  export let importantText = "";

  const handleInputType = (e) => {
    e.target.type = textFormat;
  };
</script>

<div class="mb-4">
  <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
    {title}
  </label>
  <input
    bind:value
    on:input={handleInputType}
    disabled={disabled === true}
    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline {wrong &&
      'border-red-500'}"
    placeholder={placeHolder ?? title}
  />
  {#if wrong}
    <p class="text-red-500 text-xs italic">{wrongText}</p>
  {/if}
  {#if importantText !== ""}
    <p class="text-gray opacity-60 text-xs italic text-left mt-1">
      {importantText}
    </p>
  {/if}
</div>
