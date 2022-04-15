const ethers = require("ethers");
require("dotenv").config();

const OCEAN_ERC20_0x = "0x967da4048cD07aB37855c090aAF366e4ce1b9F48";
const OCEAN_Polygon_0x = "0x282d8efCe846A88B159800bd4130ad77443Fa1A1";
const OCEAN_BSC_0x = "0xdce07662ca8ebc241316a15b611c89711414dd1a";

const networks = [
  {
    address: OCEAN_ERC20_0x,
    provider: process.env.ETH_RPC_URL || "https://cloudflare-eth.com/",
  },
  {
    address: OCEAN_Polygon_0x,
    provider: process.env.POLYGON_RPC_URL || `https://polygon-rpc.com`,
  },
  {
    address: OCEAN_BSC_0x,
    provider: process.env.BSC_RPC_URL || `https://bsc-dataseed.binance.org/`,
  },
];

const hasEnoughOceans = async (wallet_address, required) => {
  if (!wallet_address) return false;
  const balances = [];
  for (const network of networks) {
    const abi = ["function balanceOf(address owner) view returns (uint256)"];
    const provider = new ethers.providers.JsonRpcProvider(network.provider);
    const contract = new ethers.Contract(network.address, abi, provider);
    const balance = await contract.balanceOf(wallet_address);
    balances.push(parseInt(ethers.utils.formatEther(balance)));
    if (balances.reduce((a, b) => a + b, 0) >= required) {
      return true;
    }
  }
  return false;
};

module.exports = {
  hasEnoughOceans,
};
