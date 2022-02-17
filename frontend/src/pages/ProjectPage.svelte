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

<div class="flex h-screen flex-col justify-center project-container">
  {#if project}
    <Section
      title={project.projectName}
      source={project.projectDescription}
      actions={[
        {
          text: "Update Project",
          onClick: onCreateProposalClick,
        },
      ]}
    >
      <div class="details bg-slate-200 py-5 px-5">
        <div class="col-start-4 col-span-2 ...">
          <span class="detailName font-bold text-xl">Category</span>
          <span class="text-lg detailValue"
            >{grantCategory[project.projectCategory]}</span
          >
        </div>
        <div class="col-start-7 col-span-2 ...">
          <span class="detailName font-bold text-xl">Creation date</span>
          <span class="text-lg detailValue"
            >{moment(project.createdAt).format("YYYY-MM-DD")}</span
          >
        </div>
      </div>
    </Section>
  {/if}
  <Section
    title={"Proposals"}
    source={pageText.proposalDescription}
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

  <div class="section">
    <h2 class="text-lg font-bold title">Project Proposals</h2>
    <div class="text-left bg-slate-50">
      <div>{pageText.proposalDescription}</div>
    </div>
    <div class="proposalsContainer">
      {#each proposals as proposal}
        <div class="flex justify-between proposalCard">
          <span>Round {proposal.round}</span>
          <div class="proposalCardDescription">
            <span>{proposal.proposalEarmark}</span>
            <span>{proposal.proposalValue}</span>
          </div>
          <Link
            class="flex justify-center font-bold text-lg text-black-600 bg-white"
            to={`/proposal/view/${proposal._id}`}>View</Link
          >
        </div>
      {/each}
    </div>
    <div class="flex mt-5 justify-end">
      <Button
        text={"Create Proposal"}
        onclick={() => {
          location.href = "/proposal/create/" + projectId;
        }}
      />
    </div>
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
</style>
