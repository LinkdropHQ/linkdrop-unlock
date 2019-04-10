import React from 'react'
import RetinaImage from 'react-retina-image'

class RetinaImageComponent extends React.Component {
  prepareSrc ({ fileName }) {
    return [`assets/images/${fileName}.png`, `assets/images/${fileName}@2x.png`]
  }
  render () {
    const { fileName } = this.props
    return <RetinaImage
      src={this.prepareSrc({ fileName })}
    />
  }
}

export default RetinaImageComponent
