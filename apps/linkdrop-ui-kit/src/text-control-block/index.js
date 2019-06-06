import React from 'react'
import styles from './styles.module'
import { Icons } from 'src'
import classNames from 'classnames'
import PropTypes from 'prop-types'

class TextControlBlock extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      blink: props.blink
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

TextControlBlock.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  icon: PropTypes.element,
  blink: PropTypes.bool
}

export default TextControlBlock
