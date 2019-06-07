const path = require('path')

export const get = name => {
  const configPath = getPath(name)
  const config = require(configPath)
  return config
}

export const getPath = name => {
  return path.resolve(__dirname, `${name}.config.json`)
}

export default { get, getPath }
