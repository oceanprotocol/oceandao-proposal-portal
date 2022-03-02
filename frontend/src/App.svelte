<script>
  import { Router, Route, Link } from "svelte-navigator";
  import SubmitProposal from "./pages/SubmitProposal.svelte";
  import Navbar from "./components/Navbar.svelte";
  import { userConnected, connectWallet, userAddress } from "./stores/ethers";
  import ConnectWallet from "./pages/ConnectWallet.svelte";
  import HomePage from "./pages/HomePage.svelte";
  import CreateProject from "./pages/CreateProject.svelte";
  import ProjectPage from "./pages/ProjectPage.svelte";
  import ProposalPage from "./pages/ProposalPage.svelte";
  import GrantDeliverable from "./pages/GrantDeliverable.svelte";
  import AdminHomePage from "./pages/AdminHomePage.svelte";
  import AdminReviewProposalDeliverables from "./pages/AdminReviewProposalDeliverables.svelte";
  import AdminReviewProposalEarmark from "./pages/AdminReviewProposalEarmark.svelte";

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
        <HomePage />
      {:else}
        <ConnectWallet {connectWallet} />
      {/if}
    </Route>
    <Route path="home">
      <HomePage />
    </Route>

    <Route path="project/:projectId" let:params>
      <ProjectPage projectId={params.projectId} />
    </Route>

    <Route path="proposal/create/:projectId" let:params>
      <SubmitProposal projectId={params.projectId} />
    </Route>

    <Route path="project/edit/:projectId" let:params>
      <CreateProject projectId={params.projectId} />
    </Route>

    <Route path="proposal/update/:proposalId" let:params>
      <SubmitProposal proposalId={params.proposalId} />
    </Route>

    <Route path="proposal/view/:proposalId" let:params>
      <ProposalPage proposalId={params.proposalId} />
    </Route>

    <Route path="proposal/deliver/:proposalId" let:params>
      <GrantDeliverable proposalId={params.proposalId} />
    </Route>

    <Route path="newProject">
      <CreateProject />
    </Route>

    <Route path="admin/home" let:params>
      <AdminHomePage/>
    </Route>

    <Route path="admin/reviewProposalDeliverables/:proposalId" let:params>
      <AdminReviewProposalDeliverables proposalId={params.proposalId}/>
    </Route>

    <Route path="admin/reviewProposalEarmark/:proposalId" let:params>
      <AdminReviewProposalEarmark proposalId={params.proposalId}/>
    </Route>
  </main>
</Router>
