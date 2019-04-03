import React from 'react'
import classNames from 'classnames'
import styles from './styles.css'
import PropTypes from 'prop-types'

class Button extends React.Component {
  render () {
    const { disabled, title } = this.props
    return <button
      disabled={disabled}
      className={classNames(styles.container, {
        [styles.disabled]: disabled
      })}
    >
      {title}
    </button>
  }
}

Button.propTypes = {
  /** The description for title */
  title: PropTypes.string,
  /** The description for disabled */
  disabled: PropTypes.bool
}

export default Button
