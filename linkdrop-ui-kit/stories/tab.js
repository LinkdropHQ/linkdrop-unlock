import React from 'react'
import { storiesOf } from '@storybook/react'
import { Tabs } from 'src'

storiesOf('Tabs', module)
  .add('Common', () => (
    <Tabs active={1} options={[{ title: 'BTC', id: 1 }, { title: 'ETH', id: 2 }]} />
  ))
