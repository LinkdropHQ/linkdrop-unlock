import React from 'react'
import classNames from 'classnames'
import styles from './styles.css'
import PropTypes from 'prop-types'

class Button extends React.Component {
  render () {
    const { disabled, children, inverted, onClick, className } = this.props
    return <button
      onClick={_ => onClick && onClick()}
      disabled={disabled}
      className={classNames(styles.container, className, {
        [styles.disabled]: disabled,
        [styles.inverted]: inverted
      })}
    >
      {children}
    </button>
  }
}

Button.propTypes = {
  disabled: PropTypes.bool,
  inverted: PropTypes.bool,
  children: PropTypes.any,
  onClick: PropTypes.func
}

export default Button
