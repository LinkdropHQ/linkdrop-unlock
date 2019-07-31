import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { RetinaImage } from '@linkdrop/ui-kit'
import { getImages } from 'helpers'

@actions(_ => ({}))
@translate('pages.main')
class NetworkNotSupported extends React.Component {
  render () {
    return <div className={styles.container}>
      <h2 className={styles.title}>{this.t('titles.networkNotSupported')}</h2>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: this.t('texts.networkNotSupported') }}
      />
      <RetinaImage width={255} {...getImages({ src: 'network' })} />
    </div>
  }
}

export default NetworkNotSupported
