import { writable } from "svelte/store";

export const project = writable({
  projectName: "",
  projectCategory: "coretech",
});

export const projectInfo = writable(undefined)
