import React from 'react'
import { storiesOf } from '@storybook/react'
import { IconedLink, Icons } from 'src'

storiesOf('IconedLink', module)
  .add('With question icon', () => (
    <IconedLink icon={<Icons.Question />} />
  ))
