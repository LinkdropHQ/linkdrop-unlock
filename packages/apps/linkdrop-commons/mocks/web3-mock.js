var eth = require('./eth')
var net = require('./net')
function Web3 (provider) {
  this.connected = true
  this.eth = eth
  this.net = net

  return this
}

Web3.prototype.isConnected = function () {
  return this.connected
}

Web3.prototype.isAddress = function () {
  return true
}

module.exports = Web3
