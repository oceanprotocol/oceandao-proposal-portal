<script>
  import { onMount } from "svelte";

  export let title;
  export let placeHolder;
  export let value = null;
  export let disabled = false;
  export let wrong = false;
  export let rows = 3;
  export let wrongText = "";
  //  import { quill } from "svelte-quill";
  let editor;
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ list: "ordered" }, { list: "bullet" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    ["image"],
  ];

  onMount(async () => {
    const { default: Quill } = await import("quill");

    let quill = new Quill(editor, {
      placeholder: placeHolder ?? title,
      theme: "snow",

      modules: {
        toolbar: {
          container: toolbarOptions,
          handlers: {
            image: imageHandler,
          },
        },
      },
    });

    quill.clipboard.dangerouslyPasteHTML(value);
    const container = editor.getElementsByClassName("ql-editor")[0];
    quill.on("text-change", function (delta, oldDelta, source) {
      editor.dispatchEvent(
        new CustomEvent("text-change", {
          detail: {
            html: container.innerHTML,
            text: quill.getText(),
          },
        })
      );
    });
  });

  function imageHandler() {
    const tooltip = this.quill.theme.tooltip;
    const originalSave = tooltip.save;
    const originalHide = tooltip.hide;

    tooltip.save = function () {
      const range = this.quill.getSelection(true);
      const value = this.textbox.value;
      if (value) {
        this.quill.insertEmbed(range.index, "image", value, "user");
      }
    };
    // Called on hide and save.
    tooltip.hide = function () {
      tooltip.save = originalSave;
      tooltip.hide = originalHide;
      tooltip.hide();
    };
    tooltip.edit("image");
    tooltip.textbox.placeholder = "Embed URL";
  }
</script>

<svelte:head>
  <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
</svelte:head>

<div class="mb-8">
  {#if title}
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      {title}
    </label>
  {/if}
  <div class="editor-wrapper">
    <div
      class="editor"
      bind:this={editor}
      on:text-change={(e) => (value = e.detail.html)}
    />
  </div>

  {#if wrong}
    <p class="text-red-500 text-xs italic">{wrongText}</p>
  {/if}
</div>

<style>
  @import "https://cdn.quilljs.com/1.3.6/quill.snow.css";

  .editor {
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    min-height: 200px;
    padding: 16px;
  }
</style>
