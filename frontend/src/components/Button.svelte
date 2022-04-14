<script>
  import { Circle } from 'svelte-loading-spinners'

  export let onclick;
  export let text;
  export let secondary;
  export let type;
  export let loading;
  export let disabled;
</script>

<button
  on:click={onclick}
  class="button {secondary && "buttonSecondary"} {disabled && "disabled"} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  disabled={disabled}
  type={type || 'button'}>
  {#if loading===true}
    <div class="loadingSpinnerContainer">
      <Circle size="20" color="#FFFFFF" unit="px" cl></Circle>
    </div>
  {/if}
  {text}
  </button
>

<style>
  .button {
    background-color: var(--brand-color-primary);
    font-size: var(--font-size-small);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loadingSpinnerContainer {
    margin-right: 5px;
  }
  .disabled{
    background-color: var(--button-disabled-color);
  }
  .buttonSecondary{
    background-color: var(--brand-white);
    color: var(--brand-black);
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
  }
</style>
