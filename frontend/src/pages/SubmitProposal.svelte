<script>
  import TextField from "../components/TextField.svelte";
  import LargeTextField from "../components/LargeTextField.svelte";
  import OptionSelect from "../components/OptionSelect.svelte";
  import { proposal } from "../store.js";
  import "bytemd/dist/index.min.css";

  let part = 0;

  const partTitles = [
    "Part 1 - Proposal Details",
    "Congratulations",
  ];

  let fieldsPart0 = [
    {
      type: "text",
      title: "Name of Project",
      bindValue: "projectName",
      required: true,
      wrong: false,
    },
    {
      type: "optionSelect",
      title: "What Earmark are you applying to?",
      bindValue: "proposalEarmark",
      wrong: false,
      required: true,
      options: [
        {
          value: "newproject",
          text: "New Project",
        },
        {
          value: "newprojectoutreach",
          text: "New Project Outreach",
        },
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
      title: "Value-Add criteria description",
      bindValue: "valueAddCriteria",
      required: true,
      placeHolder:
        "Description of how the project adds value to Ocean ecosystem",
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
  function requiredFields (field) {
    field.placeHolder = field.placeHolder == null ? field.title : field.placeHolder;
    field.title = field.required ? "* " + field.title : field.title;
  }
  fields.map(fieldPart => {
    fieldPart.map(field => {
      requiredFields(field)
    })
  })

  function next() {
    if (part < 2) {
      part = part + 1;
    }
  }
  function back() {
    if (part !== 0) {
      part = part - 1;
    }
  }
</script>

<div class="flex h-screen mt-10 justify-center w-full">
  <div class="w-full max-w-3xl m-auto">
    <p class="text-lg font-bold text-center">
      Projects must meet the <a
        class="text-blue-600"
        target="_blank"
        href="https://github.com/oceanprotocol/oceandao/wiki/project-criteria"
        >Project Submission Criteria</a
      >.
    </p>
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
            bind:value={$proposal[field.bindValue]}
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
            bind:value={$proposal[field.bindValue]}
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
            bind:value={$proposal[field.bindValue]}
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
          {#each Array(2) as _, i}
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
        <div class="flex space-x-2">
          {#if part > 0}
            <button
              on:click={back}
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Back
            </button>
          {/if}
          <button
            on:click={next}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            {#if part < 1}
              Submit Proposal
            {/if}
            {#if part == 1}
              Congratulations
            {/if}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
