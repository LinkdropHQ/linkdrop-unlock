import React from 'react'
import { storiesOf } from '@storybook/react'
import { TextControlBlock, Icons } from 'src'

storiesOf('TextControlBlock', module)
  .add('Common', () => (
    <TextControlBlock value='I am a TextControlBlock' />
  ))

  .add('With QR icon', () => (
    <TextControlBlock icon={<Icons.Qr />} value='I am a QR' />
  ))
