<script>
  import { SERVER_URI } from "../utils/config";
  import moment from 'moment';
  import { Link } from "svelte-navigator";
  import earmark from '../utils/types/earmark.json'
  import Button from "../components/Button.svelte";
  import Section from "../components/Section.svelte";
  import DeliverablesList from "../components/DeliverablesList.svelte"

  export let proposalId;
  let proposal;

  // let proposal = {
  //    proposalName: "Monkey",
  //    proposalCategory: "Outreach",
  //    createdAt: "11.02.2012",
  //    proposalDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut."
  //  };

   let deliverables = [
     {
       name: "Deliverable 1",
       description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut."
     },
     {
       name: "Deliverable 2",
       description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut."
     },
     {
       name: "Deliverable 3",
       description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut."
     }
   ]

  async function loadData() {
    let res = await fetch(`${SERVER_URI}/app/proposalInfo/${proposalId}`);
    console.log(res);
    proposal = await res.json();
  }
  loadData();

  function onCreateProposalClick() {
    location.href = "/proposal/create/" + proposalId;
  }

  function onUpdateProposalClick() {
    location.href = "/proposal/create/" + proposalId;
  }

  function onWithdrawProposalClick() {
    location.href = "/proposal/create/" + proposalId;
  }

  function onSubmitDeliverableClick() {
    location.href = "/proposal/create/" + proposalId;
  }
</script>

<style>
  .proposal-container{
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

<div class="flex h-screen flex-col justify-center proposal-container">
    {#if proposal }
        <Section
          title={proposal.proposalTitle}
          description={"Create and manage proposals below in order to submit them to OceanDAO Seed Grants. You can only have 1 proposal per project, for each funding round."}
          actions={[
            {
              "text": "Withdraw Proposal",
              "onClick":  onWithdrawProposalClick,
              "color": "blue"
            },
            {
              "text": "Update Proposal",
              "onClick":  onUpdateProposalClick
            },
            {
              "text": "Submit Deliverable",
              "onClick":  onSubmitDeliverableClick
            }
          ]}
        >
          <div class="details bg-slate-200 py-5 px-5">
            <div class="col-start-4 col-span-2 ...">
              <span class="detailName font-bold">Category</span>
              <span class="text-lg detailValue">{earmark[proposal.proposalEarmark]}</span>
            </div>
            <div class="col-start-7 col-span-2 ...">
              <span class="detailName font-bold">Creation date</span>
              <span class="text-lg detailValue">{moment(proposal.createdAt).format('YYYY-MM-DD')}</span>
            </div>
          </div>
          <div class="bg-slate-100 text-left">
            {@html proposal.proposalDescription}
          </div>
      </Section>
    {/if}
    {#if proposal && proposal.delivered == false}
        <Section title={"Deliverables Submitted"} class="bg-yellow-200">
            {@html proposal.delivered.description}
        </Section>
    {/if}
    {#if proposal && proposal.delivered == true}
        <Section title={"Proposal Completed"} class="bg-yellow-200">
            {@html proposal.delivered.description}
        </Section>
    {/if}
</div>
