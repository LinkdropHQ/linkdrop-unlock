import React from 'react'
import { storiesOf } from '@storybook/react'
import { Loading } from 'src'

storiesOf('Loading', module)
  .add('Normal', () => (
    <Loading />
  ))

  .add('Large', () => (
    <Loading size='large' />
  ))

  .add('Small', () => (
    <Loading size='small' />
  ))
