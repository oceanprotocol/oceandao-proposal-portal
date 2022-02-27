<script>
  import Button from "./Button.svelte";
  import earmarks from '../utils/types/earmark.json'

  export let proposal;

  function onButtonClick() {
    location.href = `/proposal/view/${proposal._id}`;
  }
</script>

<style>
  .proposalCard{
    flex-direction: column;
    background-color: #E2E8F0;
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 20px;
    background-color: var(--brand-grey-dimmed);
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
  }
  .title{
    font-weight: bold;
  }
  .proposalCardDescription{
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  .buttonContainer{
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
</style>

<div class="flex justify-between proposalCard">
    <span class="title">Round {proposal.round}</span>
    <div class="proposalCardDescription">
      <span>{earmarks[proposal.proposalEarmark]}</span>
      <span>${proposal.proposalFundingRequested}</span>
    </div>
    <div class="buttonContainer">
      <Button
        text="View"
        secondary
        onclick={() => onButtonClick()}
      />
    </div>
</div>
