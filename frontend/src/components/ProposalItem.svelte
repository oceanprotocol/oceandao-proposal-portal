<script>
  import { Link } from "svelte-navigator";

  export let proposal;
</script>

<style>
  .proposalCard{
    flex-direction: column;
    background-color: grey;
    margin-bottom: 15px;
    padding: 20px;
  }
  .proposalCardDescription{
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  .proposalButton{
      width: 50%;
      margin: 0 auto;
  }
</style>

<div class="flex justify-between proposalCard">
    <span>Round {proposal.round}</span>
    <div class="proposalCardDescription">
        <span>{proposal.proposalEarmark}</span>
        <span>{proposal.proposalValue}</span>
    </div>
    <Link
        class="flex justify-center font-bold text-lg text-black-600 bg-white proposalButton"
        to={`/proposal/view/${proposal._id}`}>View</Link
    >
</div>