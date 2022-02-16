import { writable } from "svelte/store";

export const project = writable({
  projectName: "",
  projectCategory: "coretech",
});
