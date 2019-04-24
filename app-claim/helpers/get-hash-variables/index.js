export default (key) => {
  const onlyVariablesPart = window.location.hash.split('?')[1]
  if (!onlyVariablesPart) return null
  return onlyVariablesPart.split('&').reduce((sum, item) => {
    const variablePair = item.split('=')
    sum[variablePair[0]] = variablePair[1]
    return sum
  }, {})
}
