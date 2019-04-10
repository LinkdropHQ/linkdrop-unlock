import React from 'react'
import RetinaImage from 'react-retina-image'

class RetinaImageComponent extends React.Component {
  prepareSrc ({ fileName }) {
    const imageOriginal = require(`assets/images/${fileName}.png`)
    const imageRetina = require(`assets/images/${fileName}.png`)
    return [imageOriginal, imageRetina]
  }
  render () {
    const { fileName } = this.props
    return <RetinaImage
      src={this.prepareSrc({ fileName })}
    />
  }
}

export default RetinaImageComponent
