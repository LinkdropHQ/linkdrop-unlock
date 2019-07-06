import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Linkdrop, ActionBlock } from 'components/common'

@actions(({ campaigns: { items } }) => ({ items }))
@translate('pages.campaigns')
class Campaigns extends React.Component {
  render () {
    const { items } = this.props
    return <div className={styles.container}>
      {items.map(linkdrop => <Linkdrop
        key={linkdrop.id}
        {...linkdrop}
      />)}
      <ActionBlock
        transparent
        title={this.t('createLinkdrop')}
        description={this.t('createLinkdropDescription')}
        extraContent={this.t('ercAndEth')}
        onClick
        href='/#/campaigns/create'
        buttonTitle={this.t('create')}
      />
    </div>
  }
}

export default Campaigns
