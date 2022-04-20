import { SERVER_URI } from "./config";

import earmarks from "./types/earmark.json";

export const getNonce = async (address) => {
  const nonceResponse = await fetch(`${SERVER_URI}/app/nonce/${address}`);
  const data = await nonceResponse.json();
  return data.nonce;
};

export const getEarmarkOptions = (project) => {
  let earmarkOptions = []
  project.availableEarmarks.forEach((earmark) => {
    earmarkOptions.push({
      value: earmark,
      text: earmarks[earmark]
    })
  })
  return earmarkOptions
}
