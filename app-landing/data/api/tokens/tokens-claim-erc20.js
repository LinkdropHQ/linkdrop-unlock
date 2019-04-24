import fetch from '../fetch'

export default ({ sender, destination, senderSignature, receiverSignature, token, tokenAmount, expirationTime }) => {
  const body = {
    sender, // sender key address, e.g. 0x1234...ff,
    destination, // destination address,
    senderSignature, // ECDSA signature signed by sender (contained in claim link),
    receiverSignature, // ECDSA signature signed by receiver using link key,
    token, // ERC20 token address, 0x000...000 for ether,
    tokenAmount, // token amount in atomic values,
    expirationTime // link expiration time
  }
  return fetch(`/linkdrops/claim`, { method: 'POST', body })
}
