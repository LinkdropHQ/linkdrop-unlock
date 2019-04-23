import React from 'react'
import { Button, Alert, Icons, Slider, RetinaImage } from 'linkdrop-ui-kit'
import { translate, actions } from 'decorators'
import { getImages } from 'helpers'
import classNames from 'classnames'

import styles from './styles.module'
import commonStyles from '../styles.module'

@actions(({ user: { walletType } }) => ({ walletType }))
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
    const { walletType } = this.props
    if (walletType && walletType != null) {
      return this.renderWalletInstruction({ walletType })
    } else {
      return <div className={classNames(commonStyles.container, { [styles.sliderShown]: showSlider })}>
        <Alert className={styles.alert} icon={<Icons.Exclamation />} />
        <div className={styles.title}>{this.t('titles.needWallet')}</div>
        <Button target='_blank' href={deepLink} className={styles.button}>
          {this.t('buttons.useTrustWallet')}
        </Button>
        {this.renderSlider()}
      </div>
    }
  }

  renderSlider () {
    return <div className={styles.content}>
      <div onClick={_ => this.toggleSlider({ showSlider: true })} className={styles.subtitle}>{this.t('titles.haveAnother')}</div>
      <Slider visibleSlides={4} className={styles.slider} step={4}>
        {this.renderImage({ id: 'trust' })}
        {this.renderImage({ id: 'coinbase' })}
        {this.renderImage({ id: 'opera' })}
        {this.renderImage({ id: 'imtoken' })}
        {this.renderImage({ id: 'status' })}
        {this.renderImage({ id: 'tokenpocket' })}
        {this.renderImage({ id: 'gowallet' })}
        {this.renderImage({ id: 'buntoy' })}
      </Slider>
    </div>
  }

  renderWalletInstruction ({ walletType }) {
    const { showSlider } = this.state
    let instruction = ''
    switch (walletType) {
      case 'coinbase':
        instruction = this.renderInstruction({ walletType })
        break
      default:
        instruction = this.renderInstruction({ walletType })
    }
    return <div className={classNames(commonStyles.container, { [styles.sliderShown]: showSlider })}>
      <div className={classNames(styles.wallet, styles.withBorder, styles.walletPreview)}>
        <RetinaImage width={60} {...getImages({ src: walletType })} />
      </div>
      <div className={classNames(styles.title, styles.instructionTitle)}>{this.t('titles.howToClaim', { walletType })}</div>
      {instruction}
      <Button inverted className={styles.button}>
        {this.t('buttons.copyLink')}
      </Button>
      {this.renderSlider()}
    </div>
  }

  renderInstruction ({ walletType }) {
    const { title, href } = this.t(`walletsInstructions.${walletType}`, { returnObjects: true })
    return <div className={styles.instructions}>
      <div dangerouslySetInnerHTML={{
        __html: this.t('walletsInstructions.common._1', {
          href,
          title
        })
      }} />
      <div dangerouslySetInnerHTML={{ __html: this.t('walletsInstructions.common._2') }} />
      <div dangerouslySetInnerHTML={{ __html: this.t('walletsInstructions.common._3') }} />
    </div>
  }

  renderImage ({ id }) {
    const { walletType } = this.props
    if (walletType === id) { return null }
    if (walletType == null && id === 'trust') { return null }
    return <div
      className={classNames(styles.wallet, styles.withBorder)}
      onClick={_ => {
        this.toggleSlider({
          showSlider: false,
          callback: () => this.actions().user.setWalletType({ walletType: id })
        })
      }}
    >
      <RetinaImage width={60} {...getImages({ src: id })} />
    </div>
  }

  toggleSlider ({ showSlider = true, callback }) {
    this.setState({
      showSlider
    }, () => callback && callback())
  }
}

export default WalletChoosePage

const currentURI = window.location.href
const TRUST_URL = `https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=`
const deepLink = `${TRUST_URL}${encodeURIComponent(currentURI)}`
