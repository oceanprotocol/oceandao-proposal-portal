<script>
  import { SERVER_URI } from "../utils/config";
  export let proposalId;
  import { Link } from "svelte-navigator";
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
      <Button text={`Make an update`} />
      <Button text={`Complete proposal`} />
      <Button
        onclick={() =>
          (window.location.href = `/proposal/update/${proposalId}`)}
        text={`Update proposal`}
      />
      <Button color={"red"} text={`Withdraw proposal`} />
    </div>
  </div>
</div>
