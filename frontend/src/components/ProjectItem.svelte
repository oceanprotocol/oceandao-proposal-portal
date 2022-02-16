<script>
  export let project;
  import { Link } from "svelte-navigator";
</script>

<div class="inline-flex rounded-md shadow">
  <Link
    class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
    to={`/project/${project._id}`}>{project.projectName}</Link
  >
</div>
