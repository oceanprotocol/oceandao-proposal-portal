<script>
  import TextField from "../components/TextField.svelte";
  import LargeTextField from "../components/LargeTextField.svelte";
  import OptionSelect from "../components/OptionSelect.svelte";
  import { proposal as proposalStore } from "../stores/proposal";
  import { SERVER_URI, RECAPTCHA_KEY } from "../utils/config";
  import { signMessage } from "../utils/signatures";
  import { networkSigner, userAddress } from "../stores/ethers";
  import { getNonce } from "../utils/helpers";
  import Recaptcha from "../components/Recaptcha.svelte";
  import Button from "../components/Button.svelte";

  export let projectId;
  export let proposalId;
  const isUpdating = proposalId !== undefined;
  let loaded = !isUpdating;
  let part = 0;
  let recaptcha;
  let errortext;

  if (isUpdating) {
    fetch(`${SERVER_URI}/app/proposal/info/${proposalId}`)
      .then((res) => res.json())
      .then((res) => {
        proposalStore.update(() => res);
        loaded = true;
      });
  }

  const partTitles = ["Part 1 - Proposal Details"];

  let fieldsPart0 = [
    {
      type: "text",
      title: "Proposal Title",
      bindValue: "proposalTitle",
      required: true,
      wrong: false,
      disabled: isUpdating,
    },
    {
      type: "optionSelect",
      title: "What Earmark are you applying to?",
      bindValue: "proposalEarmark",
      wrong: false,
      required: true,
      options: [
        {
          value: "coretech",
          text: "Core-Tech",
        },
        {
          value: "general",
          text: "General",
        },
      ],
    },
    {
      type: "text",
      title: "Proposal in one sentence",
      bindValue: "oneLiner",
      required: true,
      wrong: false,
    },
    {
      type: "largeText",
      title: "Proposal Description",
      bindValue: "proposalDescription",
      rows: 10,
      placeHolder: `Description of the proposal.`,
    },
    {
      type: "largeText",
      title: "Grant Deliverables",
      bindValue: "grantDeliverables",
      required: true,
      placeHolder: `__(Grant Deliverable 1)__
__(Grant Deliverable 2)__
__(Grant Deliverable 3)__`,
      wrong: false,
    },
    {
      type: "largeText",
      title: "Value Add Criteria",
      bindValue: "valueAddCriteria",
      required: true,
      placeHolder: `How does the project and proposal add value to Ocean ecosystem?
Usage of Ocean — how well might the project drive usage of Ocean?
Viability — what is the chance of success of the project?
Community Engagement — How active is the team in the community?
Community Value — How does the project add value to the overall Ocean Community / Ecosystem?`,
      wrong: false,
    },
    {
      type: "text",
      title: "Funding Requested (USD)",
      bindValue: "proposalFundingRequested",
      wrong: false,
      required: true,
      textFormat: "number",
      importantText:
        "The amount requested is in USD, but the amount paid is in OCEAN token. The conversion rate is calculated at Vote End, so payment is completed as quickly as possible. This determines how many OCEAN will be awarded if a proposal is voted to receive a grant.",
    },
    {
      type: "text",
      title: "Proposal Wallet Address",
      bindValue: "proposalWalletAddress",
      placeHolder: "0x...",
      wrong: false,
      required: true,
      importantText:
        "Must have minimum 500 OCEAN in wallet to be eligible. This wallet is where you will receive the grant amount if selected",
    },
  ];

  let fields = [fieldsPart0];

  // Add required fields
  function requiredFields(field) {
    field.placeHolder =
      field.placeHolder == null ? field.title : field.placeHolder;
    field.title = field.required ? "* " + field.title : field.title;
  }

  fields.map((fieldPart) => {
    fieldPart.map((field) => {
      requiredFields(field);
    });
  });

  function back() {
    if (part !== 0) {
      part = part - 1;
    }
  }

  async function submitProposal() {
    errortext = null;
    const recaptchaToken = await recaptcha.getCaptcha();
    fieldsPart0.map((field) => {
      if (field.required) {
        if (
          $proposalStore[field.bindValue] == null ||
          $proposalStore[field.bindValue] == ""
        ) {
          field.wrong = true;
          field.wrongText = "This field is required";
        } else {
          field.wrong = false;
        }
      }
    });
    fields = [fieldsPart0];
    if (fieldsPart0.filter((field) => field.wrong).length !== 0) return;

    const nonce = await getNonce($userAddress);
    const proposalObject = {
      proposalTitle: $proposalStore.proposalTitle,
      proposalEarmark: $proposalStore.proposalEarmark,
      oneLiner: $proposalStore.oneLiner,
      proposalDescription: $proposalStore.proposalDescription,
      grantDeliverables: $proposalStore.grantDeliverables,
      proposalFundingRequested: $proposalStore.proposalFundingRequested,
      proposalWalletAddress: $proposalStore.proposalWalletAddress,
      valueAddCriteria: $proposalStore.valueAddCriteria,
      projectId: projectId,
      proposalId: proposalId,
      nonce: nonce,
    };

    const proposalJson = JSON.stringify(proposalObject);
    const signedMessage = await signMessage(proposalJson, $networkSigner);
    const signer = $userAddress;

    if (isUpdating) {
      fetch(`${SERVER_URI}/app/proposal/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: proposalJson,
          signedMessage: signedMessage,
          signer: signer,
          recaptchaToken: recaptchaToken,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.text();
        })
        .then((data) => {
          if (data.success) {
            alert("Proposal updated successfully");
            window.location.href = `/proposal/view/${proposalId}`;
          } else {
            alert("Error updating proposal");
            try {
              data = JSON.parse(data);
              errortext = data.message && data;
            } catch (e) {
              errortext = data;
            }
            console.error(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      fetch(`${SERVER_URI}/app/project/createProposal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: proposalJson,
          signedMessage: signedMessage,
          signer: signer,
          recaptchaToken: recaptchaToken,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.text();
        })
        .then((data) => {
          if (data.success) {
            alert("Proposal created successfully");
            window.location.href = `/project/${projectId}`;
          } else {
            alert("Error creating proposal");
            try {
              data = JSON.parse(data);
              errortext = data.message && data;
            } catch (e) {
              errortext = data;
            }
            console.error(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
</script>

<Recaptcha bind:this={recaptcha} />

<div class="flex h-screen mt-10 justify-center w-full">
  <div class="w-full max-w-3xl m-auto">
    <p class="text-lg font-bold text-center">
      Proposals must meet the
      <a
        class="link"
        target="_blank"
        href="https://github.com/oceanprotocol/oceandao/wiki/project-criteria"
      >
        Project Submission Criteria
      </a>
      .
    </p>

    {#if loaded == false}
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    {:else}
      <form
        id="proposalForm"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 "
      >
        <p class="text-xl font-bold mb-2 opacity-90">{partTitles[part]}</p>
        {#each fields[part] as field}
          {#if field.type === "title"}
            <p class="text-lg font-bold mb-2 opacity-90">{field.title}</p>
          {/if}
          {#if field.type === "line"}
            <hr />
          {/if}

          {#if field.type === "text"}
            <TextField
              bind:value={$proposalStore[field.bindValue]}
              title={field.title}
              placeHolder={field.placeHolder}
              disabled={field.disabled}
              wrong={field.wrong}
              wrongText={field.wrongText}
              textFormat={field.textFormat}
              importantText={field.importantText}
            />
          {/if}
          {#if field.type === "largeText"}
            <LargeTextField
              bind:value={$proposalStore[field.bindValue]}
              title={field.title}
              placeHolder={field.placeHolder}
              disabled={field.disabled}
              wrong={field.wrong}
              wrongText={field.wrongText}
              rows={field.rows}
            />
          {/if}
          {#if field.type === "optionSelect"}
            <OptionSelect
              bind:value={$proposalStore[field.bindValue]}
              title={field.title}
              placeHolder={field.placeHolder}
              disabled={field.disabled}
              wrong={field.wrong}
              wrongText={field.wrongText}
              options={field.options}
            />
          {/if}
        {/each}
        <p>* Required Fields</p>
        <div class="flex items-center justify-between">
          <div class="flex space-x-2">
            {#each Array(1) as _, i}
              <div
                style="width:{i === part
                  ? '40px'
                  : '20px'}; height:5px; background-color: {i < part
                  ? 'rgb(29 78 216)'
                  : i == part
                  ? 'rgb(29 78 216)'
                  : 'grey'}; border-radius:32px"
              />
            {/each}
          </div>
          {#if errortext}
            <div class="text-red-500">{errortext}</div>
          {/if}
          <div class="flex space-x-2">
            {#if part > 0}
              <Button text="Back" onclick={() => back()} />
              <button
                on:click={back}
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Back
              </button>
            {/if}
            <Button
              text={isUpdating ? "Update project" : "Submit Proposal"}
              onclick={() => submitProposal()}
            />
          </div>
        </div>
      </form>
    {/if}
  </div>
</div>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .link {
    color: var(--brand-color-primary);
  }
</style>
