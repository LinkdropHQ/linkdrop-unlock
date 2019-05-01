import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'

class TextCopyBlock extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      blink: false
    }
  }

  componentWillReceiveProps ({ blink }) {
    const { blink: prevPropBlink } = this.props
    const { blink: currentBlink } = this.state
    if (currentBlink !== blink && prevPropBlink !== blink) {
      this.setState({
        blink: true
      }, () => {
        window.setTimeout(_ => this.setState({
          blink: false
        }), 1500)
      })
    }
  }

  render () {
    const { blink } = this.state
    const { value = '', className, style = {}, onClick } = this.props
    return <div style={style} className={classNames(styles.container, className)}>
      {blink && <div className={styles.copyOverlay}>Copied!</div>}
      <div className={styles.content}>
        {value}
      </div>
      <div className={styles.copyContent} onClick={_ => this.onCopy({ value, onClick })}>
        Copy
      </div>
    </div>
  }

  onCopy ({ value, onClick }) {
    this.setState({
      blink: true
    }, () => {
      onClick && onClick({ value })
      window.setTimeout(_ => this.setState({
        blink: false
      }), 1500)
    })
  }
}

export default TextCopyBlock
