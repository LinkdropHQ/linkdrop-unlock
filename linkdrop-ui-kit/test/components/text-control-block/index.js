/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { TextControlBlock, Icons } from 'src'
import { shallow } from 'enzyme'
import '__mocks__/match-media.mock'

describe('rendering TextControlBlock', () => {
  it('renders TextControlBlock with value', () => {
    const wrapper = shallow(<TextControlBlock value='Hello I am TextControlBlock' />)
    expect(wrapper.find('div').at(1).text()).to.equal('Hello I am TextControlBlock')
  })

  it('renders TextControlBlock with value contains copy icon if no icon specified', () => {
    const wrapper = shallow(<TextControlBlock value='Hello I am TextControlBlock' />)
    expect(wrapper.contains(<Icons.Copy />)).to.equal(true)
  })

  it('renders TextControlBlock with icon specified', () => {
    const wrapper = shallow(<TextControlBlock icon={<Icons.Qr />} value='Hello I am TextControlBlock' />)
    expect(wrapper.contains(<Icons.Qr />)).to.equal(true)
  })

  it('renders TextControlBlock with blink block', () => {
    const wrapper = shallow(<TextControlBlock blink icon={<Icons.Qr />} value='Hello I am TextControlBlock' />)
    expect(wrapper.find('div').at(1).text()).to.equal('Copied!')
  })
})
