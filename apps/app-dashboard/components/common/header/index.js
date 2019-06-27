import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { withRouter } from 'react-router'
import text from 'texts'
import ProgressBar from './progress-bar'

@actions(({ user: { step } }) => ({ step }))
@translate('common.header')
class Header extends React.Component {
  render () {
    const { step } = this.props
    const currentPage = this.defineCurrentPage()
    return <header className={styles.container}>
      <div className={styles.title}>
        {currentPage}
      </div>
      {step && <ProgressBar stepsCount={4} currentStep={step} />}
    </header>
  }

  defineCurrentPage () {
    const { location: { pathname } } = this.props
    console.log(this.props)
    if (pathname === '/campaigns') { return text('common.paths.campaigns') }
    if (pathname === '/campaigns/create') { return text('common.paths.campaignsCreate') }
    if (pathname.indexOf('/campaigns/') > -1) { return text('common.paths.campaignsId') }
    if (pathname === '/') { return text('common.paths.dashboard') }
    return text(`common.paths.notFound`)
  }
}

export default withRouter(Header)
