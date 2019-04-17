import React from 'react'
import { storiesOf } from '@storybook/react'
import { Alert, Icons } from 'components/common'

storiesOf('Alert', module)
  .add('With question icon', () => (
    <Alert icon={<Icons.Question />} />
  ))

  .add('With exclamation icon', () => (
    <Alert icon={<Icons.Exclamation />} />
  ))
