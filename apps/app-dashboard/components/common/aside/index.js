import React from 'react'
import { actions, translate } from 'decorators'
import { Button } from 'components/common'
import styles from './styles.module'
import { RetinaImage } from 'linkdrop-ui-kit'
import { getImages } from 'helpers'

@actions(_ => ({}))
@translate('common.aside')
class Aside extends React.Component {
  render () {
    return <aside className={styles.container}>
      <div className={styles.mainBlock}>
        <div className={styles.logo}>
          <RetinaImage width={118} {...getImages({ src: 'hole' })} />
        </div>
        <div className={styles.campaigns}>
          <a href='/#/campaigns'>{this.t('campaigns')}</a>
        </div>
        <Button className={styles.button} href='/#/campaigns/create'>
          {this.t('create')}
        </Button>
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
}

export default Aside
