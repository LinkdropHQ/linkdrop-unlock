import React from 'react'
import { translate } from 'decorators'
import { Button } from 'linkdrop-ui-kit'
import styles from './styles.module'

@translate('components.footer')
class Footer extends React.Component {
  render () {
    return <footer className={styles.container}>
      <div className={styles.content}>
        <Button size='small'>{this.t('funded')}</Button>
        <div>{this.t('copyright', { year: new Date().getFullYear() })}</div>
        <a>{this.t('contactUs')}</a>
        <a>{this.t('twitter.title')}</a>
        <a>{this.t('blog.title')}</a>
      </div>
    </footer>
  }
}

export default Footer
