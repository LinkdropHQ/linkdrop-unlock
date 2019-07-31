import React from 'react'
import { storiesOf } from '@storybook/react'
import { Checkbox } from 'src'

storiesOf('Checkbox', module)
  .add('Common', () => (
    <Checkbox title='I am a checkbox' />
  ))

  .add('Disabled', () => (
    <Checkbox title='I am a checkbox' disabled />
  ))

  .add('Checked by default', () => (
    <Checkbox title='I am a checkbox' checked />
  ))

  .add('Checked by default, but disabled', () => (
    <Checkbox title='I am a checkbox' checked disabled />
  ))
