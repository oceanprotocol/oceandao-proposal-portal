// store.js
import { writable } from "svelte/store";

export const project = writable({
  projectName: "",
  projectCategory: "coretech"
});

export const proposal = writable({
  projectName: "",
  projectCategory: "coretech"
});
