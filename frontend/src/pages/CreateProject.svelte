<script>
  import { project as projectStore } from "../stores/project";
  import TextField from "../components/TextField.svelte";
  import LargeTextField from "../components/LargeTextField.svelte";
  import OptionSelect from "../components/OptionSelect.svelte";
  import { networkSigner, userAddress } from "../stores/ethers";
  import { signMessage } from "../stores/ethers";
  import { getNonce } from "../utils/helpers";
  import { SERVER_URI } from "../utils/config";
  import Button from "../components/Button.svelte";
  import Recaptcha from "../components/Recaptcha.svelte";

  export let projectId;
  const isUpdating = projectId !== undefined;
  let loaded = !isUpdating;
  let recaptcha;

  if (isUpdating) {
    fetch(`${SERVER_URI}/app/project/info/${projectId}`)
      .then((res) => res.json())
      .then((res) => {
        projectStore.update(() => res.project);
        loaded = true;
      });
  }

  let part = 0;
  let errorMessage = null;

  const partTitles = ["Part 1 - Project Details", "Part 2 - Team Details"];

  let fieldsPart0 = [
    {
      type: "text",
      title: "Name of Project",
      bindValue: "projectName",
      required: true,
      wrong: false,
      disabled: isUpdating,
    },
    {
      type: "optionSelect",
      title: "Project Category",
      bindValue: "projectCategory",
      wrong: false,
      disabled: isUpdating,
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
      title: "Project Description",
      bindValue: "projectDescription",
      required: true,
      placeHolder: "Description of the project and what problem is it solving",
      wrong: false,
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
    {
      type: "text",
      title: "Team Website",
      bindValue: "teamWebsite",
      placeHolder: "URL",
      wrong: false,
    },
    {
      type: "text",
      title: "Twitter Website",
      bindValue: "twitterLink",
      placeHolder: "URL",
      wrong: false,
    },
    {
      type: "text",
      title: "Discord Website",
      bindValue: "discordLink",
      placeHolder: "URL",
      wrong: false,
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
Background/Experience:
Co-founder at xxx`,
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

  function next() {
    if (part == 1) {
      fieldsPart1.map((field) => {
        if (field.required) {
          if (
            $projectStore[field.bindValue] == null ||
            $projectStore[field.bindValue] == ""
          ) {
            field.wrong = true;
            field.wrongText = "This field is required";
          } else {
            field.wrong = false;
          }
        }
      });
      fields = [fieldsPart0, fieldsPart1];

      if (fieldsPart1.filter((field) => field.wrong).length == 0) {
        createProject();
      }
    }
    if (part < 1) {
      fieldsPart0.map((field) => {
        if (field.required) {
          if (
            $projectStore[field.bindValue] == null ||
            $projectStore[field.bindValue] == ""
          ) {
            field.wrong = true;
            field.wrongText = "This field is required";
          } else {
            field.wrong = false;
          }
        }
      });
      fields = [fieldsPart0, fieldsPart1];

      if (fieldsPart0.filter((field) => field.wrong).length == 0) {
        part++;
      }
    }
  }
  function back() {
    if (part !== 0) {
      part = part - 1;
    }
  }

  async function createProject() {
    const recaptchaToken = await recaptcha.getCaptcha();

    let projectObject = {
      projectName: $projectStore.projectName,
      projectCategory: $projectStore.projectCategory,
      projectDescription: $projectStore.projectDescription,
      finalProduct: $projectStore.finalProduct,
      projectLeadFullName: $projectStore.projectLeadFullName,
      projectLeadEmail: $projectStore.projectLeadEmail,
      countryOfResidence: $projectStore.countryOfResidence,
      teamWebsite: $projectStore.teamWebsite,
      twitterLink: $projectStore.twitterLink,
      discordLink: $projectStore.discordLink,
      coreTeam: $projectStore.coreTeam,
      advisors: $projectStore.advisors,
      nonce: await getNonce($userAddress),
      projectId: projectId,
    };
    const message = JSON.stringify(projectObject);
    const signedMessage = await signMessage(message, $networkSigner);
    const signer = $userAddress;

    if (isUpdating) {
      fetch(`${SERVER_URI}/app/project/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signer,
          signedMessage,
          message,
          recaptchaToken,
        }),
      })
        .then(async (res) => {
          if (res.status === 200) {
            return res.json();
          } else if (res.status === 400) {
            console.log("Couldn't update project: ", res);
            res = await res.text();
            try {
              res = JSON.parse(res);
            } catch (e) {}
            errorMessage = `Error creating project. Please check fields. ${
              res.message ?? res.error ?? res
            }`;
          }
        })
        .then((data) => {
          if (data !== undefined) {
            console.log("Project updated");
            console.log(data);
            alert("Project updated");
            window.location.href = "/";
            errorMessage = null;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fetch(`${SERVER_URI}/app/project/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signer,
          signedMessage,
          message,
          recaptchaToken,
        }),
      })
        .then(async (res) => {
          if (res.status === 200) {
            return res.json();
          } else if (res.status === 400) {
            console.log("Couldn't create project: ", res);
            res = await res.text();
            try {
              res = JSON.parse(res);
            } catch (e) {}
            errorMessage = `Error creating project. Please check fields. ${
              res.message ?? res.error ?? res
            }`;
          }
        })
        .then((data) => {
          if (data !== undefined) {
            console.log("Project created");
            console.log(data);
            alert("Project created");
            window.location.href = "/";
            errorMessage = null;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
</script>

<Recaptcha bind:this={recaptcha} />

<div class="flex h-screen mt-10 justify-center w-full">
  <div class="w-full max-w-3xl m-auto">
    <p class="text-lg font-bold text-center">
      Projects must meet the
      <a
        class="link"
        target="_blank"
        href="https://github.com/oceanprotocol/oceandao/wiki/project-criteria"
      >
        Project Submission Criteria
      </a> .
    </p>
    {#if loaded}
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
              bind:value={$projectStore[field.bindValue]}
              title={field.title}
              placeHolder={field.placeHolder}
              disabled={field.disabled}
              bind:wrong={field.wrong}
              wrongText={field.wrongText ?? "Please enter a valid value"}
              textFormat={field.textFormat}
              importantText={field.importantText}
            />
          {/if}
          {#if field.type === "largeText"}
            <LargeTextField
              bind:value={$projectStore[field.bindValue]}
              title={field.title}
              placeHolder={field.placeHolder}
              disabled={field.disabled}
              bind:wrong={field.wrong}
              wrongText={field.wrongText ?? "Please enter a valid value"}
              rows={field.rows}
            />
          {/if}
          {#if field.type === "optionSelect"}
            <OptionSelect
              bind:value={$projectStore[field.bindValue]}
              title={field.title}
              placeHolder={field.placeHolder}
              disabled={field.disabled}
              bind:wrong={field.wrong}
              wrongText={field.wrongText ?? "Please enter a valid value"}
              options={field.options}
            />
          {/if}
        {/each}
        <p>* Required Fields</p>
        {#if errorMessage != null}
          <p class="text-red-500">{errorMessage}</p>
        {/if}
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
              <Button text="Back" onclick={() => back()} />
            {/if}
            <Button
              text={part < 1
                ? "Next"
                : isUpdating
                ? "Update project"
                : "Create Project"}
              onclick={() => next()}
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
