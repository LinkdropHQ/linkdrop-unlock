import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Linkdrop, ActionBlock } from 'components/common'

@actions(_ => ({}))
@translate('pages.campaigns')
class Campaigns extends React.Component {
  render () {
    return <div className={styles.container}>
      {LINKDROPS.map(linkdrop => <Linkdrop
        key={linkdrop.id}
        {...linkdrop}
      />)}
      <ActionBlock
        transparent
        title={this.t('createLinkdrop')}
        description={this.t('createLinkdropDescription')}
        extraContent={this.t('ercAndEth')}
        onClick
        buttonTitle={this.t('create')}
      />
    </div>
  }
}

export default Campaigns

const LINKDROPS = [
  {
    tokenAmount: 100,
    tokenSymbol: 'BNB',
    ethAmount: 0.1,
    created: '2008-09-15T15:53:00+05:00',
    status: 'active',
    linksAmount: 10,
    id: +(new Date()) + Math.random()
  }, {
    tokenAmount: 100,
    tokenSymbol: 'BNB',
    created: '2008-09-15T15:53:00+05:00',
    status: 'active',
    linksAmount: 10,
    id: +(new Date()) + Math.random()
  }, {
    tokenAmount: 100,
    tokenSymbol: 'BNB',
    ethAmount: 0.1,
    created: '2008-09-15T15:53:00+05:00',
    status: 'active',
    linksAmount: 10,
    id: +(new Date()) + Math.random()
  }
]

// tokenAmount,
// tokenSymbol,
// ethAmount,
// created,
// status,
// linksAmount,
// id
