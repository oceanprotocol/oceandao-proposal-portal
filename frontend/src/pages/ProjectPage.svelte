<script>
  import { Link } from "svelte-navigator";
  import SvelteMarkdown from 'svelte-markdown';

  import Button from "../components/Button.svelte";
  export let projectId;
  let project;
  let source;
  let proposals = [];

  async function loadProject() {
    let res = await fetch(
      `http://localhost:3000/app/getProjectInfo/${projectId}`
    );
    res = await res.json();
    project = res.project;
    proposals = res.proposals;
    console.log(project, proposals);

    source = project.projectDescription;
  }
  loadProject();
</script>

<div class="flex h-screen justify-center">
  <div class="flex flex-col justify-center">
    <div class=" justify-start max-w-2xl">
      {#if project }
        <div class="grid grid-cols-6 gap-4">
          <div class="col-start-1 col-span-2 ...">
            <p class="text-lg font-bold">{project.projectName}</p>
          </div>
          <div class="col-start-4 col-span-2 ...">
            <p class="text-lg font-bold">{project.projectCategory}</p>
          </div>
          <div class="col-start-7 col-span-2 ...">
            <p class="text-lg font-bold">{project.createdAt}</p>
          </div>
        </div>
      {/if}

      {#if source }
        <SvelteMarkdown {source} />
      {/if}
    </div>

    <div class="mt-5">
      <p class="text-lg font-bold">Proposals</p>
      {#each proposals as proposal}
        <div class="flex justify-between">
          <Link
            class="font-bold text-lg text-blue-600"
            to={`/proposal/view/${proposal._id}`}>{proposal.proposalTitle}</Link
          >
        </div>
      {/each}
    </div>
    <div class="flex mt-5 justify-end">
      <Button
        text={"Create proposal"}
        onclick={() => {
          location.href = "/proposal/create/" + projectId;
        }}
      />
    </div>
  </div>
</div>
