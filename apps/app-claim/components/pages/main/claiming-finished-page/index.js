import React from 'react'
import { Alert, Icons } from 'linkdrop-ui-kit'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { getHashVariables } from 'linkdrop-commons'
import config from 'config-claim'
import classNames from 'classnames'

@actions(({ tokens: { transactionId } }) => ({ transactionId }))
@translate('pages.main')
class ClaimingFinishedPage extends React.Component {
  render () {
    const { chainId } = getHashVariables()
    const { transactionId, amount, symbol } = this.props
    return <div className={commonStyles.container}>
      <Alert icon={<Icons.Check />} className={styles.alert} />
      <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.tokensClaimed', { tokens: `${amount || ''} ${symbol || ''}` }) }} />
      <div
        className={classNames(styles.description, {
          [styles.descriptionHidden]: !transactionId
        })}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.seeDetails', {
            transactionLink: `${Number(chainId) === 4 ? config.etherscanRinkeby : config.etherscanMainnet}${transactionId}`
          })
        }}
      />
    </div>
  }
}

export default ClaimingFinishedPage
