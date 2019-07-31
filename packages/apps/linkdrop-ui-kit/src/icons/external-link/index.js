import React from 'react'
import variables from 'variables'

const ExternalLink = props => (
  <svg width={20} height={20} fill='none' {...props}>
    <path
      d='M19.48 0h-5.194a.52.52 0 1 0 0 1.042h3.944L8.099 11.27a.52.52 0 0 0 .74.733l10.12-10.217v3.927a.52.52 0 0 0 1.041 0V.521A.52.52 0 0 0 19.48 0z'
      fill={props.fill || variables.blackColor}
    />
    <path
      d='M16.882 11.171a.52.52 0 0 0-.52.521v5.704c0 .861-.702 1.562-1.563 1.562H2.604c-.861 0-1.562-.7-1.562-1.562V5.2c0-.861.7-1.562 1.562-1.562h5.704a.52.52 0 0 0 0-1.042H2.604A2.607 2.607 0 0 0 0 5.201v12.195A2.607 2.607 0 0 0 2.604 20H14.8a2.607 2.607 0 0 0 2.604-2.604v-5.704a.52.52 0 0 0-.52-.52z'
      fill={props.fill || variables.blackColor}
    />
  </svg>
)

export default ExternalLink
