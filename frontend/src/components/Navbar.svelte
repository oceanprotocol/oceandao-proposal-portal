<script>
  import { Router, Route, Link } from "svelte-navigator";
  export let userAddress;
</script>

<style>
  nav{
    background-color: var(--brand-white);
  }
  .navbarItem{
    color: var(--brand-black);
  }
  .navbarItem:hover{
    color: var(--brand-color-primary);
  }
  .navbarLink > :global(a){
    text-transform: uppercase;
    font-size: var(--font-size-normal);
  }
  .walletAddress{
    cursor: default;
  }
</style>

<nav
  class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800"
>
  <div class="container flex flex-wrap justify-between items-center mx-auto">
    <a href="/" class="flex">
      <img class="inline h-16 w-16" src="/favicon.png"/>
      <span
        class="self-center text-lg font-semibold whitespace-nowrap dark:text-white"
        >OceanDao Seed Grants</span
      >
    </a>
    <button
      data-collapse-toggle="mobile-menu"
      type="button"
      class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      aria-controls="mobile-menu-2"
      aria-expanded="false"
    >
      <span class="sr-only">Open main menu</span>
      <svg
        class="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clip-rule="evenodd"
        /></svg
      >
      <svg
        class="hidden w-6 h-6"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        /></svg
      >
    </button>
    <div class="hidden w-full md:block md:w-auto" id="mobile-menu">
      <ul
        class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium"
      >
        <li class="navbarItem">
          <Link
            to="/"
            class="navbarLink"
            aria-current="page">Home</Link
          >
        </li>
        <li class="navbarItem">
          <Link
            to="about"
            class="navbarLink"
            >About</Link
          >
        </li>

        {#if userAddress}
          <p class="font-bold walletAddress">
            {userAddress.substr(0, 5)}...{userAddress.substr(
              userAddress.length - 5
            )}
          </p>
        {/if}
      </ul>
    </div>
  </div>
</nav>
