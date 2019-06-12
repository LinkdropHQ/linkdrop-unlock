/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { ModalWindow, Icons } from 'src'
import { shallow } from 'enzyme'
import '__mocks__/match-media.mock'

describe('Modal window component', () => {
  it('renders <ModalWindow /> with cross to close inside', () => {
    const modalWindow = shallow(<ModalWindow withCross visible />)
    expect(modalWindow.contains(<Icons.Close />)).to.equal(true)
  })

  it('renders <ModalWindow /> with no cross to close inside', () => {
    const modalWindow = shallow(<ModalWindow visible />)
    expect(modalWindow.contains(<Icons.Close />)).to.equal(false)
  })

  it('how render looks like with no visible prop', () => {
    const modalWindow = shallow(<ModalWindow />)
    expect(Object.keys(modalWindow).length).to.equal(0)
    // because shallow returns {} instead of null
  })
})
