<script>
  import * as yup from 'yup';

  export let title;
  export let name;
  export let placeHolder;
  export let value = null;
  export let disabled;
  export let error;
  export let textFormat = "text";
  export let importantText = "";
  export let handleChange;

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
    name={name}
    disabled={disabled}
    on:change={handleChange}
    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline {error && 'border-red-500'}"
  />
  {#if error}
    <p class="text-red-500 italic text-left mt-1">
      {error}
    </p>
  {/if}
  {#if importantText !== "" || importantText !== null}
    <p class="text-gray opacity-60 text-xs italic text-left mt-1">
      {importantText ?? ""}
    </p>
  {/if}
</div>
