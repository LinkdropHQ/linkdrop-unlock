import React from 'react'

export default ({ walletType, t, styles }) => {
  const { title, href } = t(`walletsInstructions.${walletType}`, { returnObjects: true })
  return <div className={styles.instructions}>
    <div dangerouslySetInnerHTML={{
      __html: t('walletsInstructions.common._1', {
        href,
        title
      })
    }} />
    <div dangerouslySetInnerHTML={{ __html: t('walletsInstructions.common._2') }} />
    <div dangerouslySetInnerHTML={{ __html: t('walletsInstructions.common._3') }} />
  </div>
}
