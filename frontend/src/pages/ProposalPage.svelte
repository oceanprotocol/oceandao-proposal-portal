<script>
  import { SERVER_URI } from "../utils/config";
  import moment from 'moment';
  import { Link } from "svelte-navigator";
  import earmarks from '../utils/types/earmark.json'
  import Button from "../components/Button.svelte";
  import Section from "../components/Section.svelte";
  import DeliverablesList from "../components/DeliverablesList.svelte"

  export let proposalId;
  let proposal;

  let pageText = {
      proposalDescription: `Create and manage proposals below in order to submit them to OceanDAO Seed Grants.
  You can only have 1 proposal per project, for each funding round.`
    }

  async function loadData() {
    let res = await fetch(`${SERVER_URI}/app/proposalInfo/${proposalId}`);
    proposal = await res.json();
    console.log(proposal)
    console.log(proposal.proposalEarmark)
    console.log(earmarks)
  }

  loadData();

  function onCreateProposalClick() {
    location.href = "/proposal/create/" + proposalId;
  }

  function onUpdateProposalClick() {
    location.href = "/proposal/update/" + proposalId;
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
          description={proposal.proposalDescription}
          descriptionBottom
          actions={[]}
        >
          <div class="details bg-slate-200 py-5 px-5">
            <div class="col-start-4 col-span-2 ...">
              <span class="detailName font-bold">Category</span>
              <span class="text-lg detailValue">{earmarks[proposal.proposalEarmark]}</span>
            </div>
            <div class="col-start-7 col-span-2 ...">
              <span class="detailName font-bold">Creation date</span>
              <span class="text-lg detailValue">{moment(proposal.createdAt).format('YYYY-MM-DD')}</span>
            </div>
          </div>
      </Section>
      <Section
          title={"Manage Proposal"}
          description={pageText.proposalDescription}
          actions={[
            {
              "text": "Create Proposal",
              "onClick":  onCreateProposalClick
            },
            {
              "text": "Update Proposal",
              "onClick":  onUpdateProposalClick
            },
            {
              "text": "Withdraw Proposal",
              "onClick":  onWithdrawProposalClick
            }
          ]}
      />
      <Section
          title={"Submit Deliverable"}
          description={pageText.proposalDescription}
          actions={[{
            "text": "Submit Deliverable",
            "onClick":  onSubmitDeliverableClick
          }]}
      >
        <DeliverablesList deliverables={[proposal.grantDeliverables]}/>
      </Section>
       {/if}
</div>
