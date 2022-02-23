<script>
  import ProjectItem from "./ProjectItem.svelte";
  export let projects;
</script>

<style>
  .projectsContainer{
    display: grid;
    grid-gap: calc(var(--spacer) / 3);
    grid-template-columns: repeat(3, 1fr);
    background-color: #F8FAFC;
  }
</style>

<div class="projectsContainer">
    {#each projects as project}
        <ProjectItem
            project={project}
        />
    {/each}
</div>
