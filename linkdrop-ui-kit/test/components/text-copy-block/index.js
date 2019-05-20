/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { TextCopyBlock } from 'src'
import { shallow } from 'enzyme'
import '__mocks__/match-media.mock'

describe('rendering TextCopyBlock', () => {
  it('renders TextCopyBlock with value', () => {
    const wrapper = shallow(<TextCopyBlock value='Hello I am TextCopyBlock' />)
    expect(wrapper.find('div').at(1).text()).to.equal('Hello I am TextCopyBlock')
  })

  it('renders TextCopyBlock with blink block', () => {
    const wrapper = shallow(<TextCopyBlock blink />)
    expect(wrapper.find('div').at(3).text()).to.equal('Copied!')
  })
})
