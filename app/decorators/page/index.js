import React from 'react'
import { Footer, Header } from 'components/common'
import './styles.scss'

export default () => {
  return ({ prototype }) => {
    const { render } = prototype

    prototype.render = function () {
      return <div className='app-page'>
        with decarator
        <div className='app-page-content'>
          <Header />
          <div className='app-page-content-body'>
            { render.call(this) }
          </div>
          <Footer />
        </div>
      </div>
    }
  }
}
