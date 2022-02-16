import { SERVER_URI } from "./config";

export const getNonce = (address) => {
  const nonceResponse = await fetch(`${SERVER_URI}/app/nonce/${signer}`);
  const nonce = await nonceResponse.json();
  return nonce;
};
