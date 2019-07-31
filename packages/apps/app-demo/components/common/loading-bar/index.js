import React from 'react'
import styles from './styles.module'
import { Icons } from 'linkdrop-ui-kit'
import { translate } from 'decorators'
import classNames from 'classnames'
import variables from 'variables'

@translate('components.loadingBar')
class LoadingBar extends React.Component {
  render () {
    const { className, success, alert, onClick, loadingTitle } = this.props
    return <div
      className={classNames(styles.container, className, { [styles.alert]: alert })}
      onClick={_ => alert && onClick && onClick()}
    >
      {this.renderLoading({ success, alert })}
      {this.renderTitle({ success, alert, loadingTitle })}
    </div>
  }

  renderLoading ({ success, alert }) {
    if (alert) {
      return null
    }

    if (!success) {
      return <div className={styles.loading}>
        <div /><div /><div /><div />
      </div>
    }

    return <div className={styles.icon}>
      <Icons.CheckSmall fill={variables.greenColor} />
    </div>
  }

  renderTitle ({ success, alert, loadingTitle }) {
    if (alert) {
      return <div className={classNames(styles.title, styles.titleAlert)}>
        {alert}
      </div>
    }

    if (!success) {
      return <div className={styles.title}>
        {loadingTitle || this.t('waiting')}
      </div>
    }

    return <div className={classNames(styles.title, styles.titleSuccess)}>
      {this.t('success')}
    </div>
  }
}

export default LoadingBar
