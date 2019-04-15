/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { Input } from 'components/common'
import { shallow } from 'enzyme'

describe('Input common component', () => {
  it('renders <Input /> component with text inside', () => {
    const input = shallow(<Input value='i am filled with text' />)
    expect(input.find('input').props().value).to.equal('i am filled with text')
  })
})
