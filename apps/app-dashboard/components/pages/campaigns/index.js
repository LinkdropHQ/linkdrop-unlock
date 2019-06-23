import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Web3Consumer } from 'web3-react'

@actions(_ => ({}))
@translate('pages.campaigns')
class Campaigns extends React.Component {
  render () {
    return <Web3Consumer>
      {context => <div className={styles.container}>
        bla bla i am campaigns page
      </div>}
    </Web3Consumer>
  }
}

export default Campaigns
