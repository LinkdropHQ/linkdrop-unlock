import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Input } from 'linkdrop-ui-kit'

@actions(() => ({}))
@translate('pages.main')
class AssetValueInput extends React.Component {
  render () {
    const { title, onChange, value, disabled } = this.props
    return <div className={styles.container}>
      {title && <div className={styles.title}>{title}</div>}
      <Input value={value} disabled={disabled} className={styles.input} onChange={({ value }) => onChange && onChange({ value })} />
    </div>
  }
}

export default AssetValueInput
