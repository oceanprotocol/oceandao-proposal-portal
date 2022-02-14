<script>
  import TextField from "../components/TextField.svelte";
  import LargeTextField from "../components/LargeTextField.svelte";
  import OptionSelect from "../components/OptionSelect.svelte";
  import { networkSigner, userAddress } from "../stores/ethers";
  import { signMessage } from "../utils/signatures";
  import { proposal } from "../store.js";
  import "bytemd/dist/index.min.css";

  let part = 0;

  const partTitles = [
    "Part 1 - Proposal Submission (Mandatory)",
    "Part 2 - Team",
    "Part 3 - Proposal Details (Recommended)",
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
      type: "text",
      title: "Project in one sentence",
      bindValue: "oneLiner",
      required: true,
      wrong: false,
    },
    {
      type: "largeText",
      title: "Project Description",
      bindValue: "projectDescription",
      required: true,
      placeHolder: "Description of the project and what problem is it solving",
      wrong: false,
    },
    {
      type: "largeText",
      title: "Value add criteria description",
      bindValue: "valueAddCriteria",
      required: true,
      placeHolder:
        "Description of how the project adds value to Ocean ecosystem",
      wrong: false,
    },
    {
      type: "optionSelect",
      title: "Project Category",
      bindValue: "projectCategory",
      wrong: false,
      required: true,
      options: [
        {
          value: "build",
          text: "Build / improve applications or integrations to Ocean",
        },
        {
          value: "outreach",
          text: "Outreach / community / spread awareness (grants don't need to be technical in nature)",
        },
        {
          value: "unleash",
          text: "Unleash data",
        },
        {
          value: "buildcore",
          text: "Build / improve core software",
        },
        {
          value: "improvedao", //TODO Change these
          text: "Improvements to OceanDAO",
        },
      ],
    },

    {
      type: "largeText",
      title: "What is the final product?",
      bindValue: "finalProduct",
      placeHolder: "1-2 sentences describing the final product",
      wrong: false,
      required: true,
    },

    {
      type: "text",
      title: "Team Website (if applicable)",
      bindValue: "teamWebsite",
      placeHolder: "URL",
      wrong: false,
    },
    {
      type: "text",
      title: "Twitter Website (if applicable)",
      bindValue: "twitterLink",
      placeHolder: "URL",
      wrong: false,
    },
    {
      type: "text",
      title: "Discord Website (if applicable)",
      bindValue: "discordLink",
      placeHolder: "URL",
      wrong: false,
    },
    {
      type: "text",
      title: "Project lead full name",
      bindValue: "projectLeadFullName",
      placeHolder: "first name last name",
      wrong: false,
      required: true,
    },
    {
      type: "text",
      title: "Project lead email",
      bindValue: "projectLeadEmail",
      placeHolder: "example@example.com",
      wrong: false,
      required: true,
    },
    {
      type: "text",
      title: "Country of Residence",
      bindValue: "countryOfResidence",
      placeHolder: "USA",
      wrong: false,
      required: true,
    },
  ];

  let fieldsPart1 = [
    {
      type: "largeText",
      title: "Core Team",
      bindValue: "coreTeam",
      rows: 15,
      placeHolder: `John Doe
  Role: developer, UX/UI designer
  Relevant Credentials (e.g.):
  GitHub: https://github.com/johndoe
  LinkedIn: https://linkedin.com/in/johndoe
  Dribble: https://dribbble.com/johndoe
  Upwork: https://upwork.com/o/profiles/users/~johndoe
  Other: ...
  Background/Experience:
  Co-founder at xxx
  Lead developer at yyy
  Creator of xxx.js the official JavaScript library for xxx
        `,
    },
    {
      type: "largeText",
      title: "Advisors",
      bindValue: "advisors",
      rows: 15,
      placeHolder: `For each Advisor, give their name, role and background. Use the same format as in "Core Team"`,
    },
  ];

  let fields = [fieldsPart0, fieldsPart1];

  function next() {
    if (part == 1) {
      createProject();
    }
    if (part < 1) {
      part = part + 1;
    }
  }
  function back() {
    if (part !== 0) {
      part = part - 1;
    }
  }

  async function createProject() {
    let project = {
      projectName: $proposal.projectName,
      oneLiner: $proposal.oneLiner,
      projectDescription: $proposal.projectDescription,
      valueAddCriteria: $proposal.valueAddCriteria,
      projectCategory: $proposal.projectCategory,
      finalProduct: $proposal.finalProduct,
      teamWebsite: $proposal.teamWebsite,
      twitterLink: $proposal.twitterLink,
      discordLink: $proposal.discordLink,
      projectLeadFullName: $proposal.projectLeadFullName,
      projectLeadEmail: $proposal.projectLeadEmail,
      countryOfResidence: $proposal.countryOfResidence,
      coreTeam: $proposal.coreTeam,
      advisors: $proposal.advisors,
    };
    const message = JSON.stringify(project);
    const signedMessage = await signMessage(message, $networkSigner);
    const signer = $userAddress;

    fetch("http://localhost:3000/app/createProject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...project,
        signer,
        signedMessage,
        message,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Project created");
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
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
              Next
            {/if}
            {#if part == 1}
              Create Project
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