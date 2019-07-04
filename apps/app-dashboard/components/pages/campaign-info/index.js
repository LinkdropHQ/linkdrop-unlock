import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import Info from '../campaign-create/step-6'

@actions(_ => ({}))
@translate('pages.campaignInfo')
class CampaignInfo extends React.Component {
  render () {
    const campaignToCheck = ((this.props.match || {}).params || {}).id
    return <div className={styles.container}>
      <Info campaignToCheck={campaignToCheck} />
    </div>
  }
}

export default CampaignInfo
