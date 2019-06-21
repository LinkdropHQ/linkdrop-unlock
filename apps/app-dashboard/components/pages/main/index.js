import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Web3Consumer } from 'web3-react'

@actions(_ => ({}))
@translate('pages.main')
class Main extends React.Component {
  render () {
    return <Web3Consumer>
      {context => <div className={styles.container}>sss</div>}
    </Web3Consumer>
  }
}

export default Main
