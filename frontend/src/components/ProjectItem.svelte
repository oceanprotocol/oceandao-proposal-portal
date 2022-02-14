<script>
  export let project;
  import { Link } from "svelte-navigator";
</script>

<div>
  <Link to={`/project/${project._id}`}>{project.projectName}</Link>
</div>
