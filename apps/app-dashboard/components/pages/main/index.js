import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { ActionBlock } from 'components/common'

@actions(({ user: { currentAddress }, campaigns: { items } }) => ({ currentAddress, items }))
@translate('pages.main')
class Main extends React.Component {
  render () {
    const { items } = this.props
    return <div className={styles.container}>
      {items.length === 0 && <ActionBlock
        title='Create a Linkdrop'
        description='List of links with encoded tokens prepared to distribute'
        extraContent='ERC20 + ETH'
        href='/#/campaigns/create'
        buttonTitle='Create'
      />}
      <ActionBlock
        transparent
        title='Referral Marketing'
        description='Incentivize customer acquisition via referral links'
        extraContent='ERC721 / ERC20 + ETH'
        onClick
        buttonTitle='Conact Us'
      />
    </div>
  }
}

export default Main
