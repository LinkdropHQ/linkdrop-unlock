import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Linkdrop, ActionBlock } from 'components/common'

@actions(({ user: { chainId }, campaigns: { items } }) => ({ items, chainId }))
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
      {items.length === 0 && <ActionBlock
        transparent
        title={this.t('createLinkdrop')}
        description={this.t('createLinkdropDescription')}
        extraContent={this.t('ercAndEth')}
        href='/#/campaigns/create'
        buttonTitle={this.t('create')}
      />}
    </div>
  }
}

export default Campaigns
