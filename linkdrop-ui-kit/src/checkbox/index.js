import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'
import Icons from '../icons'

class Checkbox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      checked: props.checked
    }
  }

  componentWillReceiveProps ({ checked }) {
    const { checked: prevChecked } = this.state
    if (checked != null && checked !== prevChecked) {
      this.setState({
        checked
      })
    }
  }

  render () {
    const { title, onChange, disabled } = this.props
    const { checked } = this.state
    return <div
      className={classNames(styles.container, {
        [styles.checked]: checked,
        [styles.disabled]: disabled
      })}
      onClick={_ => !disabled && this.setState({ checked: !checked }, _ => onChange && onChange({ value: !checked }))}
    >
      <div className={styles.checkIcon}>
        {checked && <Icons.CheckSmall />}
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  }
}

export default Checkbox
