import React from 'react'
import styles from './styles.module'
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

  componentWillReceiveProps ({ value }) {
    const { value: prevValue } = this.state
    if (value == null || value === prevValue) { return }
    this.setState({
      value
    })
  }

  render () {
    const { mask, className, disabled, placeholder, centered } = this.props
    const { value } = this.state
    if (mask) return this.renderMaskInput()
    return <input placeholder={placeholder} disabled={disabled} value={value} className={this.defineClassNames({ className, disabled, centered })} onChange={e => this.changeValue(e)} />
  }

  changeValue (e) {
    const { onChange } = this.props
    const value = e.target.value
    this.setState({
      value
    }, _ => onChange && onChange({ value }))
  }

  defineClassNames ({ className, disabled, centered }) {
    return classNames(styles.container, className, { [styles.disabled]: disabled, [styles.centered]: centered })
  }

  renderMaskInput () {
    const { value } = this.state
    const { onChange, className, disabled } = this.props
    return <InputMask {...this.props} value={value} className={this.defineClassNames({ className, disabled })} onChange={e => onChange && onChange({ value: e.target.value })}>
      {(inputProps) => <input {...inputProps} />}
    </InputMask>
  }
}

Input.propTypes = {
  mask: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  alwaysShowMask: PropTypes.bool,
  maskChar: PropTypes.string,
  formatChars: PropTypes.object
}

export default Input
