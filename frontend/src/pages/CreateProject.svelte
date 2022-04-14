<script>
  import TextField from "../components/TextField.svelte";
  import LargeTextField from "../components/LargeTextField.svelte";
  import OptionSelect from "../components/OptionSelect.svelte";
  import { networkSigner, userAddress } from "../stores/ethers";
  import { signMessage } from "../stores/ethers";
  import { getNonce } from "../utils/helpers";
  import { SERVER_URI } from "../utils/config";
  import Button from "../components/Button.svelte";
  import Recaptcha from "../components/Recaptcha.svelte";
  import { createForm } from "svelte-forms-lib";
  import { fieldsPart0, fieldsPart1, validationSchema, initialValues } from "../constants/createProjectForm"

  export let projectId;
  const isUpdating = projectId !== undefined;
  let loaded = !isUpdating;
  let recaptcha;
  let project;
  let loading = false;

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
      if(field.disabledOnUpdate && isUpdating){
        field.disabled = true;
      }
    });
  });

  const { form, errors, handleChange, handleSubmit, values, changeValue } = createForm({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: values => {
      next()
    }
  })

  const getProjectInfo = async () => {
    let response = await fetch(`${SERVER_URI}/app/project/info/${projectId}`)
    response = await response.json()
    project = response.project;
    for(const value in $form){
      $form[value] = project[value]
    }
    loaded = true;
  }

  if (isUpdating) {
    getProjectInfo()
  }

  async function next() {
    if (part == 1) {
      fields = [fieldsPart0, fieldsPart1];
      createProject();
    }
    if (part < 1) {
      fields = [fieldsPart0, fieldsPart1];
      part++;
    }
  }
  function back() {
    if (part !== 0) {
      part = part - 1;
    }
  }

  async function createProject() {
    const recaptchaToken = await recaptcha.getCaptcha();
    loading = true;

    let projectObject = {
      projectName: $form.projectName,
      projectCategory: $form.projectCategory,
      projectDescription: $form.projectDescription,
      finalProduct: $form.finalProduct,
      projectLeadFullName: $form.projectLeadFullName,
      projectLeadEmail: $form.projectLeadEmail,
      countryOfResidence: $form.countryOfResidence,
      teamWebsite: $form.teamWebsite,
      twitterLink: $form.twitterLink,
      discordLink: $form.discordLink,
      coreTeam: $form.coreTeam,
      advisors: $form.advisors,
      nonce: await getNonce($userAddress),
      projectId: projectId,
    };
    const message = JSON.stringify(projectObject);
    let signedMessage
    try{
      signedMessage = await signMessage(message, $networkSigner);
    }catch(error){
      loading = false;
      errorMessage = error.message;
      return
    }
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
            loading = false;
          } else if (res.status === 400) {
            console.log("Couldn't update project: ", res);
            res = await res.text();
            try {
              res = JSON.parse(res);
            } catch (e) {
              loading = false;
            }
            errorMessage = `Error creating project. Please check fields. ${
              res.message ?? res.error ?? res
            }`;
            loading = false;
          }
        })
        .then((data) => {
          if (data !== undefined) {
            alert("Project updated");
            window.location.href = "/";
            errorMessage = null;
            loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
          loading = false;
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
            loading = false;
          } else if (res.status === 400) {
            res = await res.text();
            try {
              res = JSON.parse(res);
            } catch (e) {
              loading = false;
            }
            errorMessage = `Error creating project. Please check fields. ${
              res.message ?? res.error ?? res
            }`;
            loading = false;
          }
        })
        .then((data) => {
          if (data !== undefined) {
            alert("Project created");
            window.location.href = "/";
            errorMessage = null;
            loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
          loading = false;
        });
    }
  }

</script>

<Recaptcha bind:this={recaptcha} />

<div class="flex h-screen mt-10 justify-center w-full">
  <div class="w-full max-w-3xl m-auto">
  {#if loaded == false}
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
  {:else}
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
      <form on:submit={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
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
              name={field.bindValue}
              value={$form[field.bindValue]}
              title={field.title}
              placeHolder={field.placeHolder}
              disabled={field.disabled}
              error={$errors[field.bindValue]}
              wrongText={field.wrongText ?? "Please enter a valid value"}
              textFormat={field.textFormat}
              importantText={field.importantText}
              handleChange={handleChange}
            />
          {/if}
          {#if field.type === "largeText"}
            <LargeTextField
              bind:value={$form[field.bindValue]}
              name={field.bindValue}
              title={field.title}
              placeHolder={field.placeHolder}
              disabled={field.disabled}
              error={$errors[field.bindValue]}
              handleChange={handleChange}
              rows={field.rows}
            />
          {/if}
          {#if field.type === "optionSelect"}
            <OptionSelect
              bind:value={$form[field.bindValue]}
              title={field.title}
              placeHolder={field.placeHolder}
              disabled={field.disabled}
              error={$errors[field.bindValue]}
              options={field.options}
              handleChange={handleChange}
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
              <Button text="Back" onclick={() => back()} disabled={loading}/>
            {/if}
            <Button
              type="submit"
              text={part < 1
                ? "Next"
                : isUpdating
                ? "Update project"
                : "Create Project"}
              loading={loading}
              disabled={loading}
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
