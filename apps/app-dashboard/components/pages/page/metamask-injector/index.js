import React from 'react'
import { actions, translate } from 'decorators'
import { Button } from 'components/common'
import styles from './styles.module'
import Web3Connect from 'web3connect'

const web3Connect = new Web3Connect.Core({
  providerOptions: {
    disableWalletConnect: true
  }
})

web3Connect.on('connect', provider => {
  MetamaskInjector.applyProvider(provider)
})

@actions(_ => ({}))
@translate('pages.main')
class MetamaskInjector extends React.Component {
  static applyProvider (provider) {
    if (provider.selectedAddress) {
      this.actions().user.setCurrentAddress({ currentAddress: provider.selectedAddress })
      this.actions().user.setChainId({ chainId: provider.networkVersion })
    }
  }

  render () {
    return <div className={styles.container}>
      <h2 className={styles.title}>{this.t('titles.metamaskSignIn')}</h2>
      <h3
        className={styles.subtitle}
        dangerouslySetInnerHTML={{ __html: this.t('titles.metamaksInstruction') }}
      />
      <div className={styles.button}>
        <Button
          onClick={_ => web3Connect.toggleModal()}
        />
      </div>
    </div>
  }
}

export default MetamaskInjector
