import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'
import PropTypes from 'prop-types'

class Loading extends React.Component {
  render () {
    const { size = 'normal', container, className, withOverlay } = this.props
    return <div className={classNames({
      [styles.withOverlay]: withOverlay
    })}>
      <div className={classNames(styles.container, styles[`${size}Size`], className, {
        [styles.asContainer]: container
      })} />
    </div>
  }
}

Loading.propTypes = {
  size: PropTypes.oneOf(['normal', 'small', 'large'])
}

export default Loading
