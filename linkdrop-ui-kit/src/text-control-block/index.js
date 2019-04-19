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
  render () {
    const { blink } = this.state
    const { blinkOnClick, value = '', onClick, className, style = {}, icon = <Icons.Copy /> } = this.props
    return <div style={style} className={classNames(styles.container, className, {
      [styles.blink]: blink
    })}>
      <div className={styles.content}>
        {value}
      </div>
      <div className={styles.copyContent} onClick={_ => {
        if (blinkOnClick) {
          this.setState({
            blink: true
          }, () => {
            onClick && onClick({ value })
            window.setTimeout(_ => this.setState({
              blink: false
            }), 1000)
          })
        } else {
          onClick && onClick({ value })
        }
      }}>{icon}</div>
    </div>
  }
}

export default TextControlBlock
