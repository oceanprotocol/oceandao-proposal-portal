import { writable } from "svelte/store";
export const proposal = writable({
  projectName: "",
  projectCategory: "coretech",
  minUsdRequested: 0
});
