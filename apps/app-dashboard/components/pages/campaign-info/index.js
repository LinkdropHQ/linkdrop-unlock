import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'

@actions(_ => ({}))
@translate('pages.campaignInfo')
class CampaignInfo extends React.Component {
  render () {
    return <div className={styles.container}>
      bla bla i am campaign info page
    </div>
  }
}

export default CampaignInfo
