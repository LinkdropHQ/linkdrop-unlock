import React from 'react'
import { Button, Alert, Icons, RetinaImage } from '@linkdrop/ui-kit'
import { translate, actions, platform } from 'decorators'
import { getImages, getWalletLink, getWalletData } from 'helpers'
import { copyToClipboard, getHashVariables } from '@linkdrop/commons'
import classNames from 'classnames'
import styles from './styles.module'
import commonStyles from '../styles.module'
import CommonInstruction from './common-instruction'
import DeepLinkInstruction from './deep-link-instruction'
import Slider from './slider'

@actions(({ user: { walletType } }) => ({ walletType }))
@translate('pages.main')
@platform()
class WalletChoosePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSlider: null
    }
  }

  render () {
    const { showSlider } = this.state
    const { walletType } = this.props
    const { platform } = this
    const { w = 'opera' } = getHashVariables()
    if (walletType && walletType != null) {
      return this.renderWalletInstruction({ walletType })
    } else {
      const buttonLink = platform !== 'desktop' && getWalletLink({ platform, wallet: w, currentUrl: window.location.href })
      const buttonTitle = getWalletData({ wallet: w }).name
      return <div className={classNames(commonStyles.container, styles.container, {
        [styles.sliderShow]: showSlider,
        [styles.sliderHide]: showSlider === false
      })}
      >
        <Alert className={styles.alert} icon={<Icons.Exclamation />} />
        <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.needWallet') }} />
        {platform !== 'desktop' && <Button href={buttonLink} target='_blank' className={styles.button}>
          {this.t('buttons.useWallet', { wallet: buttonTitle })}
        </Button>}
        {this.renderSlider({ walletType })}
      </div>
    }
  }

  renderWalletInstruction ({ walletType }) {
    const { showSlider } = this.state
    const { name: walletTitle, walletURL } = getWalletData({ wallet: walletType })
    let instruction = ''
    switch (walletType) {
      case 'trust':
        break
      case 'status':
      case 'imtoken':
      case 'opera':
        instruction = this.renderDeepLinkInstruction({ walletType, title: walletTitle, href: walletURL })
        break
      default:
        instruction = this.renderCommonInstruction({ walletType, title: walletTitle, href: walletURL })
    }
    return <div className={classNames(commonStyles.container, styles.container, {
      [styles.sliderShow]: showSlider,
      [styles.sliderHide]: showSlider === false
    })}
    >
      <div className={classNames(styles.wallet, styles.withBorder, styles.walletPreview)}>
        <RetinaImage width={60} {...getImages({ src: walletType })} />
      </div>
      <div className={classNames(styles.title, styles.instructionTitle)}>{this.t('titles.howToClaim', { wallet: walletTitle })}</div>
      {instruction}
      {this.renderInstructionButton({ walletType })}
      {this.renderSlider({ walletType })}
    </div>
  }

  renderInstructionButton ({ walletType }) {
    const { platform } = this
    switch (walletType) {
      case 'trust':
      case 'imtoken':
      case 'status':
      case 'opera': {
        const buttonTitle = getWalletData({ wallet: walletType }).name
        const buttonLink = getWalletLink({ platform, wallet: walletType, currentUrl: window.location.href })
        return <Button href={platform !== 'desktop' && buttonLink} className={styles.button}>
          {buttonTitle}
        </Button>
      }
      default:
        return <Button inverted onClick={_ => copyToClipboard({ value: window.location.href })} className={styles.button}>
          {this.t('buttons.copyLink')}
        </Button>
    }
  }

  renderCommonInstruction ({ walletType, title, href }) {
    return <CommonInstruction walletType={walletType} styles={styles} t={this.t} title={title} href={href} />
  }

  renderDeepLinkInstruction ({ walletType, title, href }) {
    return <DeepLinkInstruction walletType={walletType} styles={styles} t={this.t} title={title} href={href} />
  }

  renderSlider ({ walletType }) {
    const { platform } = this
    return <Slider
      t={this.t}
      platform={platform}
      walletType={walletType}
      selectWallet={({ id }) => {
        this.toggleSlider({
          showSlider: false,
          callback: () => this.actions().user.setWalletType({ walletType: id })
        })
      }}
      showSlider={_ => {
        this.toggleSlider({
          showSlider: true
        })
      }}
    />
  }

  toggleSlider ({ showSlider = true, callback }) {
    this.setState({
      showSlider
    }, () => callback && callback())
  }
}

export default WalletChoosePage
