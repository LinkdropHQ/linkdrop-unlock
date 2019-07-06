import React from 'react'
import styles from './styles.module'
import Select from 'react-select'
import classNames from 'classnames'

class SelectComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: this.defineCurrentValue({ value: props.value })
    }
  }

  onChange ({ value }) {
    const { onChange } = this.props
    this.setState({
      value: this.defineCurrentValue({ value })
    }, _ => onChange && onChange({ value }))
  }

  componentWillReceiveProps ({ value, options }) {
    const { value: currentValue } = this.state
    if (value && currentValue !== value) {
      this.setState({
        value: this.defineCurrentValue({ value, options })
      })
    }
  }

  defineCurrentValue ({ value, options }) {
    const currentOptions = options || this.props.options
    return currentOptions.find(item => item.value === value)
  }

  render () {
    const { value } = this.state
    const { options = [], placeholder, className } = this.props
    return <Select
      className={classNames(styles.container, className)}
      value={value}
      onChange={value => this.onChange(value)}
      options={options}
      placeholder={placeholder}
    />
  }
}

export default SelectComponent
