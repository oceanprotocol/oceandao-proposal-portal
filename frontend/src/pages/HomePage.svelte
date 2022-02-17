<script>
  import { userAddress, networkSigner } from "../stores/ethers";
  import Button from "../components/Button.svelte";
  import { SERVER_URI } from "../utils/config";
  import ProjectItem from "../components/ProjectItem.svelte";
  let projects = [];

  async function fetchProjects() {
    const res = await fetch(`${SERVER_URI}/app/myProjects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: $userAddress,
      }),
    });

    const data = await res.json();
    projects = data;
  }
  fetchProjects();
</script>

<div class="flex h-screen justify-center">
  <div class="m-auto flex justify-center flex-col">
    <p class="text-lg font-bold">Your projects</p>

    {#each projects as project}
      <ProjectItem {project} />
    {/each}

    <hr />

    <Button
      onclick={() => (location.href = "newProject")}
      text={`Create new project`}
    />
  </div>
</div>
