<script>
  import { Link } from "svelte-navigator";

  export let project;
</script>

<style>
  .projectCard{
    flex-direction: column;
    background-color: grey;
    margin-bottom: 15px;
    padding: 20px;
  }
  .projectCard span{
    font-size: var(--font-size-normal);
    margin-bottom: calc(var(--spacer) / 4);
  }
  .projectCardDescription{
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  .projectButton{
    width: 50%;
    margin: 0 auto;
    margin-top: calc(var(--spacer) / 4);
    font-size: var(--font-size-small);
  }
</style>

<div class="flex justify-between projectCard">
    <span>Round {project.projectTitle}</span>
    <Link
      class="flex justify-center text-black-600 bg-white projectButton"
      to={`/project/${project._id}`}>View</Link
    >
</div>