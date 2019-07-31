import React from 'react'
import { actions } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'

@actions(_ => ({}))
class ProgressBar extends React.Component {
  render () {
    const { stepsCount, currentStep } = this.props
    return <div className={styles.container}>
      {(new Array(stepsCount)).fill().map((item, idx) => this.renderItem({ idx, currentStep, stepsCount }))}
    </div>
  }

  renderItem ({ idx, currentStep, stepsCount }) {
    return <div key={idx} className={classNames(styles.progressItem, {
      [styles.active]: idx === (currentStep - 1),
      [styles.finished]: idx < currentStep - 1
    })}>
      <div className={styles.circle} />
      {(idx + 1) !== stepsCount && <div className={styles.line} />}
    </div>
  }
}

export default ProgressBar
