<script>
  import { userAddress, networkSigner } from "../stores/ethers";
  import Button from "../components/Button.svelte";
  const SERVER_URI = "http://localhost:3000";

  const signMessage = async (msg) => {
    let hash = await $networkSigner.signMessage(msg);
    return hash;
  };

  async function fetchProjects() {
    const message =
      "Fetch projects for user " +
      userAddress +
      " time: " +
      new Date().getTime();

    const signedMessage = await signMessage(message);

    const res = await fetch(`http://localhost:3000/app/myProjects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        signedMessage,
        signer: $userAddress,
      }),
    });
    console.log(res);

    const data = await res.json();
    console.log(data);
  }
</script>

<div class="flex h-screen justify-center">
  <div class="m-auto flex justify-center flex-col">
    <p class="text-lg font-bold">Your projects</p>

    <hr />

    <Button onclick={() => fetchProjects()} text={`Get projects`} />
    <Button
      onclick={() => (location.href = "newProject")}
      text={`Create new project`}
    />
  </div>
</div>
