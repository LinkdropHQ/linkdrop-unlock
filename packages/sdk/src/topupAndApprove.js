import { ethers } from 'ethers'
import TokenMock from '../../contracts/build/TokenMock.json'
import NFTMock from '../../contracts/build/NFTMock.json'

export const topupAndApprove = async ({
  jsonRpcUrl,
  signingKeyOrWallet,
  proxyAddress,
  weiAmount,
  tokenAddress,
  tokenAmount
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error(`Please provide json rpc url`)
  }
  if (signingKeyOrWallet == null || signingKeyOrWallet === '') {
    throw new Error(`Please provide signing key or wallet`)
  }
  if (proxyAddress == null || proxyAddress === '') {
    throw new Error(`Please provide proxy address`)
  }
  if (weiAmount == null || weiAmount === '') {
    throw new Error(`Please provide wei amount`)
  }
  if (tokenAddress == null || tokenAddress === '') {
    throw new Error(`Please provide token address`)
  }
  if (tokenAmount == null || tokenAmount === '') {
    throw new Error(`Please provide token amount`)
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  let wallet, topupTx, approveTx
  if (typeof signingKeyOrWallet === 'string') {
    wallet = new ethers.Wallet(signingKeyOrWallet, provider)
  } else if (typeof signingKeyOrWallet === 'object') {
    wallet = signingKeyOrWallet
  }

  if (weiAmount > 0) {
    topupTx = await wallet.sendTransaction({
      to: proxyAddress,
      value: weiAmount
    })
  }

  if (
    tokenAmount > 0 &&
    tokenAddress !== '0x0000000000000000000000000000000000000000'
  ) {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      TokenMock.abi,
      wallet
    )
    approveTx = await tokenContract.approve(proxyAddress, tokenAmount)
  }

  return { topupTxHash: topupTx.hash, approveTxHash: approveTx.hash }
}

export const topupAndApproveERC721 = async ({
  jsonRpcUrl,
  signingKeyOrWallet,
  proxyAddress,
  weiAmount = 0,
  nftAddress
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error(`Please provide json rpc url`)
  }
  if (signingKeyOrWallet == null || signingKeyOrWallet === '') {
    throw new Error(`Please provide signing key or wallet`)
  }
  if (proxyAddress == null || proxyAddress === '') {
    throw new Error(`Please provide proxy address`)
  }
  if (weiAmount == null || weiAmount === '') {
    throw new Error(`Please provide wei amount`)
  }
  if (nftAddress == null || nftAddress === '') {
    throw new Error(`Please provide nft address`)
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  let wallet, topupTx

  if (typeof signingKeyOrWallet === 'string') {
    wallet = new ethers.Wallet(signingKeyOrWallet, provider)
  } else if (typeof signingKeyOrWallet === 'object') {
    wallet = signingKeyOrWallet
  }

  if (weiAmount > 0) {
    topupTx = await wallet.sendTransaction({
      to: proxyAddress,
      value: weiAmount
    })
  }

  const nftContract = new ethers.Contract(nftAddress, NFTMock.abi, wallet)
  const approveTx = await nftContract.setApprovalForAll(proxyAddress, true)

  return { topupTxHash: topupTx.hash, approveTxHash: approveTx.hash }
}
