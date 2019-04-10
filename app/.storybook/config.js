import { configure, addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import 'components/application/router/styles.css'

function loadStories () {
  require('stories/button.js')
  require('stories/tab.js')
  require('stories/loading.js')
  require('stories/input.js')
  require('stories/nft-item.js')
}

addDecorator(withInfo)
configure(loadStories, module)
