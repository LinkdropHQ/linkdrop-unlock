import React from 'react'
import styles from './styles.module'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class NftItem extends React.Component {
  render () {
    const { img, name, description, selected, onClick, id } = this.props
    return <div
      className={classNames(styles.container, {
        [styles.selected]: selected,
        [styles.selectable]: onClick
      })}
      onClick={_ => onClick && onClick({ id })}
    >
      <div className={styles.imageBlock}>
        <img src={img} />
      </div>
      <div className={styles.content}>
        <div className={styles.name}>{name}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </div>
  }
}

NftItem.propTypes = {
  img: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

export default NftItem
