import React from 'react'
import { Loading } from 'components/common'

export default ({ styles, t }) => <div className={styles.container}>
  <div className={styles.loadingContainer}>
    <Loading />
  </div>
  <div className={styles.title}>{t('titles.linkCreation')}</div>
  <div className={styles.subtitle}>{t('titles.transationProcess')}</div>
  <div className={styles.description}>{t('titles.transationTip')}</div>
  <div className={styles.description} dangerouslySetInnerHTML={{ __html: t('titles.details') }} />
</div>
