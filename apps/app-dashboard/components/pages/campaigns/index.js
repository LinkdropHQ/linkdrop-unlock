import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Linkdrop, ActionBlock } from 'components/common'
import config from 'config-dashboard'

@actions(({ user: { chainId, txHash, transactionStatus }, metamask: { status: metamaskStatus }, campaigns: { items } }) => ({ items, transactionStatus, chainId, txHash, metamaskStatus }))
@translate('pages.campaigns')
class Campaigns extends React.Component {
  render () {
    const { items, chainId } = this.props
    const itemsForCurrentChainId = items.filter(item => item.chainId === chainId)
    return <div className={styles.container}>
      {itemsForCurrentChainId.map(linkdrop => <Linkdrop
        key={linkdrop.id}
        {...linkdrop}
        chainId={chainId}
      />)}
      <ActionBlock
        transparent
        title={this.t('createCampaign')}
        description={this.t('createCampaignDescription')}
        extraContent={this.t('ercAndEth')}
        href='/#/campaigns/create'
        buttonTitle={this.t('create')}
      />
    </div>
  }
}

export default Campaigns
