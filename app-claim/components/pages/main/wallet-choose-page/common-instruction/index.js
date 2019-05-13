import React from 'react'

export default ({ walletType, t, styles, title, href }) => {
  return <div className={styles.instructions}>
    <div dangerouslySetInnerHTML={{
      __html: t('walletsInstructions.common._1', {
        href,
        title
      })
    }} />
    <div dangerouslySetInnerHTML={{ __html: t('walletsInstructions.common._2') }} />
  </div>
}
