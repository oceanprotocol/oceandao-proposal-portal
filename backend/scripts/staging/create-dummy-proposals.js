const fetch = require("node-fetch");
const SERVER_URI = "http://localhost:3005";
const ethers = require("ethers");

const getWallet = () => ethers.Wallet.createRandom();
const sign = async (wallet, message) => {
  return wallet.signMessage(message);
};
const LOREM_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit nunc laoreet, commodo magna ac, tempus arcu. Quisque lacus purus, sodales eu libero eget, viverra tristique massa. Phasellus fringilla risus in tortor convallis, eu dignissim est posuere.";
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
async function getNonce(address) {
  const nonceResponse = await fetch(`${SERVER_URI}/app/nonce/${address}`);
  const data = await nonceResponse.json();
  return data.nonce;
}

async function createProposal(wallet, projectId) {
  const proposalObject = {
    proposalTitle: `Dummy Proposal ${makeid(8)}`,
    proposalEarmark: "general",
    oneLiner: LOREM_TEXT.substring(0, 40),
    proposalDescription: LOREM_TEXT,
    grantDeliverables: LOREM_TEXT,
    proposalFundingRequested: 3000,
    proposalWalletAddress: "0x000000000000000000000000000000000000dEaD",
    valueAddCriteria: LOREM_TEXT,
    projectId: projectId,
    nonce: await getNonce(wallet.address),
    minUsdRequested: 1000,
  };
  const message = JSON.stringify(proposalObject);
  const signedMessage = await sign(wallet, message);
  const signer = wallet.address;

  let res = await fetch(`${SERVER_URI}/app/project/createProposal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
      signedMessage: signedMessage,
      signer: signer,
      recaptchaToken: "1",
    }),
  });

  return await res.json();
}

async function createProject(wallet) {
  const projectObject = {
    projectName: `Dummy Project ${makeid(8)}`,
    projectCategory: "build",
    projectDescription: LOREM_TEXT,
    finalProduct: LOREM_TEXT,
    projectLeadFullName: "John Doe",
    projectLeadEmail: `johndoe${makeid(8)}@gmail.com`,
    countryOfResidence: "Artict",
    nonce: await getNonce(wallet.address),
  };
  const message = JSON.stringify(projectObject);
  const signedMessage = await sign(wallet, message);
  const signer = wallet.address;

  let res = await fetch(`${SERVER_URI}/app/project/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      signer,
      signedMessage,
      message,
      recaptchaToken: "1",
    }),
  });

  return await res.json();
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const wallet = getWallet();
  const project = await createProject(wallet);
  const projectId = project._id;
  const proposal = await createProposal(wallet, projectId);
  console.log("Proposal created", proposal.proposal.proposalTitle);
  sleep(2000);
}

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("Number of proposals to create?\n", async (count) => {
  for (let i = 0; i < parseInt(count); i++) await main();
  process.exit();
});
