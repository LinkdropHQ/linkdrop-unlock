/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { Input } from 'src'
import { shallow } from 'enzyme'
import '__mocks__/match-media.mock'

describe('Input common component', () => {
  it('renders <Input /> component with text inside', () => {
    const input = shallow(<Input value='i am filled with text' />)
    expect(input.find('input').props().value).to.equal('i am filled with text')
  })

  it('renders disabled input with special class', () => {
    const wrapper = shallow(<Input disabled />)
    expect(wrapper.find('input').is('.disabled')).equals(true)
  })
})
