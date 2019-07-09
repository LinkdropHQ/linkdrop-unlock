import React from 'react'
import { actions, translate } from 'decorators'
import { Button } from 'components/common'
import styles from './styles.module'
import { RetinaImage } from 'linkdrop-ui-kit'
import { getImages } from 'helpers'
import classNames from 'classnames'

@actions(({ user: { currentAddress }, campaigns: { items } }) => ({ currentAddress, items }))
@translate('common.aside')
class Aside extends React.Component {
  render () {
    const { currentAddress, items } = this.props
    return <aside className={styles.container}>
      <div className={styles.mainBlock}>
        <div className={styles.logo}>
          <a href='/#/'><RetinaImage width={118} {...getImages({ src: 'hole' })} /></a>
        </div>
        {this.renderCampaignsButton({ currentAddress })}
        {this.renderCreateButton({ currentAddress, items })}
      </div>
      <div className={styles.footer}>
        <div className={styles.menu}>
          <a href={styles.link}>{this.t('legal')}</a>
          <a href={styles.link}>{this.t('contactUs')}</a>
        </div>
        <div className={styles.copyright}>
          {this.t('copyright')}
        </div>
        <div className={styles.dashboard}>
          {this.t('dashboard')}
        </div>
      </div>
    </aside>
  }

  renderCreateButton ({ currentAddress, items }) {
    return <Button
      className={styles.button}
      onClick={_ => {
        if (!currentAddress) { return }
        const { privateKey } = this.props
        if (privateKey) {
          this.actions().user.setStep({ step: 2 })
        } else {
          this.actions().user.setStep({ step: 1 })
        }
        window.location.href = '/#/campaigns/create'
      }}
      disabled={!currentAddress || items.length > 0}
    >
      {this.t('create')}
    </Button>
  }

  renderCampaignsButton ({ currentAddress }) {
    return <div className={classNames(styles.campaigns, {
      [styles.disabled]: !currentAddress
    })}>
      <a onClick={e => {
        if (!currentAddress) { e.preventDefault() }
      }} href='/#/campaigns'>{this.t('campaigns')}</a>
    </div>
  }
}

export default Aside
