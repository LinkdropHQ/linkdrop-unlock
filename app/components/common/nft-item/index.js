import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'

class NftItem extends React.Component {
  render () {
    const { img, name, description } = this.props
    return <div className={styles.container}>
      <div className={styles.imageBlock}>
        <img src={img} />
      </div>
      <div className={styles.name}>{name}</div>
      <div className={styles.description}>{description}</div>
    </div>
  }
}

NftItem.propTypes = {
  img: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string
}

export default NftItem
