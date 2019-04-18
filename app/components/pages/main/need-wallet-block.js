import React from 'react'
import { Button, Alert, Slider, Icons, RetinaImage } from 'linkdrop-ui-kit'
import { getImages } from 'helpers'

export default ({ styles, t, onClick }) => <div className={styles.container}>
  <Alert className={styles.alert} icon={<Icons.Exclamation />} />
  <div className={styles.title} dangerouslySetInnerHTML={{ __html: t('titles.needWallet') }} />
  <Button className={styles.button} onClick={_ => onClick && onClick()}>{t('titles.useTrustWallet')}</Button>
  <Slider visibleSlides={4} step={4}>
    {renderImage({ src: 'Metamask', styles })}
    {renderImage({ src: 'Coinbase', styles })}
    {renderImage({ src: 'Opera', styles })}
    {renderImage({ src: 'Status', styles })}
  </Slider>
</div>

const renderImage = ({ src, styles }) => {
  return <div className={styles.wallet}>
    <RetinaImage width={60} {...getImages({ src })} />
  </div>
}
