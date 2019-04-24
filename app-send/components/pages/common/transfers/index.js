import React from 'react'
import { Button, Icons, IconedLink } from 'linkdrop-ui-kit'
import text from 'texts'
import classNames from 'classnames'
import { actions, translate } from 'decorators'
import Item from './item'
import { Scrollbars } from 'react-custom-scrollbars'

import styles from './styles.module'

@actions(({ user: { transfers } }) => ({ transfers }))
@translate('pages.common.transfers')
class Transfers extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: true
    }
  }
  render () {
    const { collapsed } = this.state
    const { transfers } = this.props
    return <div className={classNames(styles.container, {
      [styles.collapsed]: collapsed,
      [styles.expanded]: !collapsed
    })}>
      <div className={styles.header}>
        <IconedLink icon={<Icons.Question />} className={styles.iconedLink} />
        <Button className={styles.button} inverted onClick={_ => {
          this.setState({
            collapsed: !collapsed
          })
        }}>
          <span className={styles.buttonText}>{text('common.buttons.transfers')}</span>
          <Icons.PolygonArrow />
        </Button>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{this.t('titles.main')}</div>
        <div className={styles.contentBody}>
          <Scrollbars style={{ height: '300px' }}>
            {transfers.map(({ amount, currency, status, link }) => <Item amount={amount} currency={currency} status={status} link={link} />)}
          </Scrollbars>
        </div>
        <Button
          onClick={_ => this.setState({
            collapsed: true
          })}
          className={styles.backButton}
          inverted
        >
          <Icons.BackArrow />{text('common.buttons.back')}
        </Button>
      </div>
    </div>
  }
}

export default Transfers
