<script>
  import Button from "../components/Button.svelte";
  export let projectId;
  let project;
  let proposals;
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
    <p class="text-lg font-bold">Proposals</p>
    <div>{JSON.stringify(proposals, 0, 2)}</div>

    <Button text={"Create proposal"} onclick={() => {
        location.href = "/proposal/create/" + projectId;
    }} />
  </div>
</div>
