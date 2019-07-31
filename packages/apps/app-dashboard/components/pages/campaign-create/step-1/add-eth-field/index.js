import React from 'react'
import { actions, translate } from 'decorators'
import styles from '../styles.module'
import { Button, Input } from 'components/common'
import { Icons } from '@linkdrop/ui-kit'
import { convertFromExponents } from '@linkdrop/commons'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class AddEthField extends React.Component {
  render () {
    const { addEth, ethAmount, tokenType, setField } = this.props
    if (tokenType === 'eth') return null
    if (!addEth) {
      return <div className={styles.ethAddButton}>
        <Button
          transparent
          className={styles.extraButton}
          onClick={_ => setField({ field: 'addEth', value: true })}
        >
          {this.t('buttons.addEth')}
        </Button>
      </div>
    }
    return <div className={styles.ethAddInput}>
      <span>+</span>
      <Input
        numberInput
        suffix='ETH'
        className={styles.ethInput}
        value={ethAmount || 0}
        onChange={({ value }) => setField({ field: 'ethAmount', value: parseFloat(value) })}
      />
      <Icons.CloseButton
        onClick={_ => setField({ field: 'addEth', value: false })}
      />
    </div>
  }
}

export default AddEthField
