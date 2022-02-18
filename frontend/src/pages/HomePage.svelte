<script>
  import { userAddress, networkSigner } from "../stores/ethers";
  import Button from "../components/Button.svelte";
  import { SERVER_URI } from "../utils/config";
  import ProjectItemsList from "../components/ProjectItemsList.svelte";
  import Section from "../components/Section.svelte";

  let projects;

  let pageText = {
    daoProjTitle: `DAO Projects`,
    daoProjDescription: `<p>Please use this portal to create projects and submit proposals to the OceanDAO Grants program.</p>
<br/>
<p>To submit a project & proposal to OceanDAO:</p>
<p>1. Creating a new project.</p>
<p>2. Creating a proposal for your project.</p>
<br/>
<p>Please make sure to submit proposals before each deadline.</p>
<p>You can <a href="https://oceanprotocol.com/dao">find them here</a>`
  };

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

    console.log(projects)
  }
  fetchProjects();

  function onCreateNewProject() {
    location.href = "/newProject";
  }
</script>

<style>
  .home-container{
    height: 100%;
    max-width: 800px;
    flex-direction: column;
    margin: auto;
    padding-top: var(--spacer);
  }
</style>

<div class="flex h-screen home-container">
  <Section class="flex text-left bg-grey-200"
    title={pageText.daoProjTitle}
    actions={[{
      "text": "Create Project",
      "onClick":  onCreateNewProject
    }]}>
    <div class="bg-slate-100 text-left">
      {@html pageText.daoProjDescription}
    </div>
    {#if projects}
      <ProjectItemsList {projects} />
    {/if}
  </Section>
</div>
