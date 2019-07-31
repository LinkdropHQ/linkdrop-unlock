import React from 'react'
import styles from './styles.module'
import { Icons } from 'src'

class ModalWindow extends React.Component {
  render () {
    const { children, visible, onClose, withCross } = this.props
    if (!visible) return null
    return <div className={styles.container}>
      <div className={styles.content}>
        {withCross && <div className={styles.cross} onClick={_ => onClose && onClose()}><Icons.Close /></div>}
        {children}
      </div>
    </div>
  }
}

export default ModalWindow
