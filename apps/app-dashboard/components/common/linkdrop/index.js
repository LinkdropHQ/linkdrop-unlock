import React from 'react'
import styles from './styles.module'
import { Button } from 'components/common'
import classNames from 'classnames'
import { translate } from 'decorators'
import moment from 'moment'
import config from 'config-dashboard'
moment.locale('en-gb')

@translate('common.linkdrop')
class Linkdrop extends React.Component {
  render () {
    const {
      tokenAmount,
      tokenSymbol,
      ethAmount,
      created,
      status,
      chainId,
      linksAmount,
      tokenType,
      id
    } = this.props
    const checkAddressUrl = `${Number(chainId) === 1 ? config.etherscanMainnet : config.etherscanRinkeby}/${id}`
    return <div className={styles.container}>
      {this.renderTitle({ tokenAmount, tokenSymbol, ethAmount, tokenType, linksAmount })}
      {this.renderStatus({ status })}
      {this.renderDate({ created })}
      {this.renderLinksData({ linksAmount, tokenAmount, tokenSymbol, ethAmount, tokenType })}
      <div className={styles.buttons}>
        <Button href={`/#/campaigns/${id}`} transparent className={styles.button}>{this.t('links')}</Button>
        <Button href={checkAddressUrl} target='_blank' transparent className={styles.button}>{this.t('viewContract')}</Button>
      </div>
    </div>
  }

  renderTitle ({ tokenAmount, tokenSymbol, ethAmount, tokenType, linksAmount }) {
    if (tokenType === 'erc20' && !ethAmount) {
      return <div className={styles.title}>{`${this.t('linkdrop')}: ${tokenAmount * linksAmount} ${tokenSymbol}` }</div>
    }
    if (tokenType === 'erc20' && ethAmount) {
      return <div className={styles.title}>{`${this.t('linkdrop')}: ${tokenAmount * linksAmount} ${tokenSymbol} + ${this.t('eth')}` }</div>
    }
    if (tokenType === 'eth' && ethAmount) {
      return <div className={styles.title}>{`${this.t('linkdrop')}: ${ethAmount * linksAmount} ETH` }</div>
    }
    return null
  }

  renderStatus ({ status }) {
    return <div
      className={classNames(styles.status, {
        [styles.active]: status === 'active'
      })}
    >
      {this.t('status')}: <span>{status}</span>
    </div>
  }

  renderDate ({ created }) {
    if (!created) { return }
    return <div className={styles.date}>
      {this.t('created')}: <span>{moment(created).format('LL')}</span>
    </div>
  }

  renderLinksData ({ linksAmount, tokenAmount, tokenSymbol, ethAmount, tokenType }) {
    if (tokenType === 'eth' && ethAmount) {
      return <div className={styles.links}>
        {linksAmount} {this.t('linksCount')} / {ethAmount} ETH
      </div>
    }
    if (tokenType === 'erc20' && linksAmount && tokenAmount && tokenSymbol && ethAmount) {
      return <div className={styles.links}>
        {linksAmount} {this.t('linksCount')} / {tokenAmount} {tokenSymbol} + {ethAmount} ETH
      </div>
    }

    return <div className={styles.links}>
      {linksAmount} {this.t('linksCount')} / {tokenAmount} {tokenSymbol}
    </div>
  }
}

export default Linkdrop
