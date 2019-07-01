import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Web3Consumer } from 'web3-react'
import { ProgressBar } from 'components/common'

@actions(({ campaigns: { ethAmount, tokenAmount, linksAmount, tokenSymbol } }) => ({ ethAmount, tokenAmount, linksAmount, tokenSymbol }))
@translate('pages.campaignCreate')
class Step5 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      linksFinished: 0
    }
  }

  componentDidMount () {
    const { linksAmount } = this.props
    this.linksCreation = window.setInterval(_ => {
      const { linksFinished } = this.state
      this.setState({ linksFinished: linksFinished + 1 }, _ => {
        if (Number(linksFinished + 1) === Number(linksAmount)) {
          window.clearInterval(this.linksCreation)
          this.actions().user.setStep({ step: 6 })
        }
      })
    }, 300)
  }

  render () {
    const { linksFinished } = this.state
    const { linksAmount } = this.props
    return <Web3Consumer>
      {context => <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.title}>{this.t('titles.generatingLinks')}</div>
          <div className={styles.subtitle} dangerouslySetInnerHTML={{ __html: this.t('titles.loadingProcess') }} />
          <ProgressBar current={linksFinished} max={linksAmount} />
        </div>
      </div>}
    </Web3Consumer>
  }
}

export default Step5
