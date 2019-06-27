import React from 'react'
import styles from './styles.module'
import { Aside, Header } from 'components/common'
import { translate } from 'decorators'
import { Scrollbars } from 'react-custom-scrollbars'

@translate('pages.page')
class Page extends React.Component {
  render () {
    return <div className={styles.container}>
      <Aside />
      <div className={styles.mainWrapper}>
        <Scrollbars style={{ heigth: '100%', width: '100%' }}>
          <div className={styles.main}>
            <Header />
            {this.props.children}
          </div>
        </Scrollbars>
      </div>
    </div>
  }
}

export default Page
