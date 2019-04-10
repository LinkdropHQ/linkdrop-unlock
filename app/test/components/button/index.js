/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { Button, Icons } from 'components/common'
import { shallow } from 'enzyme'
import sinon from 'sinon'

describe('button common component', () => {
  it('renders <Button /> component with text inside', () => {
    const button = shallow(<Button>Hello!</Button>)
    expect(button.text()).to.equal('Hello!')
  })

  it('renders Icon as child if passed as property', () => {
    const wrapper = shallow((
      <Button><Icons.Question /></Button>
    ))
    expect(wrapper.contains(<Icons.Question />)).to.equal(true)
  })

  it('simulates click events', () => {
    const onButtonClick = sinon.spy()
    const wrapper = shallow(<Button onClick={onButtonClick}>Hello</Button>)
    wrapper.find('button').simulate('click')
    expect(onButtonClick).to.have.property('callCount', 1)
  })
})
