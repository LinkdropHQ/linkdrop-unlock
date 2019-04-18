import React from 'react'
import { storiesOf } from '@storybook/react'
import { NftItem } from 'src'

storiesOf('Nft Item', module)
  .add('Common', () => (
    <NftItem
      img='https://storage.opensea.io/0x5f37ef03130f92925ea56579b891261118773aea-preview/163-1553806161.png'
      name='Santa Whitehat'
      description='Send Christmas Cards & Support Venezuelans in Need.'
    />
  ))
