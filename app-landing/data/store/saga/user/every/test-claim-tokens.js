import LinkdropSDK from 'sdk/src/index'
import config from 'config'
const { jsonRpcUrl, host } = config

const generator = function * ({ payload }) {
  try {
    const {
      amount,
      expirationTime,
      linkKey,
      senderAddress,
      senderSignature,
      token
    } = payload

    const result = yield LinkdropSDK.claim(
      jsonRpcUrl,
      host,
      token,
      amount,
      expirationTime,
      linkKey,
      senderAddress,
      senderSignature,
      '0xAa46966f3448291068249E6f3fa8FDA59C929f3E'
      // receiverAddress
    )
    console.log({ result })
  } catch (e) {
    console.error(e)
  }
}

export default generator
