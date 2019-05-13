import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'

@translate('components.footer')
class Footer extends React.Component {
  render () {
    return <footer className={styles.container}>
      <div className={styles.content}>
        <div>{this.t('copyright', { year: new Date().getFullYear() })}</div>
        {MENU_ITEMS.map(item => <a key={item} href={this.t(`${item}.url`)}>{this.t(`${item}.title`)}</a>)}
      </div>
    </footer>
  }
}

export default Footer

const MENU_ITEMS = ['termsOfService', 'privacy', 'contactUs', 'twitter', 'blog']
