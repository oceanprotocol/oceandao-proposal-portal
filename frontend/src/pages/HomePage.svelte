<script>
  import { userAddress, networkSigner } from "../stores/ethers";
  import Button from "../components/Button.svelte";
  import { SERVER_URI } from "../utils/config";
  import ProjectItemsList from "../components/ProjectItemsList.svelte";
  import Section from "../components/Section.svelte";

  let projects;

  async function fetchProjects() {
    const res = await fetch(`${SERVER_URI}/app/project/list`, {
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

    console.log(projects);
  }
  fetchProjects();

  function onCreateNewProject() {
    location.href = "/newProject";
  }
</script>

<div class="flex h-screen home-container">
  <Section
    class="flex text-left bg-grey-200"
    title={"DAO Projects"}
    description={"Welcome to the OceanDAO Proposal Portal. Create projects, submit proposals, and complete them to access higher funding."}
    descriptionTextLeft
    actions={[
      {
        text: "Create Project",
        onClick: onCreateNewProject
      },
    ]}
  >
    {#if projects}
      <ProjectItemsList {projects} />
    {/if}
  </Section>
</div>

<style>
  .home-container {
    height: 100%;
    max-width: 800px;
    flex-direction: column;
    margin: auto;
    padding-top: var(--spacer);
  }
</style>
