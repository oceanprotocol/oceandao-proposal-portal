<script>
  import { Link } from "svelte-navigator";
  import moment from "moment";
  import grantCategory from "../utils/types/grant_category.json";
  import Button from "../components/Button.svelte";
  import Section from "../components/Section.svelte";
  import ProposalItemsList from "../components/ProposalItemsList.svelte";

  export let projectId;
  let pageText = {
    proposalDescription: `Create and manage proposals below in order to submit them to OceanDAO Seed Grants.
You can only have 1 proposal per project, for each funding round.`,
  };
  //let project;
  let source;

  //Placeholder Project
  let project = {
    projectName: "Monkey",
    projectCategory: "Outreach",
    createdAt: "11.02.2012",
    projectDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut.",
  };

  // Placeholder Proposals
  let proposals = [
    {
      proposalId: 4,
      proposalTitle: "Test",
      round: 14,
      proposalEarmark: "Outreach",
      proposalValue: "30000",
    },
    {
      proposalId: 3,
      proposalTitle: "Test",
      round: 13,
      proposalEarmark: "Outreach",
      proposalValue: "30000",
    },
    {
      proposalId: 2,
      proposalTitle: "Test",
      round: 12,
      proposalEarmark: "Outreach",
      proposalValue: "30000",
    },
    {
      proposalId: 1,
      proposalTitle: "Test",
      round: 11,
      proposalEarmark: "Outreach",
      proposalValue: "30000",
    },
    {
      proposalId: 0,
      proposalTitle: "Test",
      round: 10,
      proposalEarmark: "Outreach",
      proposalValue: "30000",
    },
  ];

  function onCreateProposalClick() {
    location.href = "/proposal/create/" + projectId;
  }

  /*async function loadProject() {
    let res = await fetch(
      `http://localhost:3000/app/getProjectInfo/${projectId}`
    );
    res = await res.json();
    project = res.project;

    // User Placeholder Proposals
    // proposals = res.proposals;
    console.log(project, proposals);

    source = project.projectDescription;
  }
  loadProject();*/
</script>

<style>
  .project-container{
    height: 100%;
    max-width: 800px;
    margin: auto;
    padding-top: var(--spacer);
  }
  .details{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .detailName, .detailValue{
    font-size: var(--font-size-normal);
  }
</style>

<div class="flex h-screen flex-col justify-center project-container">
    {#if project }
        <Section
          title={project.projectName}
          description={project.projectDescription}
          actions={[{
            "text": "Update Project",
            "onClick":  onCreateProposalClick
          }]}
        >
          <div class="details bg-slate-200 py-5 px-5">
            <div class="col-start-4 col-span-2 ...">
              <span class="detailName font-bold">Category</span>
              <span class="text-lg detailValue">{grantCategory[project.projectCategory]}</span>
            </div>
            <div class="col-start-7 col-span-2 ...">
              <span class="detailName font-bold">Creation date</span>
              <span class="text-lg detailValue">{moment(project.createdAt).format('YYYY-MM-DD')}</span>
            </div>
          </div>
      </Section>
    {/if}
      <Section
          title={"Proposals"}
          description={pageText.proposalDescription}
          actions={[{
            "text": "Create Proposal",
            "onClick":  onCreateProposalClick
          }]}
      >
        {#if proposals }
          <ProposalItemsList
            proposals={proposals}
          />
       {/if}
      </Section>
</div>
