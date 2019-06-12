/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { IconedLink, Icons } from 'src'
import { shallow } from 'enzyme'
import '__mocks__/match-media.mock'

describe('iconed link common component', () => {
  it('renders <IconedLink /> component with icon iside', () => {
    const iconedLink = shallow(<IconedLink icon={<Icons.Exclamation />} />)
    expect(iconedLink.contains(<Icons.Exclamation />)).to.equal(true)
  })
})
