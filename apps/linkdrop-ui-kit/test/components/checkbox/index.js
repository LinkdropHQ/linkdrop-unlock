/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { Checkbox } from 'src'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import '__mocks__/match-media.mock'

describe('checkbox common component', () => {
  it('renders <Checkbox /> component with text', () => {
    const checkbox = shallow(<Checkbox title='I am a checkbox' />)
    expect(checkbox.text()).to.equal('I am a checkbox')
  })

  it('simulates change event', () => {
    const onChange = sinon.spy()
    const wrapper = shallow(<Checkbox onChange={onChange} />)
    wrapper.find('div').first().simulate('click')
    expect(onChange).to.have.property('callCount', 1)
  })

  it('prevents change event if disabled', () => {
    const onChange = sinon.spy()
    const wrapper = shallow(<Checkbox onChange={onChange} disabled />)
    wrapper.find('div').first().simulate('click')
    expect(onChange).to.have.property('callCount', 0)
  })

  it('renders disabled button with special class', () => {
    const wrapper = shallow(<Checkbox disabled />)
    expect(wrapper.find('div').at(0).is('.disabled')).equals(true)
  })
})
