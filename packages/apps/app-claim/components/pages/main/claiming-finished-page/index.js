import React from 'react'
import { Alert, Icons, Button } from '@linkdrop/ui-kit'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { getHashVariables, defineEtherscanUrl } from '@linkdrop/commons'
import classNames from 'classnames'

@actions(({
  user: { claimedByUser },
  tokens: { transactionId }
}) => ({
  claimedByUser,
  transactionId
}))
@translate('pages.main')
class ClaimingFinishedPage extends React.Component {
  render () {
    const { chainId, article = 'https://www.forbes.com/crypto-blockchain/' } = getHashVariables()
    const { transactionId, amount, claimedByUser, symbol } = this.props
    return <div className={commonStyles.container}>
      <Alert icon={<Icons.Check />} className={styles.alert} />
      <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t(`titles.${claimedByUser ? 'tokensClaimed' : 'tokensClaimedBySomeone'}`, { tokens: 'Unlock key' }) }} />
      <div
        className={classNames(styles.description, {
          [styles.descriptionHidden]: !transactionId
        })}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.instructions', {
            transactionLink: `${defineEtherscanUrl({ chainId })}tx/${transactionId}`
          })
        }}
      />
      {this.renderArticleButton({ article })}
    </div>
  }

  renderArticleButton ({ article }) {
    if (article) { return <Button target='_blank' className={styles.button} href={decodeURIComponent(article)}>{this.t('buttons.readArticle')}</Button> }
  }
}

export default ClaimingFinishedPage
