/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { Button, Icons } from 'src'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import '__mocks__/match-media.mock'

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

  it('prevents click events if disabled', () => {
    const onButtonClick = sinon.spy()
    const wrapper = shallow(<Button disabled onClick={onButtonClick}>Hello</Button>)
    wrapper.find('button').simulate('click')
    expect(onButtonClick).to.have.property('callCount', 0)
  })

  it('renders disabled button with special class', () => {
    const onButtonClick = sinon.spy()
    const wrapper = shallow(<Button disabled onClick={onButtonClick}>Hello</Button>)
    expect(wrapper.find('button').is('.disabled')).equals(true)
  })

  it('renders inverted button with special class', () => {
    const onButtonClick = sinon.spy()
    const wrapper = shallow(<Button inverted onClick={onButtonClick}>Hello</Button>)
    expect(wrapper.find('button').is('.inverted')).equals(true)
  })
})
