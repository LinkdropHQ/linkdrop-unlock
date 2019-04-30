import React from 'react'
import { Alert, Icons, Button } from 'linkdrop-ui-kit'
import { translate } from 'decorators'
import { shortenString } from 'linkdrop-commons'
import text from 'texts'
import { Web3Consumer } from 'web3-react'

import styles from './styles.module'
import commonStyles from '../styles.module'
@translate('pages.main')
class InitialPage extends React.Component {
  render () {
    const { onClick, amount, symbol, icon, loading } = this.props
    return <Web3Consumer>{context => <div className={commonStyles.container}>
      <Alert noBorder={icon} className={styles.tokenIcon} icon={icon ? <img className={styles.icon} src={icon} /> : <Icons.Star />} />
      <div className={styles.title}>
        <span>{amount}</span> {symbol}
      </div>
      <Button loading={loading} className={styles.button} onClick={_ => onClick && onClick()}>
        {text('common.buttons.claim')}
      </Button>
      {context.account && <div className={styles.wallet} dangerouslySetInnerHTML={{ __html: this.t('titles.claimTo', { wallet: shortenString({ wallet: context.account }) }) }} />}
    </div>}</Web3Consumer>
  }
}

export default InitialPage
