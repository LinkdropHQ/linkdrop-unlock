import React from 'react'
import { Loading } from 'linkdrop-ui-kit'
import { translate, actions } from 'decorators'

import styles from './styles.module'
import commonStyles from '../styles.module'
import { getHashVariables } from 'helpers'

@actions(({ user: { wallet } }) => ({ wallet }))
@translate('pages.main')
class ClaimingProcessPage extends React.Component {
  componentDidMount () {
    const { wallet } = this.props
    const { token, amount, expirationTime } = getHashVariables()
    // destination: destination address - can be received from web3-react context
    // token: ERC20 token address, 0x000...000 for ether - can be received from url params
    // tokenAmount: token amount in atomic values - can be received from url params
    // expirationTime: link expiration time - can be received from url params
    this.actions().tokens.claimTokens({ wallet, token, tokenAmount: amount, expirationTime })
  }

  render () {
    const { transactionId } = this.props
    return <div className={commonStyles.container}>
      <Loading container size='small' className={styles.loading} />
      <div className={styles.title}>{this.t('titles.claiming')}</div>
      <div className={styles.subtitle}>{this.t('titles.transactionInProcess')}</div>
      <div className={styles.description}>{this.t('titles.instructions')}</div>
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: this.t('titles.seeDetails', { transactionLink: `https://etherscan.io/tx/${transactionId}` }) }} />
    </div>
  }
}

export default ClaimingProcessPage
