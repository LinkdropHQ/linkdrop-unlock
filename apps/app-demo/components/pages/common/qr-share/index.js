import React from 'react'
import styles from './styles.module'
import QRCode from 'qrcode.react'
import { Button } from 'linkdrop-ui-kit'

export default ({ onClose, value = '', t }) => <div className={styles.container}>
  <div className={styles.mainTitle}>
    {t('titles.scanCode')}
  </div>
  <div className={styles.qr}>
    <QRCode size={200} value={value} />
  </div>
  <Button inverted onClick={_ => onClose && onClose()} className={styles.button}>
    {t('buttons.close')}
  </Button>
</div>
