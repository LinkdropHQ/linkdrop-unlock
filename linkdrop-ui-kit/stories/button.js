import React from 'react'
import { storiesOf } from '@storybook/react'
import { Button, Icons } from 'src'

storiesOf('Button', module)
  .add('Common', () => (
    <Button>Hello, my name is Button</Button>
  ))

  .add('Disabled', () => (
    <Button disabled>Hello, my name is Button</Button>
  ))

  .add('Inverted', () => (
    <Button inverted>Hello, my name is Button</Button>
  ))

  .add('With Icon or Logo', () => (
    <Button inverted><Icons.Arrow />Hello, my name is Button</Button>
  ))
