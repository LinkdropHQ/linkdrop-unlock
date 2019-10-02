import React from 'react'
import { Alert, Icons } from '@linkdrop/ui-kit'
import { translate } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'

@translate('pages.operaInstruction')
class OperaInstruction extends React.Component {
  render () {
    const { onClick, amount, symbol, loading, wallet } = this.props
    return <div className={commonStyles.container}>
      <Alert className={styles.alert} icon={<Icons.Exclamation />} />
      <div className={styles.title}>{this.t('titles.main')}</div>
      <div className={styles.instruction}>
        <div className={styles.instructionItem}>{this.t('instruction._1')}</div>
        <div className={styles.instructionItem}>{this.t('instruction._2')}</div>
      </div>
    </div>
  }
}

export default OperaInstruction
