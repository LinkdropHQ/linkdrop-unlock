import React from 'react'
import { Button, Input, NftItem, Tabs, Loading } from 'components/common'
import { actions, translate } from 'decorators'
import LinkLoadingBlock from './link-loading-block.js'
import LinkReadyBlock from './link-ready-block.js'
import NeedWalletBlock from './need-wallet-block.js'
import text from 'texts'

import styles from './styles'

@actions(({ tokens: { loading, link }, nftTokens: { tokens, loading: nftLoading }, user: { wallet } }) => ({ nftTokens: tokens, wallet: wallet, nftLoading, linkCreateLoading: loading, link }))
@translate('pages.main')
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentCurrency: 'eth',
      amount: '',
      currentNft: null
    }
  }

  render () {
    const { nftTokens, wallet, nftLoading, link, linkCreateLoading } = this.props
    const { currentCurrency, amount, currentNft } = this.state

    if (!wallet) {
      return <NeedWalletBlock t={this.t} styles={styles} onClick={_ => this.actions().user.setWallet({ wallet: '0x6C0F58AD4eb24da5769412Bf34dDEe698c4d185b' })} />
    }

    if (linkCreateLoading) {
      return <LinkLoadingBlock t={this.t} styles={styles} />
    }

    if (link) {
      return <LinkReadyBlock t={this.t} styles={styles} link={link} wallet={wallet} />
    }

    return <div className={styles.container}>
      <div className={styles.title}>{this.t('titles.chooseToken')}</div>
      <Tabs
        onChange={({ id }) => {
          this.setState({ currentCurrency: id }, _ => {
            if (id === 'nft') {
              this.actions().nftTokens.getTokens({ wallet })
            }
          })
        }}
        className={styles.tabs}
        active={currentCurrency}
        options={[{ title: 'ETH', id: 'eth' }, { title: 'DAI', id: 'dai' }, { title: 'NFT', id: 'nft' }]}
      />
      {this.renderInput({ currentCurrency, amount })}
      {this.renderButton({ currentCurrency, amount })}
      <div className={styles.nftTokens}>
        {nftLoading && <Loading />}
        {this.defineNftItems({ selected: currentNft, nftTokens, currentCurrency })}
      </div>
    </div>
  }

  defineNftItems ({ selected, nftTokens, currentCurrency }) {
    if (nftTokens && currentCurrency === 'nft') {
      if (selected) {
        const { token_id: id, image_preview_url: url, description, name } = nftTokens.find(item => Number(item.token_id) === Number(selected))
        return <div className={styles.singleNft}>
          <NftItem selected key={id} img={url} name={name} id={id} description={description} />
          {this.renderButton({ currentCurrency, selected })}
        </div>
      }
      return nftTokens.map(({ token_id: id, image_preview_url: url, name }) => {
        return <NftItem
          key={id}
          img={url}
          name={name}
          id={id}
          onClick={({ id }) => this.setState({
            currentNft: id
          })}
        />
      })
    }
  }

  renderInput ({ currentCurrency, amount }) {
    if (currentCurrency === 'nft') return null
    return <Input
      formatChars={FORMAT_CHARS}
      maskChar=' '
      value={amount}
      alwaysShowMask
      mask={this.defineMask({ currentCurrency })}
      placeholder={this.t('titles.amount')}
      className={styles.input}
      onChange={({ value }) => {
        this.setState({
          amount: value
        })
      }}
    />
  }

  renderButton ({ currentCurrency, amount, selected }) {
    console.log({ currentCurrency, amount, selected })
    if (currentCurrency === 'nft' && !selected) return null
    const value = currentCurrency !== 'nft' ? amount.split(' ')[0] : null
    return <Button
      className={styles.button}
      onClick={_ => {
        this.actions().tokens.createLink({ amount: value, currency: currentCurrency })
      }}
    >
      {text('common.buttons.send')}
    </Button>
  }

  defineMask ({ currentCurrency }) {
    const mask = '9999'
    if (currentCurrency === 'eth') {
      return `${mask} ETH`
    }
    if (currentCurrency === 'dai') {
      return `${mask} DAI`
    }
    return mask
  }
}

export default Main

const FORMAT_CHARS = {
  '9': '[0-9.,]'
}
