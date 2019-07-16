import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { RetinaImage, Icons } from 'linkdrop-ui-kit'
import { getImages } from 'helpers'

@actions(({ user: { chainId } }) => ({ chainId }))
@translate('common.pageHeader')
class MetamaskPopup extends React.Component {
  render () {
    const { amount } = this.props
    return <div className={styles.container}>
      <div className={styles.amount}>
        <Icons.Ethereum />{amount}
      </div>
      <RetinaImage
        className={styles.img}
        width={245}
        {...getImages({ src: 'popup' })}
      />
      <div className={styles.arrow}>
        <Icons.Cursor />
      </div>
    </div>
  }
}

export default MetamaskPopup
