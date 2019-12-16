import React from 'react'
import { RetinaImage, Button } from '@linkdrop/ui-kit'
import { translate, actions } from 'decorators'
import { shortenString } from '@linkdrop/commons'
import text from 'texts'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { getImages } from 'helpers'

@actions(({ tokens: { name } }) => ({ name }))
@translate('pages.main')
class InitialPage extends React.Component {
  render () {
    const { onClick, amount, symbol, loading, wallet, name } = this.props
    return <div className={commonStyles.container}>
      <div className={styles.tokenIcon}>
        <RetinaImage width={100} {...getImages({ src: 'unlock' })} />
      </div>
      <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.claimUnlock', { name }) }} />
      <Button loading={loading} className={styles.button} onClick={_ => onClick && onClick()}>
        {text('common.buttons.claim')}
      </Button>
      <div
        className={styles.terms} dangerouslySetInnerHTML={{
          __html: this.t('titles.agreeWithTerms', {
            href: 'https://www.notion.so/Terms-and-Privacy-dfa7d9b85698491d9926cbfe3c9a0a58'
          })
        }}
      />
      {wallet && <div className={styles.wallet} dangerouslySetInnerHTML={{ __html: this.t('titles.claimTo', { wallet: shortenString({ wallet }) }) }} />}
    </div>
  }
}

export default InitialPage
