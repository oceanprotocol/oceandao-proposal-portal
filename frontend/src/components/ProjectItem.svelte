<script>
  import Button from "./Button.svelte";
  export let project;

  function onButtonClick() {
    location.href = `/project/${project._id}`;
  }
</script>

<style>
  .projectCard{
    flex-direction: column;
    padding: 20px;
    background-color: var(--brand-grey-dimmed);
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
  }
  .projectCard span{
    font-size: var(--font-size-normal);
    font-weight: bold;
    margin-bottom: calc(var(--spacer) / 4);
  }
  .buttonContainer{
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
</style>

<div class="flex justify-between projectCard">
    <span>{project.projectName}</span>
    <div class="buttonContainer">
      <Button
        text="View"
        secondary
        onclick={() => onButtonClick()}
      />
    </div>
</div>
