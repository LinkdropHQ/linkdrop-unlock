import React from 'react'
import styles from './styles.module'
import { Aside, Header } from 'components/common'
import { translate } from 'decorators'

@translate('pages.page')
class Page extends React.Component {
  render () {
    return <div className={styles.container}>
      <Aside />
      <div className={styles.main}>
        <Header />
        {this.props.children}
      </div>
    </div>
  }
}

export default Page
