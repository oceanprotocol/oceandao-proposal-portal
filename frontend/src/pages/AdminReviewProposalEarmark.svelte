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
  let loading = false;
  let errorMessage = undefined;
  let selectedAction = undefined;

  async function loadData() {
    let res = await fetch(`${SERVER_URI}/app/proposal/info/${proposalId}`);
    const responseJson = await res.json();
    proposal = responseJson.proposal
  }
  loadData();

  async function setProposalEarmark(newEarmark) {
    Swal.fire({
      title: "Are you sure?",
      text: `You will ${newEarmark==='coretech' ? 'Accept' : 'Reject'} this proposal as Core Tech`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Proceed!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.value) {
        selectedAction = newEarmark;
        loading = true;
        const signer = $userAddress;
        const nonce = await getNonce(signer);
        const message = JSON.stringify({
          proposalId: proposalId,
          earmark: newEarmark,
          nonce
        });
        let signedMessage
          try{
            signedMessage = await signMessage(message, $networkSigner);
          }catch(error){
            loading = false;
            errorMessage = error.message;
            return
          }
        const res = await fetch(`${SERVER_URI}/app/admin/setProposalEarmark`, {
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
                  `You've ${newEarmark==='coretech' ? 'Accepted' : 'Rejected'} this proposal as part of the Core-Tech earmark`,
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

  function acceptProposalEarmark() {
    // Accept and use the requested earmark
    setProposalEarmark(proposal.proposalEarmarkRequest);
  }

  function rejectProposalEarmark() {
    // Use the underlying, preset earmark (i.e. new team)
    setProposalEarmark(proposal.proposalEarmark);
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
            description={proposal.proposalDescription + '<br/><br/>' + proposal.discourseLink}
            descriptionBottom
            actions={[
            {
              "text": "Accept",
              "onClick":  acceptProposalEarmark,
              loading: loading && selectedAction==='coretech',
              disabled: loading
            },{
              "text": "Reject",
              "onClick":  rejectProposalEarmark,
              loading: loading && selectedAction===proposal.proposalEarmark,
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
      {#if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
      {/if}
    </Section>
  {/if}
</div>
