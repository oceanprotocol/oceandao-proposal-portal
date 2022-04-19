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
  import CustomInput from "../components/CustomInput.svelte";

  export let proposalId;
  let proposal;
  let deliverableActions = []
  let adminDescription;
  let loading = false;
  let errorMessage = undefined;
  let selectedAction = undefined;

  async function loadData() {
    let res = await fetch(`${SERVER_URI}/app/proposal/info/${proposalId}`);
    proposal = await res.json();
    console.log(proposal)
  }
  loadData();

  async function completeProposal(proposalStatus) {
    Swal.fire({
      title: "Are you sure?",
      text: `You will ${proposalStatus===2 ? 'accept' : 'reject'} this proposal`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Proceed!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.value) {
        selectedAction = proposalStatus;
        loading = true;
        const signer = $userAddress;
        const nonce = await getNonce(signer);
        const message = JSON.stringify({
          proposalId: proposalId,
          description: adminDescription,
          nonce,
          status: proposalStatus,
        });
         let signedMessage
          try{
            signedMessage = await signMessage(message, $networkSigner);
          }catch(error){
            loading = false;
            errorMessage = error.message;
            return
          }
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
          loading = false;
          Swal.fire(
                  "Success!",
                  `You've ${proposalStatus===2 ? 'accepted' : 'rejected'} this proposal.`,
                  "success"
          ).then(() => {
            location.href = "/admin/home"
          }); // ? Popup flashes & goes away without user interaction. Looks broken. Proposal view does not render.
        } else {
          loading = false;
          Swal.fire("Error!", "Something went wrong", "error");
        }
      }
    });
  }

  function acceptProposalDeliverables() {
    completeProposal(2);
  }

  function rejectProposalDeliverables() {
    completeProposal(3);
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
  .deliverablesComparationContainer{
    width: 100%;
    display: block;
    justify-content: space-between;
  }
  :global(.deliverablesComparationContainer > div){
    flex-basis: 49%;
  }
</style>

<!-- TODO - Visualize Admin: Is proposal completion submitted? Accepted? Rejected? -->
<div class="flex h-screen flex-col justify-center proposal-container">
  {#if proposal }
    <Section
            title={proposal.proposalTitle}
            description={proposal.proposalDescription + '<br/><br/>' + proposal.discourseLink}
            descriptionTop
            actions={[
            {
              "text": "Reject",
              "onClick":  rejectProposalDeliverables,
              loading: loading && selectedAction===3,
              disabled: loading
            },{
              "text": "Accept",
              "onClick":  acceptProposalDeliverables,
              loading: loading && selectedAction===2,
              disabled: loading
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
      <div class="deliverablesComparationContainer">
        <DeliverablesList deliverables={[proposal.grantDeliverables]} title="Initial Deliverables"/>
        <DeliverablesList deliverables={[proposal.delivered.description]} title="Delivered"/>
      </div>
      <CustomInput
              label="Review Description"
              placeholder="Describe your review"
              bind:inputValue={adminDescription}
      />
      {#if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
      {/if}
    </Section>
  {/if}
</div>
