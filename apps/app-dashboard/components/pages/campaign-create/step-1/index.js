import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Button } from 'components/common'
import { RetinaImage } from 'linkdrop-ui-kit'
import { getImages } from 'helpers'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class Step1 extends React.Component {
  componentDidMount () {
    this.actions().user.createSigningKey()
  }

  render () {
    return <div className={styles.container}>
      <div className={styles.title}>{this.t('titles.createLinkKey')}</div>
      <div className={styles.main}>
        <div className={styles.description}>
          <p className={classNames(styles.text, styles.textMain)}>{this.t('texts._1')}</p>
          <p className={styles.text}>{this.t('texts._2')}</p>
          <p className={styles.text}>{this.t('texts._3')}</p>
          <p className={styles.text}>{this.t('texts._4')}</p>
        </div>

        <div className={styles.scheme}>
          <p className={classNames(styles.text, styles.centered)}>{this.t('texts._5')}</p>
          <RetinaImage width={255} {...getImages({ src: 'key-preview' })} />
        </div>
      </div>
      <div className={styles.controls}>
        <Button onClick={_ => this.actions().user.setStep({ step: 2 })}>{this.t('buttons.create')}</Button>
      </div>
    </div>
  }
}

export default Step1
