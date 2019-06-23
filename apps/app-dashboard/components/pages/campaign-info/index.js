import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Web3Consumer } from 'web3-react'

@actions(_ => ({}))
@translate('pages.campaignInfo')
class CampaignInfo extends React.Component {
  render () {
    return <Web3Consumer>
      {context => <div className={styles.container}>
        bla bla i am campaign info page
      </div>}
    </Web3Consumer>
  }
}

export default CampaignInfo
