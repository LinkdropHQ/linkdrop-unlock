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
      <h3
        className={styles.subtitle}
        dangerouslySetInnerHTML={{ __html: this.t('titles.metamaksInstruction') }}
      />
      <div className={styles.button}>
        <Web3Connect.Button
          onConnect={provider => {
            if (provider.selectedAddress) {
              this.actions().user.setCurrentAddress({ currentAddress: provider.selectedAddress })
              this.actions().user.setChainId({ chainId: provider.networkVersion })
            }
          }}
          onClose={_ => {
            console.log('Web3Connect Modal Closed') // modal has closed
            // window.location.reload(true)
          }}
        />
      </div>
    </div>
  }
}

export default MetamaskInjector
