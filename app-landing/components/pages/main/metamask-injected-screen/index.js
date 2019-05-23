import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Select, Input } from 'linkdrop-ui-kit'
import { LinkBlock } from 'components/pages/common'

@actions(() => ({}))
@translate('pages.main')
class MetamaskInjectedScreen extends React.Component {
  componentDidMount () {
    const { account } = this.props
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
