import React from 'react'
import { Button, Input, NftItem, Tabs } from 'components/common'
import { actions, translate } from 'decorators'

import styles from './styles'

@actions(({ nftTokens, user }) => ({ nftTokens: nftTokens.tokens, wallet: user.wallet }))
@translate('pages.main')
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentCurrency: 'ETH',
      amount: null
    }
  }

  render () {
    const { nftTokens, wallet } = this.props
    return <div className={styles.container}>
      <div className={styles.title}>{this.t('titles.chooseToken')}</div>
      <Tabs className={styles.tabs} active={1} options={[{ title: 'ETH', id: 'eth' }, { title: 'DAI', id: 'dai' }, { title: 'NFT', id: 'nft' }]} />
      <Button className={styles.button} inverted onClick={_ => this.actions().nftTokens.getTokens({ wallet })}>Hello</Button>
      <Input className={styles.input} onChange={({ value }) => console.log({ value })} />
      {nftTokens.map(({ token_id: id, image_preview_url: url, description, name }) => <NftItem key={id} img={url} name={name} id={id} description={description} />)}
    </div>
  }
}

export default Main
