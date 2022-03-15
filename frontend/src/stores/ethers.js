import { writable } from "svelte/store";
import { ethers } from "ethers";
import { web } from "svelte-web3"

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
      infuraId: "4b9c931a4f26483aaf53db3ed884549e"
    }
  },
}

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions, // required
  disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
});

export const setValuesAfterConnection = async (instance) => {
  const provider = new ethers.providers.Web3Provider(instance);
  const signer = provider.getSigner();
  networkProvider.set(provider);
  networkSigner.set(signer);
  const signerAddress = await signer.getAddress()
  userAddress.set(signerAddress);
  chainID.set(await ethereum.request({ method: "eth_chainId" }));
  userConnected.set(true);
}


export const connectWalletFromLocalStorage = async () => {
  const localStorageProvider = JSON.parse(
    localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')
  )
  if (!localStorageProvider) return
  const instance = await web3Modal.connectTo(localStorageProvider)
  setValuesAfterConnection(instance)
}

export const signMessage = async (msg, signer) => {
  let signedMessage;
  signedMessage = await signer.signMessage(msg)
  return signedMessage;
};


export const connectWallet = async () => {
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
  instance.on("disconnect", disconnect);

  setValuesAfterConnection(instance)
};

export const disconnect = async () => {
  await web3Modal.clearCachedProvider();
  if (web3 && web3.currentProvider && (web3.currentProvider).close) {
    await (web3.currentProvider).close()
  }
  userAddress.set(undefined);
  networkProvider.set(undefined);
  networkSigner.set(undefined);
  localStorage.removeItem("walletconnect")
  localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER")
  userConnected.set(false);
  window.location.href = "/";
}



userConnected.subscribe((val) => localStorage.setItem("userConnected", val));
