import React from 'react'
import styles from './styles.module'
import Select from 'react-select'

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

  componentWillReceiveProps ({ value }) {
    const { value: currentValue } = this.state
    if (value && currentValue !== value) {
      this.setState({
        value: this.defineCurrentValue({ value })
      })
    }
  }

  defineCurrentValue ({ value }) {
    const { options = [] } = this.props
    return options.find(item => item.value === value)
  }

  render () {
    const { value } = this.state
    const { options = [], placeholder } = this.props
    return <Select
      className={styles.container}
      value={value}
      onChange={value => this.onChange(value)}
      options={options}
      placeholder={placeholder}
    />
  }
}

export default SelectComponent
