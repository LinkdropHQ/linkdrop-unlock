import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import { Select, Input } from 'linkdrop-ui-kit'
import { LinkBlock } from 'components/pages/common'

@translate('pages.main')
class MetamaskInjectedScreen extends React.Component {
  componentDidMount () {
    const { wallet } = this.props
    this.actions().tokens.getAssets({ account })
  }

  render () {
    return <LinkBlock>
      <div className={styles.container}>
        <Select />
        <Input />
      </div>
    </LinkBlock>
  }
}

export default MetamaskInjectedScreen
