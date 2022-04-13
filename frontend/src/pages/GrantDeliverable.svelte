<script>
  import LargeTextField from "../components/LargeTextField.svelte";
  import { SERVER_URI } from "../utils/config";
  import { signMessage } from "../utils/signatures";
  import { networkSigner, userAddress } from "../stores/ethers";
  import { getNonce } from "../utils/helpers";
  import Button from "../components/Button.svelte";
  import Swal from "sweetalert2";
  import Section from "../components/Section.svelte";
  import { createForm } from "svelte-forms-lib";
  import * as yup from 'yup';

  let loading=false;
  let errorMessage=undefined;

  async function submitDeliverables() {
    console.log('herre')
    Swal.fire({
      title: "Are you sure?",
      text: "Your deliverables will go under review.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Proceed!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.value) {
          loading=true;
          const signer = $userAddress;
          const nonce = await getNonce(signer);
          console.log('herre')
          const message = JSON.stringify({
            proposalId: proposalId,
            description: values.value,
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
            loading=false;
          }
      }
    });
  }

  export let proposalId;
  let loaded = false;
  const isUpdating = proposalId !== undefined;
  let proposalData;

  const { form, errors, handleChange, handleSubmit, values, changeValue } = createForm({
    initialValues: {
      deliverables: ''
    },
    validationSchema: yup.object().shape({
      deliverables: yup.string().required("Deliverables are required")
    }),
    onSubmit: values => {
      submitDeliverables(values)
    }
  })

  fetch(`${SERVER_URI}/app/proposal/info/${proposalId}`)
    .then((res) => res.json())
    .then((res) => {
      $form.deliverables = res.grantDeliverables;
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
  .button-container{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
</style>

<div class="deliverables-container">
  <Section
      class="flex text-left bg-grey-200"
      title={"Deliverables"}
      descriptionTextLeft
  >
    {#if loaded == false}
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    {:else}
      <form on:submit={handleSubmit}>
        <LargeTextField 
          bind:value={$form.deliverables}
          placeHolder={"Description"} 
          name={"deliverables"}
          disabled={false}
          error={$errors.deliverables}
          handleChange={handleChange}
        />
        <div class="button-container">
          <Button
            type="submit"
            text="Submit"
            loading={loading}
            disabled={loading}
          />
        </div>
      </form>
    {/if}
    {#if errorMessage}
      <p class="text-red-500">{errorMessage}</p>
    {/if}
  </Section>
</div>
