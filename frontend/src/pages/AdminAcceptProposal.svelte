<script>
  import {SERVER_URI} from "../utils/config";
  import moment from 'moment';
  import {getNonce} from "../utils/helpers";
  import {userAddress, networkSigner} from "../stores/ethers";
  import Swal from "sweetalert2";
  import {signMessage} from "../utils/signatures";
  import earmarks from '../utils/types/earmark.json'
  import Section from "../components/Section.svelte";
  import AdminEarmarkStatus from "../components/AdminEarmarkStatus.svelte";
  import AdminDeliverableStatus from "../components/AdminDeliverableStatus.svelte";
  import DeliverablesList from "../components/DeliverablesList.svelte";

  export let proposalId;
  let proposal;
  let deliverableActions = []

  let pageText = {
    proposalDescription: `Use the form below to submit your final deliverables and complete your proposal. This enables your project to remain in a good state, and to apply for more grants.`,
    submissionDescription: `Thank you for submitting your deliverables. Our admins are reviewing your update, and will provide an update soon.`
  }

  async function loadData() {
    let res = await fetch(`${SERVER_URI}/app/proposalInfo/${proposalId}`);
    proposal = await res.json();

    if( proposal ) {
      if( proposal.delivered.status === 0 || proposal.delivered.status === 2 ) {
        deliverableActions = [{
          "text": "Submit Deliverables",
          "onClick": onSubmitDeliverableClick
        }]
      }
    }
  }
  loadData();

  async function acceptProposal() {
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
        const res = await fetch(`${SERVER_URI}/app/admin/completeProposal`, {
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
    background-color: var(--background-grey-dimmed);
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
            description={"Above are all the proposals deliverables Admins must mark them as reviewed before projects make it into the next funding round. This needs to be accepted by an admin before Voting Starts."}
            descriptionBottom
            actions={[
            {
              "text": "Accept",
              "onClick":  acceptProposal
            },{
              "text": "Reject",
              "onClick":  onUpdateProposalClick
            }]}>
      <div class="details py-5 px-5">
        <div class="col-start-4 col-span-2 ...">
          <span class="detailName font-bold">Earmarks</span>
          <span class="text-lg detailValue">{earmarks[proposal.proposalEarmark]}</span>
        </div>
        <div class="col-start-7 col-span-2 ...">
          <span class="detailName font-bold">Creation date</span>
          <span class="text-lg detailValue">{moment(proposal.createdAt).format('YYYY-MM-DD')}</span>
        </div>
      </div>
      <DeliverablesList deliverables={[proposal.grantDeliverables]}/>
      <AdminEarmarkStatus proposalEarmarkRequest={proposal.proposalEarmarkRequest}/>
    </Section>
  {/if}
</div>
