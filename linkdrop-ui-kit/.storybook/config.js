import { configure, addDecorator, addParameters } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import './styles.css'
import linkdropTheme from './linkdrop-theme'

addParameters({
  options: {
    theme: linkdropTheme
  }
})

function loadStories () {
  require('stories/button.js')
  require('stories/tab.js')
  require('stories/loading.js')
  require('stories/input.js')
  require('stories/nft-item.js')
  require('stories/alert.js')
  require('stories/iconed-link.js')
  require('stories/checkbox.js')
  require('stories/text-control-block.js')
  require('stories/text-copy-block.js')
}

addDecorator(withInfo)
configure(loadStories, module)
