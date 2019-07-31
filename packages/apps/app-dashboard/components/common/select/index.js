import React from 'react'
import classNames from 'classnames'
import styles from './styles.module'
import { Select } from '@linkdrop/ui-kit'

class SelectNew extends React.Component {
  render () {
    const { className } = this.props
    return <Select {...this.props} className={classNames(className, styles.container)} />
  }
}

export default SelectNew
