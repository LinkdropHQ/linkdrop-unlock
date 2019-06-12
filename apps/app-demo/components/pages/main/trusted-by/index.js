import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import { RetinaImage } from 'linkdrop-ui-kit'
import { getImages } from 'helpers'

@translate('pages.main')
class TrustedBy extends React.Component {
  render () {
    return <div className={styles.container}>
      <div className={styles.title}>{this.t('titles.trusted')}</div>
      <div className={styles.content}>
        <div className={styles.imgRow}>
          <RetinaImage className={styles.img} width={200} {...getImages({ src: 'coinbase' })} />
          <RetinaImage className={styles.img} width={100} {...getImages({ src: 'maker' })} />
          <RetinaImage className={styles.img} width={250} {...getImages({ src: 'binance' })} />
        </div>

        <div className={styles.imgRow}>
          <RetinaImage className={styles.img} width={180} {...getImages({ src: 'opera' })} />
          <RetinaImage className={styles.img} width={220} {...getImages({ src: 'imtoken' })} />
          <RetinaImage className={styles.img} width={140} {...getImages({ src: 'trust' })} />
        </div>
      </div>
    </div>
  }
}

export default TrustedBy
