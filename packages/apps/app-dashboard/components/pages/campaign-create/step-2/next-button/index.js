import React from 'react'
import { actions, translate } from 'decorators'
import { Button } from 'components/common'
import { multiply, add, bignumber } from 'mathjs'

@actions(({ user: { chainId } }) => ({ chainId }))
@translate('pages.campaignCreate')
class NextButton extends React.Component {
  render () {
    const { tokenType, chainId, tokenAmount, currentAddress, linksAmount, ethAmount, serviceFee } = this.props
    const ethAmountFinal = multiply(add(bignumber(ethAmount), bignumber(serviceFee)), linksAmount)
    return <Button onClick={_ => {
      if (tokenType === 'eth') {
        this.actions().metamask.sendEth({
          ethAmount: ethAmountFinal,
          account: currentAddress,
          chainId
        })
      } else {
        this.actions().metamask.sendErc20({
          tokenAmount: multiply(bignumber(tokenAmount), bignumber(linksAmount)),
          account: currentAddress
        })
      }
    }}>
      {this.t(`buttons.${tokenType === 'eth' ? 'sendAndContinue' : 'approve'}`)}
    </Button>
  }
}

export default NextButton
