import React from 'react'
import styles from './styles.module'
import { Loading } from 'linkdrop-ui-kit'
import { LinkBlock } from 'components/pages/common'

class LoadingScreen extends React.Component {
  render () {
    return <LinkBlock>
      <Loading className={styles.loading} />
    </LinkBlock>
  }
}

export default LoadingScreen
