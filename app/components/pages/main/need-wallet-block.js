import React from 'react'
import { Button, Alert, Slider, Icons } from 'components/common'

export default ({ styles, t, onClick }) => <div className={styles.container}>
  <Alert className={styles.alert} icon={<Icons.Exclamation />} />
  <div className={styles.title} dangerouslySetInnerHTML={{ __html: t('titles.needWallet') }} />
  <Button onClick={_ => onClick && onClick()}>{t('titles.useTrustWallet')}</Button>
  <Slider />
</div>
