import { writable } from "svelte/store";

export const project = writable({
  projectName: "",
  projectCategory: "build",
});

export const projectInfo = writable(undefined)
