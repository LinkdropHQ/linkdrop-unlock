/* global test, expect */
import React from 'react'
import { Button } from 'components/common'
import { shallow } from 'enzyme'

test('button has the text as children', () => {
  // Render a button with label in the document
  const button = shallow(<Button>Hello!</Button>)
  expect(button.text()).toEqual('Hello1!')
})
