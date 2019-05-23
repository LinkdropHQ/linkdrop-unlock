import React from 'react'
import styles from './styles.module'
import Select from 'react-select'
class SelectComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: props.selected
    }
  }

  onChange (value) {
    console.log({ value })
  }

  render () {
    const { selected } = this.state
    const { options = [], placeholder } = this.props
    return <Select
      className={styles.container}
      value={selected}
      onChange={value => this.onChange(value)}
      options={options}
      placeholder={placeholder}
    />
  }
}

export default SelectComponent
