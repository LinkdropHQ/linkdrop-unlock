import React from 'react'
import { Loading } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import styles from './styles.module'

const LoadingComponent = props => <Loading {...props} className={classNames(styles.container, props.className)} />

export default LoadingComponent
