export const signMessage = async (msg, signer) => {
  let hash = await signer.signMessage(msg);
  return hash;
};
