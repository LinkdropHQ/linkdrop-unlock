/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { Alert, Icons } from 'src'
import { shallow } from 'enzyme'
import '__mocks__/match-media.mock'

describe('alert common component', () => {
  it('renders <Alert /> component with icon iside', () => {
    const alert = shallow(<Alert icon={<Icons.Question />} />)
    expect(alert.contains(<Icons.Question />)).to.equal(true)
  })
})
