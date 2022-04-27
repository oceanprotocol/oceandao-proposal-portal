<script>
  import LargeTextField from "../components/LargeTextField.svelte";
  import { SERVER_URI } from "../utils/config";
  import { signMessage } from "../utils/signatures";
  import { networkSigner, userAddress } from "../stores/ethers";
  import { getNonce } from "../utils/helpers";
  import Button from "../components/Button.svelte";
  import Swal from "sweetalert2";
  import Section from "../components/Section.svelte";

  let loading=false;
  let errorMessage=undefined;

  async function submitDeliverables() {
    Swal.fire({
      title: "Are you sure?",
      text: "Your deliverables will go under review.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Proceed!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.value) {
        if (value) {
          loading=true;
          const signer = $userAddress;
          const nonce = await getNonce(signer);
          const message = JSON.stringify({
            proposalId: proposalId,
            description: value,
            nonce,
          });
          let signedMessage
          try{
            signedMessage = await signMessage(message, $networkSigner);
          }catch(error){
            loading = false;
            errorMessage = error.message;
            return
          }
          const res = await fetch(`${SERVER_URI}/app/proposal/deliver`, {
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
              "Your submission has been sent, it will be visible once it is confirmed by one of the moderators", //TODO CHANGE THIS TEXT
              "success"
            ).then(() => {
              loading=false;
              window.location.href = "/";
            });
          } else {
            Swal.fire("Error!", "Something went wrong", "error");
            errorMessage=json.error
            loading=false;
          }
        }
      }
    });
  }

  export let proposalId;
  $: value = "";
  let loaded = false;
  const isUpdating = proposalId !== undefined;
  let proposalData;
  fetch(`${SERVER_URI}/app/proposal/info/${proposalId}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      value = res.grantDeliverables;
      proposalData = res;
      loaded = true;
    });
</script>

<style>
  .deliverables-container {
    height: 100%;
    max-width: 800px;
    flex-direction: column;
    margin: auto;
    padding-top: var(--spacer);
  }
</style>

<div class="deliverables-container">
  <Section
          class="flex text-left bg-grey-200"
          title={"Deliverables"}
          descriptionTextLeft
          actions={[
      {
        text: "Submit",
        onClick: submitDeliverables,
        loading: loading,
        disabled: loading
      },
    ]}
  >
    {#if loaded == false}
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    {:else}
      <LargeTextField placeHolder="Description" bind:value />
    {/if}
    {#if errorMessage}
      <p class="text-red-500">{errorMessage}</p>
    {/if}
  </Section>
</div>
