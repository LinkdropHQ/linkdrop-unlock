import fetch from '../fetch'

export default ({ sender, destination, senderSignature, receiverSignature, token, tokenId, expirationTime }) => {
  const body = {
    sender, // sender key address, e.g. 0x1234...ff,
    destination, // destination address,
    senderSignature, // ECDSA signature signed by sender (contained in claim link),
    receiverSignature, // ECDSA signature signed by receiver using link key,
    token, //  ERC721 token address, 0x000...000 for ether,
    tokenId, // token id,
    expirationTime // link expiration time
  }

  return fetch(`/linkdrops/claim-erc721`, { method: 'POST', body })
}
