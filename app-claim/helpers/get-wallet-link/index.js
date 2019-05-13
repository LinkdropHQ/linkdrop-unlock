import wallets from 'wallets'

export default ({ platform, wallet, currentUrl }) => {
  const walletObj = wallets[wallet]
  if (!walletObj) { return {} }
  const deepLink = walletObj.mobile[platform].deepLink
  if (!deepLink) { return {} }
  return deepLink(currentUrl)
}
