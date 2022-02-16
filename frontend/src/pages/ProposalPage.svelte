<script>
  import { SERVER_URI } from "../utils/config";
  export let proposalId;
  let proposal;
  import Button from "../components/Button.svelte";

  async function loadData() {
    let res = await fetch(`${SERVER_URI}/app/proposalInfo/${proposalId}`);
    console.log(res);
    proposal = await res.json();
  }

  loadData();
</script>

<div class="flex h-screen justify-center">
  <div class="m-auto flex justify-center flex-col w-4/5">
    <p>{JSON.stringify(proposal)}</p>

    <div class="flex justify-center space-x-5">
      <Button text={`Deliver a deliverable`} />
      <Button text={`Update proposal`} />
    </div>
  </div>
</div>
