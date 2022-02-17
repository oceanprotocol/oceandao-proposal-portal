<script>
  import { SERVER_URI } from "../utils/config";
  export let proposalId;
  let proposal;
  import { getNonce } from "../utils/helpers";
  import { userAddress, networkSigner } from "../stores/ethers";
  import Button from "../components/Button.svelte";
  import Swal from "sweetalert2";
  import { signMessage } from "../utils/signatures";
  async function loadData() {
    let res = await fetch(`${SERVER_URI}/app/proposalInfo/${proposalId}`);
    proposal = await res.json();
  }

  loadData();
</script>

<div class="flex h-screen justify-center">
  <div class="m-auto flex justify-center flex-col w-4/5">
    <p>{JSON.stringify(proposal)}</p>

    <div class="flex justify-center space-x-5">
      <Button
        onclick={() =>
          Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to bla bla bla",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Proceed!",
            cancelButtonText: "Cancel",
          }).then(async (result) => {
            if (result.value) {
              const { value: text } = await Swal.fire({
                input: "textarea",
                inputLabel: "Message",
                inputPlaceholder: "Type your description here...",
                inputAttributes: {
                  "aria-label": "Type your description here",
                },
                showCancelButton: true,
              });
              if (text) {
                const signer = $userAddress;
                const nonce = await getNonce(signer);
                const message = JSON.stringify({
                  proposalId: proposalId,
                  description: text,
                  nonce,
                });
                const signedMessage = await signMessage(
                  message,
                  $networkSigner
                );
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
                } else {
                  Swal.fire("Error!", "Something went wrong", "error");
                }
              }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
            }
          })}
        text={`Complete proposal`}
      />
      <Button
        onclick={() =>
          (window.location.href = `/proposal/update/${proposalId}`)}
        text={`Update proposal`}
      />
      <Button color={"red"} text={`Withdraw proposal`} />
    </div>
  </div>
</div>
