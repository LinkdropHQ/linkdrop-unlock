/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { Loading } from 'src'
import { shallow } from 'enzyme'
import '__mocks__/match-media.mock'

describe('rendering loading', () => {
  it('renders loading with normal size', () => {
    const wrapper = shallow(<Loading />)
    expect(wrapper.find('div').is('.normalSize')).equals(true)
  })

  it('renders loading with large size', () => {
    const wrapper = shallow(<Loading size='large' />)
    expect(wrapper.find('div').is('.largeSize')).equals(true)
  })
})
