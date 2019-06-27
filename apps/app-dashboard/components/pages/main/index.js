import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { ActionBlock } from 'components/common'
import { Web3Consumer } from 'web3-react'

@actions(_ => ({}))
@translate('pages.main')
class Main extends React.Component {
  render () {
    return <Web3Consumer>
      {context => <div className={styles.container}>
        <ActionBlock
          title='Create a Linkdrop'
          description='List of links with encoded tokens prepared to distribute'
          extraContent='ERC20 + ETH'
          onClick
          buttonTitle='Create'
        />
        <ActionBlock
          transparent
          title='Referral Marketing'
          description='Incentivize customer acquisition via referral links'
          extraContent='ERC721 / ERC20 + ETH'
          onClick
          buttonTitle='Conact Us'
        />
      </div>}
    </Web3Consumer>
  }
}

export default Main
