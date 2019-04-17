export default ({ wallet }) => {
  if (!wallet) return '...'
  return `${wallet.slice(0, 5)}...${wallet.slice(-5)}`
}
