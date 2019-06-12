const path = require('path')
const fs = require('fs')
export const get = name => {
  const configPath = getPath(name)

  // If config file does not exist, create it and fill with sample config content
  if (!fs.existsSync(configPath)) {
    fs.copyFileSync(`${configPath}.sample`, configPath, err => {
      if (err) throw new Error(err)
    })
  }

  const config = require(configPath)
  return config
}

export const getPath = name => {
  return path.resolve(__dirname, `${name}.config.json`)
}

export default { get, getPath }
