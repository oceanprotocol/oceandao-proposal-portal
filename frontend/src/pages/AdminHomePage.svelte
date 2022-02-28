<script>
  import { userAddress, networkSigner } from "../stores/ethers";
  import Button from "../components/Button.svelte";
  import { SERVER_URI } from "../utils/config";
  import ProjectItemsList from "../components/ProjectItemsList.svelte";
  import Section from "../components/Section.svelte";
  import ListWithActions from "../components/ListWithActions.svelte";

  let unacceptedProposals;
  let unacceptedCoreTechProposals;

  async function fetchUnacceptedProposals() {
    const res = await fetch(`${SERVER_URI}/app/admin/getUnacceptedProposals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    unacceptedProposals = data.proposals;

    console.log(unacceptedProposals)
  }

  async function fetchCoreTechUnacceptedProposals() {
    const res = await fetch(`${SERVER_URI}/app/admin/getProposalEarmarkRequest`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    unacceptedCoreTechProposals = data.proposals;

    console.log(unacceptedCoreTechProposals)
  }

  fetchUnacceptedProposals();
  fetchCoreTechUnacceptedProposals();

  function onReviewProposalClick(proposalId) {
    location.href = `/admin/acceptProposal/${proposalId}`;
  }
  function onReviewCoreTechClick() {
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
    title={"Completed Proposals"}
    description={"Below are all the proposals that completed. Admins must mark them as reviewed before projects make it into the next funding round. This needs to be accepted by an admin before Voting Starts."}
    >
    {#if unacceptedProposals}
      <ListWithActions 
        proposals={unacceptedProposals} 
        actions={[
            {
                "text": "Review",
                "onClick": onReviewProposalClick
            }
        ]}
    />
    {/if}
  </Section>
  <Section class="flex text-left bg-grey-200"
    title={"Core-Tech Earmarks"}
    description={"All Proposals that apply to the Core-Tech Earmark must receive clearance by the Core-Tech WG. This needs to be accepted by an Admin before Voting Starts."}
    >
    {#if unacceptedCoreTechProposals}
      <ListWithActions 
        proposals={unacceptedCoreTechProposals}
        actions={[
            {
                "secondary": true,
                "disabled": true,
                "fieldName": "proposalEarmark",
                "onClick": {}
            },
            {
                "text": "Review",
                "disabled": false,
                "onClick": {onReviewCoreTechClick}
            }
        ]}
       />
    {/if}
  </Section>
</div>
