import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'

class Footer extends React.Component {
  render () {
    const { content, href } = this.props
    return <footer className={classNames(styles.container, {
      [styles.withLink]: href
    })}>
      {this.renderContent({ content, href })}
    </footer>
  }

  renderContent ({ content, href }) {
    const contentFinal = { __html: content }
    if (href) { return <a targer='_blank' href={href} dangerouslySetInnerHTML={contentFinal} /> }
    return <div dangerouslySetInnerHTML={contentFinal} />
  }
}

export default Footer
