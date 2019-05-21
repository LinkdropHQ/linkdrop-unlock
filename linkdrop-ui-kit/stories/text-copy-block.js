import React from 'react'
import { storiesOf } from '@storybook/react'
import { TextCopyBlock } from 'src'

storiesOf('TextCopyBlock', module)
  .add('Common', () => (
    <TextCopyBlock value='I am a TextCopyBlock' />
  ))
