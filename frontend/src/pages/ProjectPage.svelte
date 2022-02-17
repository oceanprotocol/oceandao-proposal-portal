<script>
  import { Link } from "svelte-navigator";

  import Button from "../components/Button.svelte";
  export let projectId;
  let project;
  let proposals = [];
  async function loadProject() {
    let res = await fetch(
      `http://localhost:3000/app/getProjectInfo/${projectId}`
    );
    res = await res.json();
    project = res.project;
    proposals = res.proposals;
    console.log(project, proposals);
  }
  loadProject();
</script>

<div class="flex h-screen justify-center">
  <div class="m-auto flex justify-center flex-col break-words w-4/5">
    <p class="text-lg font-bold">Project</p>
    <div>{JSON.stringify(project, 0, 2)}</div>
    <div class="mt-5">
      <p class="text-lg font-bold">Proposals</p>
      {#each proposals as proposal}
        <div class="flex justify-between">
          <Link
            class="font-bold text-lg text-blue-600"
            to={`/proposal/view/${proposal._id}`}>{proposal.proposalTitle}</Link
          >
        </div>
      {/each}
    </div>
    <div class="mt-5">
      <Button
        text={"Create proposal"}
        onclick={() => {
          location.href = "/proposal/create/" + projectId;
        }}
      />
    </div>
    <div class="mt-5">
      <Button
        text={"Project settings"}
        onclick={() => {
          location.href = "/project/edit/" + projectId;
        }}
      />
    </div>
  </div>
</div>
