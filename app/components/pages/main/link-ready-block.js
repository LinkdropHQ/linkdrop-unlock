import React from 'react'
import { Input, Button } from 'linkdrop-ui-kit'
import text from 'texts'

export default ({ styles, t, link, wallet, onClick }) => <div className={styles.container}>
  <div className={styles.title}>{t('titles.linkCreated')}</div>
  <Input
    value={link}
    disabled
    className={styles.input}
  />
  <Button
    className={styles.button}
    onClick={_ => {
      onClick && onClick()
    }}
  >
    {text('common.buttons.send')}
  </Button>
  <div className={styles.description} dangerouslySetInnerHTML={{ __html: t('titles.fromWallet', { wallet: getWalletShortenFormat(wallet) }) }} />
</div>

const getWalletShortenFormat = wallet => {
  if (!wallet) return '...'
  return `${wallet.slice(0, 5)}...${wallet.slice(-5)}`
}
