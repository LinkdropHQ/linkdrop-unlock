import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import { Button } from 'linkdrop-ui-kit'

@translate('pages.main')
class LearnMore extends React.Component {
  render () {
    return <div className={styles.container}>
      <div className={styles.title}>{this.t('titles.everydayUsers')}</div>
      <div className={styles.description}>{this.t('descriptions.sendLinks')}</div>
      <Button inverted className={styles.button}>
        {this.t('buttons.learnMore')}
      </Button>
      <div className={styles.menu}>
        <a className={styles.menuItem}>
          {this.t('titles.seeGit')}
        </a>
        <a className={styles.menuItem}>
          {this.t('titles.join')}
        </a>
        <a className={styles.menuItem}>
          {this.t('titles.followOnTwitter')}
        </a>
      </div>
    </div>
  }
}

export default LearnMore
