<script>
  import TextField from "../components/TextField.svelte";
  import LargeTextField from "../components/LargeTextField.svelte";
  import OptionSelect from "../components/OptionSelect.svelte";
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
      title: "Proposal in one sentence",
      bindValue: "oneLiner",
      required: true,
      wrong: false,
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
      title: "Project Description",
      bindValue: "projectDescription",
      required: true,
      placeHolder: "Description of the project and what problem is it solving",
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
      type: "optionSelect",
      title: "Are you applying for an Earmark?",
      bindValue: "projectEarmark",
      wrong: false,
      required: true,
      options: [
        {
          value: "newproject",
          text: "New Project",
        },
        {
          value: "newprojectoutreach",
          text: "New Project Outreach / community / spread awarenes",
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
      type: "largeText",
      title: "What is the final product?",
      bindValue: "finalProduct",
      placeHolder: "1-2 sentences describing the final product",
      wrong: false,
      required: true,
    },
    {
      type: "text",
      title: "Funding Requested (USD)s",
      bindValue: "fundingRequested",
      wrong: false,
      required: true,
      textFormat: "number",
      importantText:
        "The amount requested is in USD, but the amount paid is in OCEAN token. The conversion rate is the market price on the given Round's Proposal Due By Deadline. This determines how many OCEAN will be awarded if a proposal is voted to receive a grant.",
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

  let getExtraPart2Fields = () => {
    switch ($proposal.projectCategory) {
      case "build": //Build / improve applications or integration to Ocean
        return [
          {
            type: "text",
            title: "App will be live at",
            bindValue: "appUrl",
            placeHolder: "URL or app store link",
          },
          {
            type: "text",
            title: "Is the software open-source?",
            bindValue: "isOpenSource",
            placeHolder: "Yes - no",
          },
          {
            type: "text",
            title:
              "If open-source, please specify the license. If no, please specify why not open-source.",
            bindValue: "isOpenSourceWhy",
            placeHolder: "1-2 sentences",
          },
          {
            type: "text",
            title: "Project software can be found at",
            bindValue: "isOpenSourceLink",
            placeHolder: "https://github.com/(organization/repo)",
          },
        ];
      case "buildcore":
        return [
          {
            type: "text",
            title: "A Pull Request (PR) will be made to these Ocean components",
            bindValue: "prComponents",
            placeHolder: "e.g. Aquarius, Provider, ..",
          },
          {
            type: "text",
            title:
              "We commit to working with Ocean core developers to merging the PR, following software quality best practices",
            bindValue: "commitToWorkingWithCore",
            placeHolder: "Yes-no, details",
          },
        ];
      case "improvedao":
        return [
          {
            type: "text",
            title: "We commit to collaborating closely with OceanDAO core team",
            bindValue: "commitToWorkingWithDAO",
            placeHolder: "Yes-no, details",
          },
          {
            type: "text",
            title:
              "We commit to making publicly available any improved DAO tooling",
            bindValue: "commitToMakingPublic",
            placeHolder: "Yes-no, details",
          },
        ];

      case "outreach": //TODO Add other options
        return [
          {
            type: "text",
            title: "How many blog posts will be published (if applicable)",
            bindValue: "howManyBlogPosts",
            placeHolder: "5-10",
          },
          {
            type: "text",
            title: "Where will the blogposts will be published (if applicable)",
            bindValue: "whereBlogPosts",
            placeHolder: "URL, e.g. medium.com/____",
          },
          {
            type: "text",
            title: "Where will the podcasts will be published (if applicable)",
            bindValue: "wherePodcasts",
            placeHolder: "URL",
          },
          {
            type: "text",
            title: "Where will the videos will be published (if applicable)",
            bindValue: "whereVideos",
            placeHolder: "URL, e.g. youtube.com/____",
          },
        ];
      case "unleash":
        return [
          {
            type: "text",
            title: "Which Ocean-powered data market will data be published on?",
            bindValue: "whichMarketPlace",
            placeHolder: "",
            wrong: false,
          },
        ];
      default:
        return [];
    }
  };

  let fieldsPart2Raw = [
    {
      type: "largeText",
      title: "Details",
      bindValue: "proposalDetails",
      rows: 10,
      placeHolder: `Details of the proposal`,
    },
    {
      type: "title",
      title: "Project Deliverables - Roadmap",
    },
    {
      type: "text",
      title: "Any prior work completed thus far?",
      placeHolder: "Y or N; details",
      bindValue: "priorWork",
    },
    {
      type: "largeText",
      title: "What is the project roadmap?",
      bindValue: "projectRoadmap",
      rows: 5,
      placeHolder: `That is: what are key milestones, and the target date for each milestone. Please make sure that one milestone is about publishing your results, e.g. as a medium blog post.`,
    },
    {
      type: "largeText",
      title: "What is the team's future plans and intentions?",
      bindValue: "futurePlans",
      rows: 5,
      placeHolder: `Is there maintenance? Possible extensions to the work?`,
    },
    {
      type: "title",
      title: "If the project includes software",
    },
    {
      type: "text",
      title:
        "Are there any mockups or designs to date? If yes, please share details / links",
      placeHolder: "Y or N; details",
      bindValue: "mockups",
    },
    {
      type: "largeText",
      title: "Please given an overview of the technology stack.",
      placeHolder: "1-4 paragraphs, ideally with images",
      bindValue: "technologyStack",
      rows: 5,
    },
    {
      type: "title",
      title: "If the project includes community engagement",
    },
    {
      type: "largeText",
      title: "Which channels will be used? For how long?",
      placeHolder: 'E.g. "twitter, for 8 weeks". Other details? 1-3 paragraphs',
      bindValue: "socialChannels",
      rows: 5,
    },
    {
      type: "title",
      title: "If the project has already published data assets",
    },
    {
      type: "text",
      title: "Here are the DIDs of the the data assets",
      placeHolder: "did 1, did2, ...",
      bindValue: "dataAssetdids",
    },
    {
      type: "line",
    },
    {
      type: "largeText",
      title: "Additional information",
      placeHolder:
        "Any additional information to add? E.g. custom fields or images? E.g. other grants or fundraising to date?",
      bindValue: "additionalInformation",
      rows: 5,
    },
    {
      type: "line",
    },
  ];

  let fieldsPart2 = [];

  let fields = [fieldsPart0, fieldsPart1, fieldsPart2];

  function next() {
    if (part === 1) {
      fieldsPart2 = [...fieldsPart2Raw, ...getExtraPart2Fields()];
      fields = [fieldsPart0, fieldsPart1, fieldsPart2];
      console.log(fieldsPart2);
    }
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

      <div class="flex items-center justify-between">
        <div class="flex space-x-2">
          {#each Array(3) as _, i}
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
            {#if part < 2}
              Next
            {/if}
            {#if part == 2}
              Submit Proposal
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
