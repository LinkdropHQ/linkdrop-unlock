import React from 'react'
import styles from '../styles.module'
import classNames from 'classnames'
import { Slider, RetinaImage } from 'linkdrop-ui-kit'
import { getImages } from 'helpers'

export default ({ t, walletType, selectWallet, showSlider }) => {
  return <div className={styles.content}>
    <div onClick={_ => showSlider && showSlider()} className={styles.subtitle}>{t('titles.haveAnother')}</div>
    <Slider visibleSlides={4} className={styles.slider} step={4}>
      {WALLETS.map(wallet => renderImage({ id: wallet, walletType, selectWallet }))}
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

const WALLETS = ['trust', 'Coinbase', 'Opera', 'imtoken', 'Status', 'tokenpocket', 'gowallet', 'buntoy']
