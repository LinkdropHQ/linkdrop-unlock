import React from 'react'
import styles from '../styles.module'
import classNames from 'classnames'
import { Slider, RetinaImage } from 'linkdrop-ui-kit'
import { getImages } from 'helpers'

export default ({ t, walletType, selectWallet, showSlider, platform }) => {
  return <div className={styles.content}>
    <div onClick={_ => showSlider && showSlider()} className={styles.subtitle}>{t('titles.haveAnother')}</div>
    <Slider visibleSlides={4} className={styles.slider} step={4}>
      {(platform === 'ios' ? IOS_WALLETS : ANDROID_WALLETS).map(wallet => renderImage({ id: wallet, walletType, selectWallet }))}
    </Slider>
  </div>
}

const renderImage = ({ id, walletType, selectWallet }) => {
  if (walletType === id) { return null }
  if (walletType == null && id === 'trust') { return null }
  return <div
    className={classNames(styles.wallet, styles.withBorder)}
    onClick={_ => selectWallet && selectWallet({ id })}
  >
    <RetinaImage width={60} {...getImages({ src: id })} />
  </div>
}

const ANDROID_WALLETS = ['trust', 'coinbase', 'opera', 'imtoken', 'status', 'gowallet', 'buntoy']
const IOS_WALLETS = ['trust', 'coinbase', 'imtoken', 'status', 'tokenpocket']
