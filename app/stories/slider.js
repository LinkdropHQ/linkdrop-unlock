import React from 'react'
import { storiesOf } from '@storybook/react'
import { Slider, RetinaImage } from 'components/common'

storiesOf('Slider', module)
  .add('Common slider with images', () => (
    <Slider visibleSlides={4} step={4}>
      <RetinaImage fileName='Metamask' />
      <RetinaImage fileName='Coinbase' />
      <RetinaImage fileName='Opera' />
      <RetinaImage fileName='Status' />
      <RetinaImage fileName='Metamask' />
      <RetinaImage fileName='Coinbase' />
      <RetinaImage fileName='Opera' />
      <RetinaImage fileName='Status' />
    </Slider>
  ))
