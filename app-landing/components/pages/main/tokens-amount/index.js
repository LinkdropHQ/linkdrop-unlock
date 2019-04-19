import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import { Input, Button } from 'linkdrop-ui-kit'
import commonStyles from '../styles.module'
import { LinkBlock } from 'components/pages/common'

@translate('pages.main')
class TokensAmount extends React.Component {
  render () {
    const { onClick } = this.props
    const { value } = this.state || {}
    return <LinkBlock title={this.t('titles.sendTokens')}>
      <div className={styles.container}>
        <div className={commonStyles.description}>{this.t('descriptions.sendTokens')}</div>
        <Input mask='999' maskChar=' ' className={styles.input} onChange={value => this.setState({ value })} placeholder={this.t('titles.addAmount')} />
        <Button disabled={!value} onClick={_ => onClick && onClick(value)} className={styles.button}>{this.t('buttons.createLink')}</Button>
      </div>
    </LinkBlock>
  }
}

export default TokensAmount
