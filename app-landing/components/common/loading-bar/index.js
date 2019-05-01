import React from 'react'
import styles from './styles.module'
import { Icons } from 'linkdrop-ui-kit'
import { translate } from 'decorators'
import classNames from 'classnames'

@translate('components.loadingBar')
class LoadingBar extends React.Component {
  render () {
    const { className, success } = this.props
    return <div className={classNames(styles.container, className)}>
      {this.renderLoading({ success })}
      {this.renderTitle({ success })}
    </div>
  }

  renderLoading ({ success }) {
    if (!success) {
      return <div className={styles.loading}>
        <div /><div /><div /><div />
      </div>
    }
    return <div className={styles.icon}>
      <Icons.CheckSmall fill='#2BC64F' />
    </div>
  }

  renderTitle ({ success }) {
    if (!success) {
      return <div className={styles.title}>
        {this.t('waiting')}
      </div>
    }
    return <div className={classNames(styles.title, styles.titleSuccess)}>
      {this.t('success')}
    </div>
  }
}

export default LoadingBar
