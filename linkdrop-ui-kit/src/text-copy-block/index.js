import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'
import PropTypes from 'prop-types'

class TextCopyBlock extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      blink: props.blink
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
      <div className={styles.content}>
        {value}
      </div>
      <div className={styles.copyContent} onClick={_ => this.onCopy({ value, onClick })}>
        Copy
      </div>
      {blink && <div className={styles.copyOverlay}>Copied!</div>}
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

TextCopyBlock.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  blink: PropTypes.bool
}

export default TextCopyBlock
