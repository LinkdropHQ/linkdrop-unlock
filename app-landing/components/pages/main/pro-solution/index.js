import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import { Icons, Button } from 'linkdrop-ui-kit'
import { LinkBlock } from 'components/pages/common'

@translate('pages.main')
class ProSolution extends React.Component {
  render () {
    const { onClose } = this.props
    return <LinkBlock title={this.t('titles.wantMoreLinks')}>
      <div className={styles.container}>
        <div className={styles.close} onClick={_ => onClose && onClose()}>
          <Icons.Close />
        </div>
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: this.t('descriptions.massGenerate') }} />
        <div className={styles.list}>
          {LIST_ITEMS.map(item => <div className={styles.listItem}>
            <Icons.CheckSmall /> {this.t(`titles.${item}`)}
          </div>)}
        </div>
        <Button href='http://linkdrop.io/product' target='_blank' className={styles.button}>
          {this.t('buttons.learnMore')}
        </Button>
      </div>
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
