import React from 'react'
import { Button } from 'components/common'
import styles from './styles.css'
import text from 'texts'

export default ({ currency, amount, status, link }) => {
  const prefix = 'pages.common.transfers'
  return <div className={styles.container}>
    <div className={styles.title}>{amount} {currency}</div>
    {renderStatusBlock({ status, prefix })}
    <a className={styles.link} href={link}>{text(`${prefix}.titles.link`)}</a>
  </div>
}

const renderStatusBlock = ({ status, prefix }) => {
  switch (status) {
    case undefined:
      return <div className={styles.status}>
        <Button inverted size='small'>{text(`common.buttons.cancel`)}</Button>
      </div>
    default:
      return <div className={styles.status}>{text(`${prefix}.titles.${status}`)}</div>
  }
}
