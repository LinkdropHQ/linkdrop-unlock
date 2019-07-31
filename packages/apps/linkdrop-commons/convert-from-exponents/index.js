export default (num) => {
  var data = String(num).split(/[eE]/)
  if (data.length === 1) return data[0]

  var z = ''; var sign = num < 0 ? '-' : ''

  var str = data[0].replace('.', '')

  var mag = Number(data[1]) + 1

  if (mag < 0) {
    z = sign + '0.'
    while (mag++) z += '0'
    return z + str.replace(/^-/, '')
  }
  mag -= str.length
  while (mag--) z += '0'
  return str + z
}
