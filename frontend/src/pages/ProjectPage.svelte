<script>
  import { Link } from "svelte-navigator";
  import SvelteMarkdown from 'svelte-markdown';

  import Button from "../components/Button.svelte";
  export let projectId;
  let round = 12;
  let project = {
    projectName: "Monkey",
    projectCategory: "Outreach",
    createdAt: "11.02.2012",
    projectDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut."
  };
  let source = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.";
  let proposals = [
    {
      proposalTitle: 'Test',
      proposalEarmark: 'Outreach',
      proposalValue: '30000',
    },
    {
      proposalTitle: 'Test',
      proposalEarmark: 'Outreach',
      proposalValue: '30000',
    },
    {
      proposalTitle: 'Test',
      proposalEarmark: 'Outreach',
      proposalValue: '30000',
    },
    {
      proposalTitle: 'Test',
      proposalEarmark: 'Outreach',
      proposalValue: '30000',
    },
    {
      proposalTitle: 'Test',
      proposalEarmark: 'Outreach',
      proposalValue: '30000',
    }
  ];

  /*async function loadProject() {
    let res = await fetch(
      `http://localhost:3000/app/getProjectInfo/${projectId}`
    );
    res = await res.json();
    project = res.project;
    proposals = res.proposals;
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
    padding-top: 60px;
  }
  .section{
    width: 100%;
    text-align: center;
    padding-bottom: 100px;
  }
  .section h2{
    font-size: 32px;
    margin: 40px 0;
  }
  .description{
    margin-bottom: 40px;
    text-align: center;
  }
  .details{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .proposalsContainer{
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
  }
  .proposalCard{
    flex-direction: column;
    background-color: grey;
    margin-bottom: 15px;
    padding: 20px;
  }
  .proposalCardDescription{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }
</style>

  <div class="flex h-screen flex-col justify-center project-container">
      {#if project }
          <div class="col-start-1 col-span-2 section">
            <h2 class="text-lg font-bold">{project.projectName}</h2>
            {#if source }
              <div class="description">
                <SvelteMarkdown {source}/>
              </div>  
            {/if}
            <div class="details">
              <div class="col-start-4 col-span-2 ...">
                <span class="detailName font-bold">Earmark</span>
                <span class="text-lg detailValue">{project.projectCategory}</span>
              </div>
              <div class="col-start-4 col-span-2 ...">
                <span class="detailName font-bold">Round</span>
                <span class="text-lg detailValue">{round}</span>
              </div>
              <div class="col-start-7 col-span-2 ...">
                <span class="detailName font-bold">Creation date</span>
                <span class="text-lg detailValue">{project.createdAt}</span>
              </div>
            </div>
          </div>
      {/if}

      <div class="section">
        <h2 class="text-lg font-bold title">Submit Proposal</h2>
        <div class="description">
            <p>{source}</p>
        </div>
        <Button
          text={"Create proposal"}
          onclick={() => {
            location.href = "/proposal/create/" + projectId;
          }}
        />  
      </div>

      <div class="section">
        <h2 class="text-lg font-bold title">Project Proposals</h2>
        <div class="description">
            <p>{source}</p>
        </div>
        <div class="proposalsContainer">
        {#each proposals as proposal}
          <div class="flex justify-between proposalCard">
            <span>{proposal.proposalTitle}</span>
            <div class="proposalCardDescription">
              <span>{proposal.proposalEarmark}</span>
              <span>{proposal.proposalValue}</span>
            </div>
            <Link
              class="font-bold text-lg text-blue-600"
              to={`/proposal/view/${proposal._id}`}>{proposal.proposalTitle}</Link
            >
          </div>
          {/each}
        </div>
      </div>
  </div>
