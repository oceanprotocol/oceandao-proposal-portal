<script>
  import { Router, Route, Link } from "svelte-navigator";
  import SubmitProposal from "./pages/SubmitProposal.svelte";
  import Navbar from "./components/Navbar.svelte";
  import { userConnected, connectWallet, userAddress } from "./stores/ethers";
  import ConnectWallet from "./pages/ConnectWallet.svelte";
  import HomePage from "./pages/HomePage.svelte";

  if ($userConnected && $userAddress === "") {
    connectWallet();
  }
</script>

<Router>
  <header>
    <Navbar userAddress={$userAddress} />
  </header>

  <main>
    <Route path="/">
      {#if $userConnected === true}
        <HomePage userAddress={$userAddress} />
      {:else}
        <ConnectWallet {connectWallet} />
      {/if}
    </Route>

    <Route path="submitProposal">
      <SubmitProposal />
    </Route>

    <Route path="submitProposal">
      <h3>About</h3>
      <p>That's what it's all about!</p>
    </Route>

    <Route path="editProposal">
      <h3>About</h3>
      <p>That's what it's all about!</p>
    </Route>
  </main>
</Router>
