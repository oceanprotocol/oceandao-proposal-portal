<script>
  import { userAddress, networkSigner } from "../stores/ethers";
  import Button from "../components/Button.svelte";
  import { SERVER_URI } from "../utils/config";
  import ProjectItemsList from "../components/ProjectItemsList.svelte";
  import Section from "../components/Section.svelte";

  let projects = [
    {
      projectId: 4,
      projectTitle: 'Test'
    },
    {
      projectId: 3,
      projectTitle: 'Test'
    },
    {
      projectId: 2,
      projectTitle: 'Test'
    },
    {
      projectId: 1,
      projectTitle: 'Test'
    }
  ];

  /*async function fetchProjects() {
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
  fetchProjects();*/

  function onCreateNewProject() {
    location.href = "/project/create/";
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
  <Section
    title={"DAO Projects"}
    source={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut."}
  />
  <Section
    title={"Your Projects"}
    source={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut."}
  >
    {#if projects}
      <ProjectItemsList {projects} />
    {/if}
  </Section>
  <Section
    title={"Create Project"}
    source={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut."}
    actions={[{
      "text": "Create Project",
      "onClick":  onCreateNewProject
    }]}
  />
</div>
