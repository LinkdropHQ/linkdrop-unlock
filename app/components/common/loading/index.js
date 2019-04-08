import React from 'react'
import styles from './styles.css'
import classNames from 'classnames'
import PropTypes from 'prop-types'

class Loading extends React.Component {
  render () {
    const { size = 'normal' } = this.props
    return <div className={classNames(styles.container, styles[`${size}Size`])} />
  }
}

Loading.propTypes = {
  size: PropTypes.oneOf(['normal', 'small', 'large'])
}

export default Loading
