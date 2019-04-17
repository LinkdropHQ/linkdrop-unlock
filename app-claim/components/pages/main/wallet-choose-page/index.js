import React from 'react'
import { Button, Alert, Icons, Slider, RetinaImage } from 'linkdrop-ui-kit'
import { translate } from 'decorators'
import { getImages } from 'helpers'
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
          {this.renderImage({ src: 'Metamask' })}
          {this.renderImage({ src: 'Coinbase' })}
          {this.renderImage({ src: 'Opera' })}
          {this.renderImage({ src: 'Status' })}
        </Slider>
      </div>
    </div>
  }

  renderImage ({ src }) {
    return <div className={styles.wallet}>
      <RetinaImage width={60} {...getImages({ src })} />
    </div>
  }

  toggleSlider () {
    this.setState({
      showSlider: true
    })
  }
}

export default WalletChoosePage
