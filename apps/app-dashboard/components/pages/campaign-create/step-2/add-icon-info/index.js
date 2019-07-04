import React from 'react'
import { actions, translate } from 'decorators'
import styles from '../styles.module'
import { Button } from 'components/common'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class AddIconInfo extends React.Component {
  render () {
    const { addIconInfo } = this.props
    if (!addIconInfo) {
      return <div className={styles.iconInfoButton}>
        <Button transparent className={styles.extraButton} onClick={_ => this.setField({ field: 'addIconInfo', value: true })}>{this.t('buttons.addTokenIcon')}</Button>
      </div>
    }
    return <div className={styles.iconInfoText}>
      <span>{this.t('titles.howTo')}</span>
      <div dangerouslySetInnerHTML={{ __html: this.t('titles.addIcon') }} />
    </div>
  }
}

export default AddIconInfo
