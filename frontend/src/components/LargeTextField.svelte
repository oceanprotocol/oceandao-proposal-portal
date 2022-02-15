<script>
  export let title;
  export let placeHolder;
  export let value = null;
  //export let disabled = false;
  export let wrong = false;
  //export let rows = 3;
  export let wrongText = "";
  import { quill } from "svelte-quill";

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ list: "ordered" }, { list: "bullet" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    ["image"],
  ];

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
  let options = {
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
  };
</script>

<svelte:head>
  <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
</svelte:head>

<div class="mb-8">
  <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
    {title}
  </label>
  <div
    class="editor"
    use:quill={options}
    on:text-change={(e) => {
      console.log(e.detail.html);
      value = e.detail.html;
    }}
  />
  <!-- <textarea
    bind:value
    {rows}
    disabled={disabled === true}
    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline {wrong &&
      'border-red-500'}"
    type="text"
    placeholder={placeHolder ?? title}
  /> -->

  {#if wrong}
    <p class="text-red-500 text-xs italic">{wrongText}</p>
  {/if}
</div>

<style>
  .editor {
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    min-height: 200px;
    padding: 16px;
  }
</style>
