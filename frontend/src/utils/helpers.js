import { SERVER_URI } from "./config";

export const getNonce = async (address) => {
  const nonceResponse = await fetch(`${SERVER_URI}/app/nonce/${address}`);
  const data = await nonceResponse.json();
  return data.nonce;
};
