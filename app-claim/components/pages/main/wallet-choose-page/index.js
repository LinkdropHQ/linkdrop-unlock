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
    return <div className={classNames(commonStyles.container, { [styles.sliderShown]: showSlider })}>
      <Alert className={styles.alert} icon={<Icons.Exclamation />} />
      <div className={styles.title}>{this.t('titles.needWallet')}</div>
      {this.renderInstruction({ walletType })}
      <Button target='_blank' href={deepLink} className={styles.button}>
        {this.t('buttons.useTrustWallet')}
      </Button>
      <div className={styles.content}>
        <div onClick={_ => this.toggleSlider()} className={styles.subtitle}>{this.t('titles.haveAnother')}</div>
        <Slider visibleSlides={4} className={styles.slider} step={4}>
          {this.renderImage({ src: 'Metamask', withBorder: true, id: 'metamask' })}
          {this.renderImage({ src: 'Coinbase', id: 'coinbase' })}
          {this.renderImage({ src: 'Opera', withBorder: true, id: 'opera' })}
          {this.renderImage({ src: 'Status', id: 'status' })}
        </Slider>
      </div>
    </div>
  }

  renderInstruction ({ walletType }) {
    if (!walletType || walletType === 'trust') { return null }
    const { title, href } = this.t(`walletsInstructions.${walletType}`, { returnObjects: true })
    console.log(this.t(`walletsInstructions.${walletType}`, { returnObjects: true }))
    console.log({ walletType })
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

  renderImage ({ src, withBorder, id }) {
    return <div
      className={classNames(styles.wallet, {
        [styles.withBorder]: withBorder
      })}
      onClick={_ => this.actions().user.setWalletType({ walletType: id })}
    >
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

const currentURI = window.location.href
const TRUST_URL = `https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=`
const deepLink = `${TRUST_URL}${encodeURIComponent(currentURI)}`
