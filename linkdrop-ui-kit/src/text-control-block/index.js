import React from 'react'
import styles from './styles.module'
import { Icons } from 'src'
import classNames from 'classnames'

class TextControlBlock extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      blink: false
    }
  }

  componentWillReceiveProps ({ blink }) {
    const { blink: prevPropBlink, onBlickChange, blinkOnClick } = this.props
    const { blink: currentBlink } = this.state
    if (currentBlink !== blink && prevPropBlink !== blink && blinkOnClick) {
      this.setState({
        blink: true
      }, () => {
        window.setTimeout(_ => this.setState({
          blink: false
        }, _ => onBlickChange && onBlickChange({ value: false })), 1500)
      })
    }
  }

  render () {
    const { blink } = this.state
    const { value = '', onClick, className, style = {}, icon = <Icons.Copy /> } = this.props
    return <div style={style} className={classNames(styles.container, className)}>
      {blink && <div className={styles.copyOverlay}>Copied!</div>}
      <div className={styles.content}>
        {value}
      </div>
      <div className={styles.copyContent} onClick={_ => {
        onClick && onClick({ value })
      }}>{icon}</div>
    </div>
  }
}

export default TextControlBlock
