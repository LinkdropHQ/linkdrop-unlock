export default (data = {}) => {
  const { url = window.location.hash } = data
  const onlyVariablesPart = url.split('?')[1]
  if (!onlyVariablesPart) return {}
  return onlyVariablesPart.split('&').reduce((sum, item) => {
    const variablePair = item.split('=')
    sum[variablePair[0]] = variablePair[1]
    return sum
  }, {})
}
