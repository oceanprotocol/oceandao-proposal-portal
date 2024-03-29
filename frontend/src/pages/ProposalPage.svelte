<script>
  import { SERVER_URI } from "../utils/config";
  import moment from "moment";
  import { getNonce } from "../utils/helpers";
  import { userAddress, networkSigner } from "../stores/ethers";
  import Swal from "sweetalert2";
  import { signMessage } from "../utils/signatures";
  import earmarks from "../utils/types/earmark.json";
  import Section from "../components/Section.svelte";
  import AdminEarmarkStatus from "../components/AdminEarmarkStatus.svelte";
  import AdminDeliverableStatus from "../components/AdminDeliverableStatus.svelte";

  export let proposalId;
  let proposal;
  let proposalActions = [];
  let deliverableActions = [];
  let loading = false;
  let errorMessage = undefined;

  let pageText = {
    proposalDescription: `Use the form below to submit your final deliverables and complete your proposal. This enables your project to remain in a good state, and to apply for more grants.`,
    submissionDescription: `Thank you for submitting your deliverables. Our admins are reviewing your update, and will provide an update soon.`,
  };

  async function loadData() {
    let res = await fetch(`${SERVER_URI}/app/proposal/info/${proposalId}`);
    const data = await res.json();
    proposal = data.proposal;

    // TODO - GET Project + Show: Category, Project Name | Proposal Name | Round Number
    if (proposal) {
      if (proposal.delivered.status === 0 || proposal.delivered.status === 3) {
        deliverableActions = [
          {
            text: "Submit Deliverables",
            onClick: onSubmitDeliverableClick,
            disabled: loading,
          },
        ];
      }
    }
  }
  loadData();

  async function withdrawProposal() {
    Swal.fire({
      title: "Are you sure?",
      text: "You cannot revert this action. Your proposal will be withdrawn from the Funding Round.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Proceed!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.value) {
        loading = true;
        const signer = $userAddress;
        const nonce = await getNonce(signer);
        const message = JSON.stringify({
          proposalId: proposalId,
          nonce,
          withdraw: true,
        });
        let signedMessage;
        try {
          signedMessage = await signMessage(message, $networkSigner);
        } catch (error) {
          loading = false;
          errorMessage = error.message;
          return;
        }
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
          loading = false;
          Swal.fire(
            "Success!",
            "You've successfully withdrawn your proposal",
            "success"
          ); // ? Popup flashes & goes away without user interaction. Looks broken. Proposal view does not render.
        } else {
          loading = false;
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

<!-- TODO - Visualize Admin: Is proposal completion submitted? Accepted? Rejected? -->
<div class="flex h-screen flex-col justify-center proposal-container">
  {#if proposal}
    <Section
      title={proposal.proposalTitle}
      description={proposal.proposalDescription}
      descriptionBottom
      actions={[
        {
          text: "Withdraw Proposal",
          onClick: withdrawProposal,
          loading: loading,
          disabled: loading,
        },
        {
          text: "Update Proposal",
          onClick: onUpdateProposalClick,
          disabled: loading,
        },
      ]}
    >
      <div class="details py-5 px-5">
        <div class="col-start-4 col-span-2 ...">
          <span class="detailName font-bold">Earmarks</span>
          <span class="text-lg detailValue"
            >{earmarks[proposal.proposalEarmark]}</span
          >
        </div>
        <div class="col-start-7 col-span-2 ...">
          <span class="detailName font-bold">Creation date</span>
          <span class="text-lg detailValue"
            >{moment(proposal.createdAt).format("YYYY-MM-DD")}</span
          >
        </div>
      </div>
      <AdminEarmarkStatus
        proposalEarmarkRequest={proposal.proposalEarmarkRequest}
      />
      {#if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
      {/if}
    </Section>
  {/if}
  {#if proposal}
    <Section
      title={"Complete Proposal"}
      description={pageText.proposalDescription}
      actions={deliverableActions}
    >
      <AdminDeliverableStatus
        deliverableStatus={proposal.delivered.status}
        adminDescription={proposal.delivered.adminDescription}
      />
    </Section>
  {/if}
</div>

<style>
  .proposal-container {
    height: 100%;
    max-width: 800px;
    margin: auto;
    padding-top: var(--spacer);
  }
  .details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--background-grey-dimmed);
  }
  .detailName,
  .detailValue {
    font-size: var(--font-size-normal);
  }
</style>
