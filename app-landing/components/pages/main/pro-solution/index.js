import React from 'react'
import { translate } from 'decorators'
import commonStyles from '../styles.module'
import styles from './styles.module'
import { Icons, Button } from 'linkdrop-ui-kit'
import { LinkBlock } from 'components/pages/common'

@translate('pages.main')
class ProSolution extends React.Component {
  render () {
    return <LinkBlock title={this.t('titles.linkdropPro')}>
      <div className={styles.description}>{this.t('descriptions.linkdropPro')}</div>
      <div className={styles.list}>
        {LIST_ITEMS.map(item => <div className={styles.listItem}>
          <Icons.CheckSmall /> {this.t(`titles.${item}`)}
        </div>)}
      </div>
      <Button className={styles.button}>
        {this.t('buttons.tryForFree')}
      </Button>
    </LinkBlock>
  }
}

export default ProSolution

const LIST_ITEMS = [
  'multipleLinkes',
  'analytics',
  'expiredLinks',
  'cs'
]
