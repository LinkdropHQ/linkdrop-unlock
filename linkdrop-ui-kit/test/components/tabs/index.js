/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { Tabs } from 'src'
import { shallow } from 'enzyme'
import '__mocks__/match-media.mock'

describe('Tabs common component', () => {
  it('renders <Tabs /> component with options inside', () => {
    const options = [{ title: 'ETH', id: 'eth' }, { title: 'BTC', id: 'btc' }]
    const tabs = shallow(<Tabs options={options} />)
    expect(tabs.find('div').at(2).text()).to.equal('BTC')
  })

  it('renders <Tabs /> with active tab', () => {
    const options = [{ title: 'ETH', id: 'eth' }, { title: 'BTC', id: 'btc' }]
    const tabs = shallow(<Tabs active='btc' options={options} />)
    expect(tabs.find('div').at(2).is('.active')).equals(true)
  })

  it('renders <Tabs /> with another active tab', () => {
    const options = [{ title: 'ETH', id: 'eth' }, { title: 'BTC', id: 'btc' }]
    const tabs = shallow(<Tabs active='eth' options={options} />)
    expect(tabs.find('div').at(1).is('.active')).equals(true)
  })
})
