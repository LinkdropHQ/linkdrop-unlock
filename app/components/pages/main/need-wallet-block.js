import React from 'react'
import { Button, Alert, Slider, Icons, RetinaImage } from 'components/common'

export default ({ styles, t, onClick }) => <div className={styles.container}>
  <Alert className={styles.alert} icon={<Icons.Exclamation />} />
  <div className={styles.title} dangerouslySetInnerHTML={{ __html: t('titles.needWallet') }} />
  <Button className={styles.button} onClick={_ => onClick && onClick()}>{t('titles.useTrustWallet')}</Button>
  <Slider visibleSlides={4} step={4}>
    <RetinaImage fileName='Metamask' />
    <RetinaImage fileName='Coinbase' />
    <RetinaImage fileName='Opera' />
    <RetinaImage fileName='Status' />
    <RetinaImage fileName='Metamask' />
    <RetinaImage fileName='Coinbase' />
    <RetinaImage fileName='Opera' />
    <RetinaImage fileName='Status' />
  </Slider>
</div>
