import React from 'react'
import { actions, translate } from 'decorators'
import styles from '../styles.module'
import { Input } from 'components/common'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class TokenAddressERC20Input extends React.Component {
  render () {
    const { tokenAddress, setField } = this.props
    return <div className={styles.tokenAddress}>
      <h3 className={styles.subtitle}>{this.t('titles.tokenAddress')}</h3>
      <div className={styles.tokensAddressContainer}>
        <Input className={styles.inputFullSize} value={tokenAddress || ''} onChange={({ value }) => setField({ field: 'tokenAddress', value })} />
      </div>
    </div>
  }
}

export default TokenAddressERC20Input
