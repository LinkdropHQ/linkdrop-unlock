import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'
import { Button } from '@linkdrop/ui-kit'

class ButtonNew extends React.Component {
  render () {
    const { disabled, className, transparent } = this.props
    return <Button {...this.props} className={
      classNames(
        className,
        styles.container, {
          [styles.disabled]: disabled,
          [styles.transparent]: transparent
        }
      )
    } />
  }
}

export default ButtonNew
