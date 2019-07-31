import React from 'react'
import { storiesOf } from '@storybook/react'
import { Input } from 'src'

storiesOf('Input', module)
  .add('Common with value', () => (
    <Input value='Hello, I am input' />
  ))

  .add('Common with no value', () => (
    <Input />
  ))

  .add('With mask', () => (
    <Input mask='99/99/9999' />
  ))

  .add('Disabled with value', () => (
    <Input disabled value='I am disabled' />
  ))

  .add('Disabled with no value', () => (
    <Input disabled />
  ))
