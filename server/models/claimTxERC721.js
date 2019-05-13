import mongoose from 'mongoose'

const claimTxERC721Schema = new mongoose.Schema({
  nft: { type: String, required: true },
  tokenId: { type: Number, required: true },
  expirationTime: { type: Number, required: true },
  linkId: { type: String, required: true, unique: true },
  senderAddress: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  proxyAddress: { type: String, required: true },
  txHash: { type: String, required: true, unique: true }
})

const ClaimTxERC721 = mongoose.model('ClaimTxERC721', claimTxERC721Schema)

export default ClaimTxERC721
