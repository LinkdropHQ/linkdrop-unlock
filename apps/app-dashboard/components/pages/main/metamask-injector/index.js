import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Button } from 'components/common'

@actions(_ => ({}))
@translate('pages.main')
class MetamaskInjector extends React.Component {
  render () {
    return <div className={styles.container}>
      <h2 className={styles.title}>{this.t('titles.metamaskSignIn')}</h2>
      <h3 className={styles.subtitle}>{this.t('titles.metamaksInstruction')}</h3>
      <Button>{this.t('buttons.signIn')}</Button>
    </div>
  }
}

export default MetamaskInjector
