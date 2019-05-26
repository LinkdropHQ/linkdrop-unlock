import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Select, Input } from 'linkdrop-ui-kit'
import { LinkBlock } from 'components/pages/common'

@actions(({ tokens: { assets } }) => ({ assets }))
@translate('pages.main')
class MetamaskInjectedScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentAsset: null
    }
  }
  componentDidMount () {
    const { account } = this.props
    this.actions().tokens.getAssets({ account })
  }

  render () {
    const { assets } = this.props
    const { currentAsset } = this.state
    return <LinkBlock>
      <div className={styles.container}>
        <Select
          placeholder={this.t(`titles.chooseAsset`)}
          options={assets.map(({ contract: { name, symbol, address } }) => ({ value: address, label: symbol }))}
          value={currentAsset}
          onChange={({ value }) => {
            console.log({ value })
            this.setState({ currentAsset: value }
            )
          }}
        />
        <Input />
      </div>
    </LinkBlock>
  }
}

export default MetamaskInjectedScreen
