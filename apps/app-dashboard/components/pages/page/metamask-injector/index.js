import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import Web3Connect from 'web3connect'

@actions(_ => ({}))
@translate('pages.main')
class MetamaskInjector extends React.Component {
  render () {
    return <div className={styles.container}>
      <h2 className={styles.title}>{this.t('titles.metamaskSignIn')}</h2>
      <h3 className={styles.subtitle}>{this.t('titles.metamaksInstruction')}</h3>
      <div className={styles.button}>
        <Web3Connect.Button
          onConnect={provider => {
            console.log('metamask injector', { currentAddress: provider.selectedAddress })
            if (provider.selectedAddress) {
              this.actions().user.setCurrentAddress({ currentAddress: provider.selectedAddress })
            }
          }}
          onClose={() => {
            console.log('Web3Connect Modal Closed') // modal has closed
            // window.location.reload(true)
          }}
        />
      </div>
    </div>
  }
}

export default MetamaskInjector
