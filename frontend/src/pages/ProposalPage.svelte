<script>
  import { SERVER_URI } from "../utils/config";
  import moment from 'moment';
  import { getNonce } from "../utils/helpers";
  import { userAddress, networkSigner } from "../stores/ethers";
  import Swal from "sweetalert2";
  import { signMessage } from "../utils/signatures";
  import earmarks from '../utils/types/earmark.json'
  import Section from "../components/Section.svelte";
  import DeliverablesList from "../components/DeliverablesList.svelte"

  export let proposalId;
  let proposal;

  let pageText = {
      proposalDescription: `Use the form below to submit your final deliverables and complete your proposal. This enables your project to remain in a good state, and to apply for more grants.`
    }

  async function loadData() {
    let res = await fetch(`${SERVER_URI}/app/proposalInfo/${proposalId}`);
    proposal = await res.json();
    console.log(proposal)
    console.log(proposal.proposalEarmark)
    console.log(earmarks)
  }
  loadData();

  async function withdrawProposal() {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to bla bla bla",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Proceed!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.value) {
        const signer = $userAddress;
        const nonce = await getNonce(signer);
        const message = JSON.stringify({
          proposalId: proposalId,
          nonce,
          withdraw: true,
        });
        const signedMessage = await signMessage(message, $networkSigner);
        const res = await fetch(`${SERVER_URI}/app/proposal/withdraw`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            signer,
            signedMessage,
          }),
        });
        const json = await res.json();
        if (json.success === true) {
          Swal.fire(
            "Success!",
            "You've successfully withdrawn your proposal",
            "success"
          ); // ? Popup flashes & goes away without user interaction. Looks broken. Proposal view does not render.
        } else {
          Swal.fire("Error!", "Something went wrong", "error");
        }
      }
    });
  }

  function onUpdateProposalClick() {
    location.href = "/proposal/update/" + proposalId;
  }

  function onSubmitDeliverableClick() {
    location.href = "/proposal/deliver/" + proposalId;
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

<!-- TODO - Visualize Admin: Is proposal completion submitted? Accepted? Rejected? -->
<div class="flex h-screen flex-col justify-center proposal-container">
  {#if proposal }
    <Section
            title={proposal.proposalTitle}
            description={proposal.proposalDescription}
            descriptionBottom
            descriptionTextLeft
            actions={[
            {
              "text": "Withdraw Proposal",
              "onClick":  withdrawProposal
            },{
              "text": "Update Proposal",
              "onClick":  onUpdateProposalClick
            }]}>
      <div class="details bg-slate-200 py-5 px-5">
        <div class="col-start-4 col-span-2 ...">
          <span class="detailName font-bold">Earmarks</span>
          <span class="text-lg detailValue">{earmarks[proposal.proposalEarmark]}</span>
        </div>
        <div class="col-start-7 col-span-2 ...">
          <span class="detailName font-bold">Creation date</span>
          <span class="text-lg detailValue">{moment(proposal.createdAt).format('YYYY-MM-DD')}</span>
        </div>
      </div>
    </Section>
    <Section
            title={"Complete Proposal"}
            description={pageText.proposalDescription}
            actions={[{
            "text": "Submit Deliverables",
            "onClick":  onSubmitDeliverableClick
          }]}>
      <DeliverablesList deliverables={[proposal.grantDeliverables]}/>
    </Section>
  {/if}
</div>
