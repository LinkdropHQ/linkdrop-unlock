import React from 'react'
import { Button, Alert, Icons, Slider, RetinaImage } from 'components/common'
import { translate } from 'decorators'
import classNames from 'classnames'

import styles from './styles.module'
import commonStyles from '../styles.module'

@translate('pages.main')
class WalletChoosePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSlider: false
    }
  }
  render () {
    const { showSlider } = this.state
    const { onClick } = this.props
    return <div className={classNames(commonStyles.container, { [styles.sliderShown]: showSlider })}>
      <Alert className={styles.alert} icon={<Icons.Exclamation />} />
      <div className={styles.title}>{this.t('titles.needWallet')}</div>
      <Button className={styles.button} onClick={_ => onClick && onClick()}>
        {this.t('buttons.useTrustWallet')}
      </Button>
      <div className={styles.content}>
        <div onClick={_ => this.toggleSlider()} className={styles.subtitle}>{this.t('titles.haveAnother')}</div>
        <Slider visibleSlides={4} className={styles.slider} step={4}>
          <div className={styles.wallet}><RetinaImage fileName='Metamask' /></div>
          <div className={styles.wallet}><RetinaImage fileName='Coinbase' /></div>
          <div className={styles.wallet}><RetinaImage fileName='Opera' /></div>
          <div className={styles.wallet}><RetinaImage fileName='Status' /></div>
        </Slider>
      </div>
    </div>
  }

  toggleSlider () {
    this.setState({
      showSlider: true
    })
  }
}

export default WalletChoosePage
