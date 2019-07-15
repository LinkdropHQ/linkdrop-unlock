import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Button } from 'components/common'
import { RetinaImage, Loading } from 'linkdrop-ui-kit'
import { getImages } from 'helpers'
import config from 'config-dashboard'

@actions(({ user: { chainId, transactionStatus, currentAddress, loading, txHash, privateKey } }) => ({ chainId, transactionStatus, currentAddress, txHash, loading, privateKey }))
@translate('pages.campaignCreate')
class Step1 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentWillReceiveProps ({ txHash, transactionStatus }) {
    const { txHash: prevTxHash, chainId, transactionStatus: prevTransactionStatus } = this.props
    if (txHash != null && !prevTxHash && prevTxHash !== txHash) {
      return this.setState({
        loading: true
      }, _ => {
        this.txHashCheck = window.setInterval(_ => this.actions().user.checkTxHash({ txHash, chainId }), 3000)
      })
    }

    if (transactionStatus != null && prevTransactionStatus !== transactionStatus) {
      this.setState({
        loading: false
      }, _ => {
        if (transactionStatus === 'failed') {
          window.alert('Failed!')
        }
        if (transactionStatus === 'success') {
          window.alert('Success!')
          window.setTimeout(_ => this.actions().user.setStep({ step: 2 }), config.nextStepTimeout)
        }
        window.clearInterval(this.txHashCheck)
      })
    }
  }
  render () {
    const { loading, txHash, transactionStatus } = this.props
    const { loading: stateLoading } = this.state
    return <div className={styles.container}>
      {(loading || stateLoading) && <Loading withOverlay />}
      <div className={styles.title}>{this.t('titles.createLinkKey')}</div>
      <div className={styles.main}>
        <div className={styles.description}>
          <p className={classNames(styles.text, styles.textMain)}>{this.t('texts._1')}</p>
          <p className={styles.text}>{this.t('texts._2')}</p>
          <p className={styles.text}>{this.t('texts._3')}</p>
          <p className={styles.text}>{this.t('texts._4')}</p>
        </div>

        <div className={styles.scheme}>
          <p className={classNames(styles.text, styles.centered)}>{this.t('texts._5')}</p>
          <RetinaImage width={255} {...getImages({ src: 'key-preview' })} />
        </div>
      </div>
      <div className={styles.controls}>
        <Button disabled={txHash && !transactionStatus} onClick={_ => this.onClick()}>{this.t('buttons.create')}</Button>
      </div>
    </div>
  }

  onClick () {
    const { chainId, currentAddress } = this.props
    this.actions().user.createSigningKey({ chainId, account: currentAddress })
  }
}

export default Step1
