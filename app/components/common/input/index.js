import React from 'react'
import styles from './styles.css'
import classNames from 'classnames'
import InputMask from 'react-input-mask'
import PropTypes from 'prop-types'

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  render () {
    const { mask, className, disabled } = this.props
    const { value } = this.state
    if (mask) return this.renderMaskInput()
    return <input disabled={disabled} value={value} className={this.defineClassNames({ className, disabled })} onChange={e => this.changeValue(e)} />
  }

  changeValue (e) {
    const { onChange } = this.props
    const value = e.target.value
    this.setState({
      value
    }, _ => onChange && onChange({ value }))
  }

  defineClassNames ({ className, disabled }) {
    return classNames(styles.container, className, { [styles.disabled]: disabled })
  }

  renderMaskInput () {
    const { value } = this.state
    const { onChange, className, disabled } = this.props
    return <InputMask {...this.props} value={value} onChange={e => onChange && onChange({ value: e.target.value })}>
      {(inputProps) => <input className={this.defineClassNames({ className, disabled })} {...inputProps} />}
    </InputMask>
  }
}

Input.propTypes = {
  mask: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
}

export default Input
