import { writable } from "svelte/store";
import { ethers } from "ethers";

export let userConnected = writable(
  localStorage.getItem("userConnected") || false
);
export let userAddress = writable("");
export let networkProvider = writable("");
export let networkSigner = writable("");
export let chainID = writable("");
export let nodeProvider = writable("");

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // Mikko's test key - don't copy as your mileage may vary
      infuraId: "4b9c931a4f26483aaf53db3ed884549e",
    }
  },
}

const web3Modal = new Web3Modal({
  cacheProvider: false, // optional
  providerOptions, // required
  disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
});


export const connectWallet = async () => {
  await window.ethereum.enable();
  let instance;
  try {
    instance = await web3Modal.connect();
    //provider = new ethers.providers.Web3Provider(window.ethereum)
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  instance.on("accountsChanged", (accounts) => {
    
  });

  // Subscribe to chainId change
  instance.on("chainChanged", (chainId) => {
    
  });

  // Subscribe to networkId change
  instance.on("networkChanged", (networkId) => {
    
  });

  // Subscribe to networkId change
  instance.on("disconnect", () => {
    userConnected.set(false);
    userAddress.set(undefined);
    networkProvider.set(undefined);
    networkSigner.set(undefined);
  });

  const provider = new ethers.providers.Web3Provider(instance);
  console.log(provider);
  const signer = provider.getSigner();
  console.log(signer)
  networkProvider.set(provider);
  networkSigner.set(signer);
  userAddress.set(await signer.getAddress());
  chainID.set(await ethereum.request({ method: "eth_chainId" }));
  userConnected.set(true);
};

userConnected.subscribe((val) => localStorage.setItem("userConnected", val));
