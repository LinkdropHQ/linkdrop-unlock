import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Input } from 'linkdrop-ui-kit'

@actions(() => ({}))
@translate('pages.main')
class CustomAssetAddressInput extends React.Component {
  render () {
    const { onChange, disabled } = this.props
    return <Input
      disabled={disabled}
      className={styles.input}
      placeholder={this.t('titles.tokenAddress')}
      onChange={({ value }) => {
        this.setState({
          value
        }, _ => {
          onChange && onChange({ value })
        })
      }}
    />
  }
}

export default CustomAssetAddressInput
