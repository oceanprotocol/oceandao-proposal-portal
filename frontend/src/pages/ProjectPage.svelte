<script>
  import { Link } from "svelte-navigator";
  import moment from "moment";
  import grantCategory from "../utils/types/grant_category.json";

  import Button from "../components/Button.svelte";
  export let projectId;
  let pageText = {
    proposalDescription: `Create and manage proposals below in order to submit them to OceanDAO Seed Grants.
You can only have 1 proposal per project, for each funding round.`,
  };
  let project;
  let proposals = [];
  let source;

  async function loadProject() {
    let res = await fetch(
      `http://localhost:3000/app/getProjectInfo/${projectId}`
    );
    res = await res.json();
    project = res.project;

    proposals = res.proposals;
    console.log(project, proposals);

    source = project.projectDescription;
  }
  loadProject();
</script>

<div class="flex h-screen flex-col justify-center project-container">
  {#if project}
    <div class="col-start-1 col-span-2 section">
      <h2 class="text-lg font-bold">{project.projectName}</h2>
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
      {#if source}
        <div class="bg-slate-50">
          {@html source}
        </div>
      {/if}
      <div class="flex mt-5 justify-end">
        <Button
          text={"Update Project"}
          onclick={() => {
            location.href = "/project/edit/" + projectId;
          }}
        />
      </div>
    </div>
  {/if}

  <div class="section">
    <h2 class="text-lg font-bold title">Project Proposals</h2>
    <div class="text-left bg-slate-50 mb-5">
      <div>{pageText.proposalDescription}</div>
    </div>
    <div class="proposalsContainer">
      {#each proposals as proposal}
        <div class="flex justify-between proposalCard">
          <span>{proposal.proposalTitle} | Round {proposal.round}</span>
          <div class="proposalCardDescription">
            <span>${proposal.proposalFundingRequested}</span>
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
    padding-top: 60px;
  }
  .section {
    width: 100%;
    text-align: center;
    padding-bottom: 100px;
  }
  .section h2 {
    font-size: 32px;
    margin: 40px 0;
  }
  .details {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .proposalsContainer {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
    background-color: #f8fafc;
  }
  .proposalCard {
    flex-direction: column;
    background-color: rgb(212, 212, 212);
    margin-bottom: 15px;
    padding: 20px;
    border-radius: 32px;
  }
  .proposalCardDescription {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }
</style>
