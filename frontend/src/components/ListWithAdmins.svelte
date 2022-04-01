<script>
  export let levels = [
      {id: 3, text: '3'},
      {id: 4, text: '4'},
      {id: 5, text: '5'},
  ];
  export let admins;
</script>

<style>
  .listContainer{
    display: flex;
    flex-direction: column;
    background-color: var(--brand-white);
    max-height: 55vh;
    overflow-y: auto;
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
  }
  .item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: calc(var(--spacer) / 4)
  }
  .list span{
    text-align: start;
    font-size: var(--font-size-normal);
    font-weight: bold;
    margin-bottom: calc(var(--spacer) / 4)
  }
  .text{
    font-size: var(--font-size-normal);
    padding: calc(var(--spacer) / 4)
  }
</style>

<div class="listContainer">
    {#if admins.length > 0}
        {#each admins as admin}
            <div class="item">
                <span>{admin.address}</span>
                <span>Privilege Level {admin.privilege}</span>
                <select bind:value={admin.privilege}>
                    {#each levels as level}
                        <option value={level.id}>
                            {level.text}
                        </option>
                    {/each}
                </select>
            </div>
        {/each}
    {:else}
        <div class="text">No Admins</div>
    {/if}
</div>
