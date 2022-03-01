<script>
    export let label;
    export let placeholder;
    export let onChange;
</script>

<style>
    .inputContainer{
        display: flex;
        flex-direction: column;
        background-color: var(--brand-white);
        border-radius: var(--border-radius);
        border: 1px solid var(--brand-grey-lighter);
        box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
        padding: calc(var(--spacer) / 4);
        margin-top: calc(var(--spacer) / 2);
    }
    .inputContainer label{
        font-size: var(--font-size-normal);
        margin-bottom: calc(var(--spacer) / 4);
    }
    .inputContainer input{
        font-size: var(--font-size-small);
        min-height: 5vh;
        border: 2px solid var(--brand-grey-dimmed);
        padding: calc(var(--spacer) / 4);
    }
</style>


<div class="inputContainer">
    <label>{label}</label>
    <input
        placeholder={placeholder}
        on:change={(e) => onChange(e.target.value)}
    >
</div>