import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Input } from 'linkdrop-ui-kit'

@actions(() => ({}))
@translate('pages.main')
class CustomAssetAddressInput extends React.Component {
  render () {
    const { networkId, account, onChange, value } = this.props
    return <Input
      value={value}
      className={styles.input}
      placeholder={this.t('titles.tokenAddress')}
      onChange={({ value }) => {
        this.setState({
          value
        }, _ => {
          this.actions().metamask.getAssetBalance({ networkId, tokenAddress: value, account })
          onChange && onChange({ value })
        })
      }}
    />
  }
}

export default CustomAssetAddressInput
