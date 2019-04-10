import React from 'react'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'
import { Icons } from 'components/common'
import styles from './styles.module'
import classNames from 'classnames'
import 'pure-react-carousel/dist/react-carousel.es.css'

export default class extends React.Component {
  createSlides () {
    const { children = [] } = this.props
    return children.map((item, idx) => <Slide key={idx} index={idx}>{item}</Slide>)
  }

  render () {
    const { step = 1, visibleSlides = 1, children = [] } = this.props
    return (
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={children.length}
        step={step}
        className={styles.container}
        visibleSlides={visibleSlides}
      >
        <Slider>
          {this.createSlides()}
        </Slider>
        <ButtonBack className={classNames(styles.arrow, styles.arrowBack)}><Icons.BackArrow /></ButtonBack>
        <ButtonNext className={classNames(styles.arrow, styles.arrowNext)}><Icons.BackArrow /></ButtonNext>
      </CarouselProvider>
    )
  }
}
