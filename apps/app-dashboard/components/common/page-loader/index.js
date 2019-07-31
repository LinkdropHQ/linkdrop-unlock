import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'
import { Loading } from 'linkdrop-ui-kit'

@translate('common.pageLoader')
class PageLoader extends React.Component {
  render () {
    return <div className={styles.container}>
      <Loading />
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('loading') }} />
    </div>
  }
}

export default PageLoader
