import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Web3Consumer } from 'web3-react'
import Step1 from './step-1'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class CampaignCreate extends React.Component {
  componentDidMount () {
    this.actions().user.setStep({ step: 1 })
  }

  componentWillUnmount () {
    this.actions().user.setStep({ step: null })
  }

  render () {
    return <Web3Consumer>
      {context => <div className={styles.container}>
        <Step1 />
      </div>}
    </Web3Consumer>
  }
}

export default CampaignCreate
