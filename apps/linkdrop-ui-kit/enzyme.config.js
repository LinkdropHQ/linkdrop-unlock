import 'core-js/es6/map'
import 'core-js/es6/set'
import 'raf/polyfill'
const Enzyme = require('enzyme')
const EnzymeAdapter = require('enzyme-adapter-react-16')

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {}
    }
  }

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  function (callback) {
    setTimeout(callback, 0)
  }
