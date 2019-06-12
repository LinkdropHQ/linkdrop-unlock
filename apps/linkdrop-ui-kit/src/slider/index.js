import React from 'react'
import Slider from 'react-slick'
import styles from './styles.module'
import { Icons } from 'src'
import classNames from 'classnames'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

class SimpleSlider extends React.Component {
  render () {
    const { children = [], className, step, visibleSlides } = this.props
    var settings = {
      infinite: true,
      speed: 500,
      slidesToShow: visibleSlides,
      slidesToScroll: step,
      arrows: true,
      prevArrow: <div className={styles.arrowBack}><Icons.BackArrow className={styles.arrowBack} /></div>,
      nextArrow: <div><Icons.BackArrow className={styles.arrowNext} /></div>
    }
    return <div className={classNames(styles.container, className)}>
      <Slider {...settings}>
        {children}
      </Slider>
    </div>
  }
}

export default SimpleSlider
