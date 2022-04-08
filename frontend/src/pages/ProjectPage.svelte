<script>
  import { Link } from "svelte-navigator";
  import moment from "moment";
  import grantCategory from "../utils/types/grant_category.json";

  import Button from "../components/Button.svelte";
  import Section from "../components/Section.svelte";
  import ProposalItemsList from "../components/ProposalItemsList.svelte";

  import { SERVER_URI } from "../utils/config";

  export let projectId;
  let project;
  let proposals;

  function onCreateProposalClick() {
    location.href = "/proposal/create/" + projectId;
  }

  function onUpdateProjectClick() {
    location.href = "/project/edit/" + projectId;
  }

  async function loadProject() {
    let res = await fetch(`${SERVER_URI}/app/project/info/${projectId}`);
    res = await res.json();
    project = res.project;
    proposals = res.proposals;
  }
  loadProject();
</script>

<div class="flex h-screen flex-col justify-center project-container">
  {#if project}
    <Section
      title={project.projectName}
      description={project.projectDescription}
      descriptionBottom
      actions={[
        {
          text: "Update Project",
          onClick: onUpdateProjectClick,
        },
      ]}
    >
      <div class="details py-5 px-5">
        <div class="col-start-4 col-span-2 ...">
          <span class="detailName font-bold">Category</span>
          <span class="text-lg detailValue"
            >{grantCategory[project.projectCategory]}</span
          >
        </div>
        <div class="col-start-7 col-span-2 ...">
          <span class="detailName font-bold">Creation date</span>
          <span class="text-lg detailValue"
            >{moment(project.createdAt).format("YYYY-MM-DD")}</span
          >
        </div>
      </div>
    </Section>
  {/if}
  <Section
    title={"Proposals"}
    description={"Create and manage proposals below in order to submit them to OceanDAO Seed Grants. You can only have 1 proposal per project, for each funding round."}
    actions={[
      {
        text: "Create Proposal",
        onClick: onCreateProposalClick,
      },
    ]}
  >
    {#if proposals}
      <ProposalItemsList {proposals} />
    {/if}
  </Section>
</div>

<style>
  .project-container {
    height: 100%;
    max-width: 800px;
    margin: auto;
    padding-top: var(--spacer);
  }
  .details {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .detailName,
  .detailValue {
    font-size: var(--font-size-normal);
  }
</style>
