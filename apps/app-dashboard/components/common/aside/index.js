import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'

@actions(_ => ({}))
@translate('pages.main')
class Aside extends React.Component {
  render () {
    return <aside className={styles.container}>
      aside
    </aside>
  }
}

export default Aside
