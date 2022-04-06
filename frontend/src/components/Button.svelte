<script>
  export let onclick;
  export let text;
  export let secondary;
  export let type;
</script>

<button
  on:click={onclick}
  class="button {secondary && "buttonSecondary"} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  type={type ? type : "button"}>{text}</button
>

<style>
  .button {
    background-color: var(--brand-color-primary);
    font-size: var(--font-size-small);
  }
  .buttonSecondary{
    background-color: var(--brand-white);
    color: var(--brand-black);
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
  }
</style>
