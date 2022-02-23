<script>
  import LargeTextField from "../components/LargeTextField.svelte";
  import { SERVER_URI } from "../utils/config";
  import { signMessage } from "../utils/signatures";
  import { networkSigner, userAddress } from "../stores/ethers";
  import { getNonce } from "../utils/helpers";
  import Button from "../components/Button.svelte";
  import Swal from "sweetalert2";

  async function submitDeliverables() {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to bla bla bla",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Proceed!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.value) {
        if (value) {
          const signer = $userAddress;
          const nonce = await getNonce(signer);
          const message = JSON.stringify({
            proposalId: proposalId,
            description: value,
            nonce,
          });
          const signedMessage = await signMessage(message, $networkSigner);
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
            );
            window.location.href = "/proposal/view/" + proposalId;
          } else {
            Swal.fire("Error!", "Something went wrong", "error");
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
  fetch(`${SERVER_URI}/app/proposalInfo/${proposalId}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      value = res.grantDeliverables;
      proposalData = res;
      loaded = true;
    });
</script>

<div class="flex h-screen mt-10 justify-center w-full">
  <div class="w-full max-w-3xl m-auto">
    {#if loaded == false}
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    {:else}
      <LargeTextField
        placeHolder="Description"
        title="Deliverables"
        bind:value
      />
      <Button onclick={() => submitDeliverables()} text="Submit" />
    {/if}
  </div>
</div>
